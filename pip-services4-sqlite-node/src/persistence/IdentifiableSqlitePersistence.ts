/** @module persistence */
import { AnyValueMap } from 'pip-services4-commons-node';
import { IIdentifiable } from 'pip-services4-data-node';
import { IdGenerator } from 'pip-services4-data-node';

import { IWriter } from 'pip-services4-persistence-node';
import { IGetter } from 'pip-services4-persistence-node';
import { ISetter } from 'pip-services4-persistence-node';

import { SqlitePersistence } from './SqlitePersistence';
import { IContext } from 'pip-services4-components-node';

/**
 * Abstract persistence component that stores data in SQLite
 * and implements a number of CRUD operations over data items with unique ids.
 * The data items must implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/data.iidentifiable.html IIdentifiable]] interface.
 * 
 * In basic scenarios child classes shall only override [[getPageByFilter]],
 * [[getListByFilter]] or [[deleteByFilter]] operations with specific filter function.
 * All other operations can be used out of the box. 
 * 
 * In complex scenarios child classes can implement additional operations by 
 * accessing <code>this._collection</code> and <code>this._model</code> properties.

 * ### Configuration parameters ###
 * 
 * - table:                  (optional) SQLite table name
 * - schema:                  (optional) SQLite schema name
 * - connection(s):    
 *   - discovery_key:             (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - database:                  database file path
 *   - uri:                       resource URI with file:// protocol
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages components to pass log messages
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credentials
 * 
 * ### Example ###
 * 
 *     class MySqlitePersistence extends IdentifiableSqlitePersistence<MyData, string> {
 *    
 *     public constructor() {
 *         super("mydata");
 *     }
 * 
 *     private composeFilter(filter: FilterParams): any {
 *         filter = filter || new FilterParams();
 *         let criteria = [];
 *         let name = filter.getAsNullableString('name');
 *         if (name != null)
 *             criteria.push("name='" + name + "'");
 *         return criteria.length > 0 ? criteria.join(" AND ") : null;
 *     }
 * 
 *     public getPageByFilter(context: IContext, filter: FilterParams,
 *         paging: PagingParams): Promise<DataPage<MyData>> {
 *         return base.getPageByFilter(context, this.composeFilter(filter), paging, null, null);
 *     }
 * 
 *     }
 * 
 *     let persistence = new MySqlitePersistence();
 *     persistence.configure(ConfigParams.fromTuples(
 *         "connection.database", "./data/mydb.db"
 *     ));
 * 
 *     await persitence.open("123");
 * 
 *     let item = await = persistence.create("123", { id: "1", name: "ABC" });
 *     let page = await persistence.getPageByFilter(
 *         "123",
 *         FilterParams.fromTuples("name", "ABC"),
 *         null
 *     );
 *     console.log(page.data);          // Result: { id: "1", name: "ABC" }
 * 
 *     await persistence.deleteById("123", "1");
 */
