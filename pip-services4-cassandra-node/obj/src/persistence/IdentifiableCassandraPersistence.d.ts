/** @module persistence */
import { AnyValueMap } from 'pip-services4-commons-node';
import { IIdentifiable } from 'pip-services4-commons-node';
import { IWriter } from 'pip-services4-persistence-node';
import { IGetter } from 'pip-services4-persistence-node';
import { ISetter } from 'pip-services4-persistence-node';
import { CassandraPersistence } from './CassandraPersistence';
/**
 * Abstract persistence component that stores data in Cassandra
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
 * - table:                       (optional) Cassandra table name
 * - keyspace:                    (optional) Cassandra keyspace name
 * - connection(s):
 *   - discovery_key:             (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - host:                      host name or IP address
 *   - port:                      port number (default: 27017)
 *   - uri:                       resource URI or connection string with all parameters in it
 * - credential(s):
 *   - store_key:                 (optional) a key to retrieve the credentials from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/auth.icredentialstore.html ICredentialStore]]
 *   - username:                  (optional) user name
 *   - password:                  (optional) user password
 * - options:
 *   - connect_timeout:      (optional) number of milliseconds to wait before timing out when connecting a new client (default: 0)
 *   - idle_timeout:         (optional) number of milliseconds a client must sit idle in the pool and not be checked out (default: 10000)
 *   - max_pool_size:        (optional) maximum number of clients the pool should contain (default: 10)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages components to pass log messages
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credentials
 *
 * ### Example ###
 *
 *     class MyCassandraPersistence extends IdentifiableCassandraPersistence<MyData, string> {
 *
 *     public constructor() {
 *         base("mydata", new MyDataCassandraSchema());
 *     }
 *
 *     private composeFilter(filter: FilterParams): any {
 *         filter = filter || new FilterParams();
 *         let criteria = [];
 *         let name = filter.getAsNullableString('name');
 *         if (name != null)
 *             criteria.push({ name: name });
 *         return criteria.length > 0 ? { $and: criteria } : null;
 *     }
 *
 *     public getPageByFilter(context: IContext, filter: FilterParams,
 *         paging: PagingParams): Promise<DataPage<MyData>> {
 *         return base.getPageByFilter(context, this.composeFilter(filter), paging, null, null);
 *     }
 *
 *     }
 *
 *     let persistence = new MyCassandraPersistence();
 *     persistence.configure(ConfigParams.fromTuples(
 *         "host", "localhost",
 *         "port", 27017
 *     ));
 *
 *     await persitence.open("123");
 *
 *     let item = await persistence.create("123", { id: "1", name: "ABC" });
 *     let page = await persistence.getPageByFilter(
 *       "123",
 *       FilterParams.fromTuples("name", "ABC"),
 *       null
 *     );
 *     console.log(page.data);          // Result: { id: "1", name: "ABC" }
 *
 *     await persistence.deleteById("123", "1");
 */
export declare class IdentifiableCassandraPersistence<T extends IIdentifiable<K>, K> extends CassandraPersistence<T> implements IWriter<T, K>, IGetter<T, K>, ISetter<T> {
    /**
     * Flag to turn on automated string ID generation
     */
    protected _autoGenerateId: boolean;
    /**
     * Creates a new instance of the persistence component.
     *
     * @param tableName    (optional) a table name.
     * @param keyspaceName    (optional) a keyspace name.
     */
    constructor(tableName: string, keyspaceName?: string);
    /**
     * Converts the given object from the public partial format.
     *
     * @param value     the object to convert from the public partial format.
     * @returns the initial object.
     */
    protected convertFromPublicPartial(value: any): any;
    /**
     * Gets a list of data items retrieved by given unique ids.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param ids               ids of data items to be retrieved
     * @returns                 a list with requested data items.
     */
    getListByIds(context: IContext, ids: K[]): Promise<T[]>;
    /**
     * Gets a data item by its unique id.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param id                an id of data item to be retrieved.
     * @returns                 a found data item or <code>null</code>.
     */
    getOneById(context: IContext, id: K): Promise<T>;
    /**
     * Creates a data item.
     *
     * @param trace_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be created.
     * @returns                 the created item.
     */
    create(context: IContext, item: T): Promise<T>;
    /**
     * Sets a data item. If the data item exists it updates it,
     * otherwise it create a new data item.
     *
     * @param trace_id    (optional) transaction id to trace execution through call chain.
     * @param item              a item to be set.
     * @returns                 the updated item.
     */
    set(context: IContext, item: T): Promise<T>;
    /**
     * Updates a data item.
     *
     * @param trace_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be updated.
     * @returns                 the updated item.
     */
    update(context: IContext, item: T): Promise<T>;
    /**
     * Updates only few selected fields in a data item.
     *
     * @param trace_id    (optional) transaction id to trace execution through call chain.
     * @param id                an id of data item to be updated.
     * @param data              a map with fields to be updated.
     * @returns                 the updated item.
     */
    updatePartially(context: IContext, id: K, data: AnyValueMap): Promise<T>;
    /**
     * Deleted a data item by it's unique id.
     *
     * @param trace_id    (optional) transaction id to trace execution through call chain.
     * @param id                an id of the item to be deleted
     * @returns                 the deleted item.
     */
    deleteById(context: IContext, id: K): Promise<T>;
    /**
     * Deletes multiple data items by their unique ids.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param ids               ids of data items to be deleted.
     */
    deleteByIds(context: IContext, ids: K[]): Promise<void>;
}
