"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifiableSqlitePersistence = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const SqlitePersistence_1 = require("./SqlitePersistence");
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
class IdentifiableSqlitePersistence extends SqlitePersistence_1.SqlitePersistence {
    /**
     * Creates a new instance of the persistence component.
     *
     * @param collection    (optional) a collection name.
     */
    constructor(tableName) {
        super(tableName);
        /**
         * Flag to turn on automated string ID generation
         */
        this._autoGenerateId = true;
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
    convertFromPublicPartial(value) {
        return this.convertFromPublic(value);
    }
    /**
     * Gets a list of data items retrieved by given unique ids.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param ids               ids of data items to be retrieved
     * @returns                 a list with requested data items.
     */
    getListByIds(context, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = this.generateParameters(ids);
            let query = "SELECT * FROM " + this.quotedTableName()
                + " WHERE id IN(" + params + ")";
            let items = yield new Promise((resolve, reject) => {
                this._client.all(query, ids, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            });
            this._logger.trace(context, "Retrieved %d from %s", items.length, this._tableName);
            items = items.map(this.convertToPublic);
            return items;
        });
    }
    /**
     * Gets a data item by its unique id.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param id                an id of data item to be retrieved.
     * @returns                 the requested data item or <code>null</code>.
     */
    getOneById(context, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "SELECT * FROM " + this.quotedTableName() + " WHERE id=?";
            let params = [id];
            let item = yield new Promise((resolve, reject) => {
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
            }
            else {
                this._logger.trace(context, "Retrieved from %s with id = %s", this._tableName, id);
            }
            item = item != null ? this.convertToPublic(item) : null;
            return item;
        });
    }
    /**
     * Creates a data item.
     *
     * @param trace_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be created.
     * @returns                 the created item.
     */
    create(context, item) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (item == null) {
                return null;
            }
            // Assign unique id
            let newItem = item;
            if (newItem.id == null && this._autoGenerateId) {
                newItem = Object.assign({}, newItem);
                newItem.id = item.id || pip_services3_commons_node_1.IdGenerator.nextLong();
            }
            return yield _super.create.call(this, context, newItem);
        });
    }
    /**
     * Sets a data item. If the data item exists it updates it,
     * otherwise it create a new data item.
     *
     * @param trace_id    (optional) transaction id to trace execution through call chain.
     * @param item              a item to be set.
     * @returns                 the updated item.
     */
    set(context, item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (item == null) {
                return null;
            }
            // Assign unique id
            if (item.id == null && this._autoGenerateId) {
                item = Object.assign({}, item);
                item.id = pip_services3_commons_node_1.IdGenerator.nextLong();
            }
            let row = this.convertFromPublic(item);
            let columns = this.generateColumns(row);
            let params = this.generateParameters(row);
            let setParams = this.generateSetParameters(row);
            let values = this.generateValues(row);
            values.push(...values);
            let query = "INSERT INTO " + this.quotedTableName()
                + " (" + columns + ") VALUES (" + params + ")";
            query += " ON CONFLICT(id) DO UPDATE SET " + setParams;
            return yield new Promise((resolve, reject) => {
                this._client.serialize(() => {
                    this._client.run(query, values, (err, result) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }
                        this._logger.trace(context, "Set in %s with id = %s", this.quotedTableName(), item.id);
                        let query = "SELECT * FROM " + this.quotedTableName() + " WHERE id=?";
                        this._client.get(query, [item.id], (err, result) => {
                            if (err != null) {
                                reject(err);
                                return;
                            }
                            let newItem = result ? this.convertToPublic(result) : null;
                            resolve(newItem);
                        });
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
    update(context, item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (item == null || item.id == null) {
                return null;
            }
            let row = this.convertFromPublic(item);
            let params = this.generateSetParameters(row);
            let values = this.generateValues(row);
            values.push(item.id);
            let query = "UPDATE " + this.quotedTableName()
                + " SET " + params + " WHERE id=?";
            return yield new Promise((resolve, reject) => {
                this._client.serialize(() => {
                    this._client.run(query, values, (err, result) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }
                        this._logger.trace(context, "Updated in %s with id = %s", this._tableName, item.id);
                        let query = "SELECT * FROM " + this.quotedTableName() + " WHERE id=?";
                        this._client.get(query, [item.id], (err, result) => {
                            if (err != null) {
                                reject(err);
                                return;
                            }
                            let newItem = result ? this.convertToPublic(result) : null;
                            resolve(newItem);
                        });
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
    updatePartially(context, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data == null || id == null) {
                return null;
            }
            let row = this.convertFromPublicPartial(data.getAsObject());
            let params = this.generateSetParameters(row);
            let values = this.generateValues(row);
            values.push(id);
            let query = "UPDATE " + this.quotedTableName()
                + " SET " + params + " WHERE id=?";
            return yield new Promise((resolve, reject) => {
                this._client.serialize(() => {
                    this._client.run(query, values, (err, result) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }
                        this._logger.trace(context, "Updated partially in %s with id = %s", this._tableName, id);
                        let query = "SELECT * FROM " + this.quotedTableName() + " WHERE id=?";
                        this._client.get(query, [id], (err, result) => {
                            if (err != null) {
                                reject(err);
                                return;
                            }
                            let newItem = result ? this.convertToPublic(result) : null;
                            resolve(newItem);
                        });
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
    deleteById(context, id) {
        let query = "SELECT * FROM " + this.quotedTableName() + " WHERE id=?";
        return new Promise((resolve, reject) => {
            this._client.serialize(() => {
                this._client.get(query, [id], (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    let newItem = result != null ? this.convertToPublic(result) : null;
                    // Skip if there is nothing to delete
                    if (newItem == null) {
                        resolve(null);
                        return;
                    }
                    let query = "DELETE FROM " + this.quotedTableName() + " WHERE id=?";
                    this._client.run(query, [id], (err, result) => {
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
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param ids               ids of data items to be deleted.
     */
    deleteByIds(context, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = this.generateParameters(ids);
            let query = "DELETE FROM " + this.quotedTableName()
                + " WHERE id IN(" + params + ")";
            let count = yield new Promise((resolve, reject) => {
                this._client.run(query, ids, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    let count = 0; //result ? result.affectedRows : 0;
                    resolve(count);
                });
            });
            this._logger.trace(context, "Deleted %d items from %s", count, this._tableName);
        });
    }
}
exports.IdentifiableSqlitePersistence = IdentifiableSqlitePersistence;
//# sourceMappingURL=IdentifiableSqlitePersistence.js.map