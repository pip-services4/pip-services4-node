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
exports.IdentifiableJsonPostgresPersistence = void 0;
const IdentifiablePostgresPersistence_1 = require("./IdentifiablePostgresPersistence");
/**
 * Abstract persistence component that stores data in PostgreSQL in JSON or JSONB fields
 * and implements a number of CRUD operations over data items with unique ids.
 * The data items must implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/data.iidentifiable.html IIdentifiable]] interface.
 *
 * The JSON table has only two fields: id and data.
 *
 * In basic scenarios child classes shall only override [[getPageByFilter]],
 * [[getListByFilter]] or [[deleteByFilter]] operations with specific filter function.
 * All other operations can be used out of the box.
 *
 * In complex scenarios child classes can implement additional operations by
 * accessing <code>this._collection</code> and <code>this._model</code> properties.

 * ### Configuration parameters ###
 *
 * - table:                      (optional) PostgreSQL table name
 * - schema:                     (optional) PostgreSQL schema name
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
 *     class MyPostgresPersistence extends IdentifiablePostgresJsonPersistence<MyData, string> {
 *
 *     public constructor() {
 *         base("mydata", new MyDataPostgresSchema());
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
 *     let persistence = new MyPostgresPersistence();
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
 *     item = await persistence.deleteById("123", "1");
 *     ...
 */
class IdentifiableJsonPostgresPersistence extends IdentifiablePostgresPersistence_1.IdentifiablePostgresPersistence {
    /**
     * Creates a new instance of the persistence component.
     *
     * @param tableName    (optional) a table name.
     * @param schemaName    (optional) a schema name.
     */
    constructor(tableName, schemaName) {
        super(tableName, schemaName);
    }
    /**
     * Adds DML statement to automatically create JSON(B) table
     *
     * @param idType type of the id column (default: TEXT)
     * @param dataType type of the data column (default: JSONB)
     */
    ensureTable(idType = 'TEXT', dataType = 'JSONB') {
        if (this._schemaName != null) {
            const query = "CREATE SCHEMA IF NOT EXISTS " + this.quoteIdentifier(this._schemaName);
            this.ensureSchema(query);
        }
        const query = "CREATE TABLE IF NOT EXISTS " + this.quotedTableName()
            + " (\"id\" " + idType + " PRIMARY KEY, \"data\" " + dataType + ")";
        this.ensureSchema(query);
    }
    /**
     * Converts object value from internal to public format.
     *
     * @param value     an object in internal format to convert.
     * @returns converted object in public format.
     */
    convertToPublic(value) {
        if (value == null)
            return null;
        return value.data;
    }
    /**
     * Convert object value from public to internal format.
     *
     * @param value     an object in public format to convert.
     * @returns converted object in internal format.
     */
    convertFromPublic(value) {
        if (value == null)
            return null;
        const result = {
            id: value.id,
            data: value
        };
        return result;
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
            if (data == null || this.isEmpty(id)) {
                return null;
            }
            const query = "UPDATE " + this.quotedTableName() + " SET \"data\"=\"data\"||$2 WHERE \"id\"=$1 RETURNING *";
            const values = [id, data.getAsObject()];
            let newItem = yield new Promise((resolve, reject) => {
                this._client.query(query, values, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    const item = result && result.rows && result.rows.length == 1
                        ? result.rows[0] : null;
                    resolve(item);
                });
            });
            this._logger.trace(context, "Updated partially in %s with id = %s", this._tableName, id);
            newItem = this.convertToPublic(newItem);
            return newItem;
        });
    }
}
exports.IdentifiableJsonPostgresPersistence = IdentifiableJsonPostgresPersistence;
//# sourceMappingURL=IdentifiableJsonPostgresPersistence.js.map