export class IdentifiableSqlitePersistence<T extends IIdentifiable<K>, K> extends SqlitePersistence<T>
    implements IWriter<T, K>, IGetter<T, K>, ISetter<T> {
    /**
     * Flag to turn on automated string ID generation
     */
    protected _autoGenerateId = true;

    /**
     * Creates a new instance of the persistence component.
     * 
     * @param collection    (optional) a collection name.
     */
    public constructor(tableName: string) {
        super(tableName);

        if (tableName == null) {
            throw new Error("Table name could not be null");
        }
    }

    /** 
     * Converts the given object from the public partial format.
     * 
     * @param value     the object to convert from the public partial format.
     * @returns the initial object.
     */
    protected convertFromPublicPartial(value: any): any {
        return this.convertFromPublic(value);
    }    
    
    /**
     * Gets a list of data items retrieved by given unique ids.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param ids               ids of data items to be retrieved
     * @returns                 a list with requested data items.
     */
    public async getListByIds(context: IContext, ids: K[]): Promise<T[]> {
        const params = this.generateParameters(ids);
        const query = "SELECT * FROM " + this.quotedTableName()
            + " WHERE id IN(" + params + ")";

        let items = await new Promise<any[]>((resolve, reject) => {
            this._client.all(query, ids, (err, result) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        })

        this._logger.trace(context, "Retrieved %d from %s", items.length, this._tableName);
                
        items = items.map(this.convertToPublic);
        return items;
    }

    /**
     * Gets a data item by its unique id.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param id                an id of data item to be retrieved.
     * @returns                 the requested data item or <code>null</code>.
     */
    public async getOneById(context: IContext, id: K): Promise<T> {
        const query = "SELECT * FROM " + this.quotedTableName() + " WHERE id=?";
        const params = [ id ];

        let item = await new Promise<any>((resolve, reject) => {
            this._client.get(query, params, (err, result) => {
                if (err != null) {
                    reject(err);
                    return;
                }

                resolve(result);
            });
        });

        if (item == null) {
            this._logger.trace(context, "Nothing found from %s with id = %s", this._tableName, id);
        } else {
            this._logger.trace(context, "Retrieved from %s with id = %s", this._tableName, id);
        }

        item = item != null ? this.convertToPublic(item) : null;
        return item;
    }

    /**
     * Creates a data item.
     * 
     * @param trace_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be created.
     * @returns                 the created item.
     */
    public async create(context: IContext, item: T): Promise<T> {
        if (item == null) {
            return null;
        }

        // Assign unique id
        let newItem: any = item;
        if (newItem.id == null && this._autoGenerateId) {
            newItem = Object.assign({}, newItem);
            newItem.id = item.id || IdGenerator.nextLong();
        }

        return await super.create(context, newItem);
    }

    /**
     * Sets a data item. If the data item exists it updates it,
     * otherwise it create a new data item.
     * 
     * @param trace_id    (optional) transaction id to trace execution through call chain.
     * @param item              a item to be set.
     * @returns                 the updated item.
     */
    public async set(context: IContext, item: T): Promise<T> {
        if (item == null) {
            return null;
        }

        // Assign unique id
        if (item.id == null && this._autoGenerateId) {
            item = Object.assign({}, item);
            item.id = <any>IdGenerator.nextLong();
        }

        const row = this.convertFromPublic(item);
        const columns = this.generateColumns(row);
        const params = this.generateParameters(row);
        const setParams = this.generateSetParameters(row);
        const values = this.generateValues(row);
        values.push(...values);

        let query = "INSERT INTO " + this.quotedTableName()
            + " (" + columns + ") VALUES (" + params + ")";
        query += " ON CONFLICT(id) DO UPDATE SET " + setParams;

        return await new Promise((resolve, reject) => {
            this._client.serialize(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._client.run(query, values, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }

                    this._logger.trace(context, "Set in %s with id = %s", this.quotedTableName(), item.id);
                    
                    const query = "SELECT * FROM " + this.quotedTableName() + " WHERE id=?";
                    this._client.get(query, [item.id], (err, result) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }

                        const newItem = result ? this.convertToPublic(result) : null;
                        resolve(newItem);
                    });
                });
            });
        });
    }

    /**
     * Updates a data item.
     * 
     * @param trace_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be updated.
     * @returns                 the updated item.
     */
    public async update(context: IContext, item: T): Promise<T> {
        if (item == null || item.id == null) {
            return null;
        }

        const row = this.convertFromPublic(item);
        const params = this.generateSetParameters(row);
        const values = this.generateValues(row);
        values.push(item.id);

        const query = "UPDATE " + this.quotedTableName()
            + " SET " + params + " WHERE id=?";

        return await new Promise((resolve, reject) => {
            this._client.serialize(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._client.run(query, values, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }

                    this._logger.trace(context, "Updated in %s with id = %s", this._tableName, item.id);

                    const query = "SELECT * FROM " + this.quotedTableName() + " WHERE id=?";
                    this._client.get(query, [item.id], (err, result) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }

                        const newItem = result ? this.convertToPublic(result) : null;
                        resolve(newItem);
                    });
                });    
            });
        });
    }

    /**
     * Updates only few selected fields in a data item.
     * 
     * @param trace_id    (optional) transaction id to trace execution through call chain.
     * @param id                an id of data item to be updated.
     * @param data              a map with fields to be updated.
     * @returns                 the updated item.
     */
    public async updatePartially(context: IContext, id: K, data: AnyValueMap): Promise<T> {
        if (data == null || id == null) {
            return null;
        }

        const row = this.convertFromPublicPartial(data.getAsObject());
        const params = this.generateSetParameters(row);
        const values = this.generateValues(row);
        values.push(id);

        const query = "UPDATE " + this.quotedTableName()
            + " SET " + params + " WHERE id=?";

        return await new Promise((resolve, reject) => {
            this._client.serialize(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._client.run(query, values, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }

                    this._logger.trace(context, "Updated partially in %s with id = %s", this._tableName, id);

                    const query = "SELECT * FROM " + this.quotedTableName() + " WHERE id=?";
                    this._client.get(query, [id], (err, result) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }
            
                        const newItem = result ? this.convertToPublic(result) : null;
                        resolve(newItem);
                    });
                });    
            });
        });
    }

    /**
     * Deleted a data item by it's unique id.
     * 
     * @param trace_id    (optional) transaction id to trace execution through call chain.
     * @param id                an id of the item to be deleted
     * @returns                 the deleted item.
     */
    public deleteById(context: IContext, id: K): Promise<T> {
        const query = "SELECT * FROM " + this.quotedTableName() + " WHERE id=?"

        return new Promise((resolve, reject) => {
            this._client.serialize(() => {
                this._client.get(query, [ id ], (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
        
                    const newItem = result != null ? this.convertToPublic(result) : null;

                    // Skip if there is nothing to delete
                    if (newItem == null) {
                        resolve(null);
                        return;
                    }
        
                    const query = "DELETE FROM " + this.quotedTableName() + " WHERE id=?";
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    this._client.run(query, [ id ], (err, result) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }

                        this._logger.trace(context, "Deleted from %s with id = %s", this._tableName, id);
                    
                        resolve(newItem);
                    });
                });
            });
        });
    }

    /**
     * Deletes multiple data items by their unique ids.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param ids               ids of data items to be deleted.
     */
    public async deleteByIds(context: IContext, ids: K[]): Promise<void> {
        const params = this.generateParameters(ids);
        const query = "DELETE FROM " + this.quotedTableName()
            + " WHERE id IN(" + params + ")";

        const count = await new Promise<number>((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this._client.run(query, ids, (err, result) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                const count = 0; //result ? result.affectedRows : 0;
                resolve(count);
            });
        });

        this._logger.trace(context, "Deleted %d items from %s", count, this._tableName);
    }
}
