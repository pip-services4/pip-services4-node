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
exports.IdentifiableCassandraPersistence = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const CassandraPersistence_1 = require("./CassandraPersistence");
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
class IdentifiableCassandraPersistence extends CassandraPersistence_1.CassandraPersistence {
    /**
     * Creates a new instance of the persistence component.
     *
     * @param tableName    (optional) a table name.
     * @param keyspaceName    (optional) a keyspace name.
     */
    constructor(tableName, keyspaceName) {
        super(tableName, keyspaceName);
        /**
         * Flag to turn on automated string ID generation
         */
        this._autoGenerateId = true;
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
     * @param context     (optional) a context to trace execution through call chain.
     * @param ids               ids of data items to be retrieved
     * @returns                 a list with requested data items.
     */
    getListByIds(context, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = this.generateParameters(ids);
            let query = "SELECT * FROM " + this.quotedTableName()
                + " WHERE \"id\" IN(" + params + ")";
            let result = yield this._client.execute(query, ids);
            let items = result.rows;
            this._logger.trace(context, "Retrieved %d from %s", items.length, this._tableName);
            items = items.map(this.convertToPublic);
            return items;
        });
    }
    /**
     * Gets a data item by its unique id.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param id                an id of data item to be retrieved.
     * @returns                 a found data item or <code>null</code>.
     */
    getOneById(context, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "SELECT * FROM " + this.quotedTableName() + " WHERE \"id\"=?";
            let params = [id];
            let result = yield this._client.execute(query, params);
            let item = result && result.rows ? result.rows[0] || null : null;
            if (item == null) {
                this._logger.trace(context, "Nothing found from %s with id = %s", this._tableName, id);
            }
            else {
                this._logger.trace(context, "Retrieved from %s with id = %s", this._tableName, id);
            }
            item = this.convertToPublic(item);
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
                newItem.id = item.id || pip_services4_commons_node_1.IdGenerator.nextLong();
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
        // In Cassandra INSERT overrides existing row
        return this.create(context, item);
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
            // Remove id since Cassandra does not allow updating PK
            row = Object.assign({}, row);
            delete row.id;
            let params = this.generateSetParameters(row);
            let values = this.generateValues(row);
            values.push(item.id);
            let query = "UPDATE " + this.quotedTableName()
                + " SET " + params + " WHERE \"id\"=?";
            yield this._client.execute(query, values);
            this._logger.trace(context, "Updated in %s with id = %s", this._tableName, item.id);
            return item;
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
            // Remove id since Cassandra does not allow updating PK
            row = Object.assign({}, row);
            delete row.id;
            let params = this.generateSetParameters(row);
            let values = this.generateValues(row);
            values.push(id);
            let query = "UPDATE " + this.quotedTableName()
                + " SET " + params + " WHERE \"id\"=?";
            yield this._client.execute(query, values);
            query = "SELECT * FROM " + this.quotedTableName() + " WHERE \"id\"=?";
            let result = yield this._client.execute(query, [id]);
            let newItem = result && result.rows && result.rows.length == 1
                ? result.rows[0] : null;
            this._logger.trace(context, "Updated partially in %s with id = %s", this._tableName, id);
            newItem = this.convertToPublic(newItem);
            return newItem;
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
        return __awaiter(this, void 0, void 0, function* () {
            let values = [id];
            let query = "SELECT * FROM " + this.quotedTableName() + " WHERE \"id\"=?";
            let result = yield this._client.execute(query, values);
            let oldItem = result && result.rows && result.rows.length == 1
                ? result.rows[0] : null;
            if (oldItem != null) {
                query = "DELETE FROM " + this.quotedTableName() + " WHERE \"id\"=?";
                yield this._client.execute(query, values);
                this._logger.trace(context, "Deleted from %s with id = %s", this._tableName, id);
            }
            oldItem = this.convertToPublic(oldItem);
            return oldItem;
        });
    }
    /**
     * Deletes multiple data items by their unique ids.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param ids               ids of data items to be deleted.
     */
    deleteByIds(context, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = this.generateParameters(ids);
            let query = "DELETE FROM " + this.quotedTableName()
                + " WHERE \"id\" IN(" + params + ")";
            yield this._client.execute(query, ids);
            // We can't optimally determine how many records were deleted
            this._logger.trace(context, "Deleted a few items from %s", this._tableName);
        });
    }
}
exports.IdentifiableCassandraPersistence = IdentifiableCassandraPersistence;
//# sourceMappingURL=IdentifiableCassandraPersistence.js.map