"use strict";
/** @module persistence */
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
exports.IdentifiableCouchbasePersistence = void 0;
const CouchbasePersistence_1 = require("./CouchbasePersistence");
const pip_services4_data_node_1 = require("pip-services4-data-node");
/**
 * Abstract persistence component that stores data in Couchbase
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
 * - bucket:                      (optional) Couchbase bucket name
 * - collection:                  (optional) Couchbase collection name
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
 *   - max_pool_size:             (optional) maximum connection pool size (default: 2)
 *   - keep_alive:                (optional) enable connection keep alive (default: true)
 *   - connect_timeout:           (optional) connection timeout in milliseconds (default: 5 sec)
 *   - auto_reconnect:            (optional) enable auto reconnection (default: true)
 *   - max_page_size:             (optional) maximum page size (default: 100)
 *   - debug:                     (optional) enable debug output (default: false).
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages components to pass log messages
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credentials
 *
 * ### Example ###
 *
 *     class MyCouchbasePersistence extends CouchbasePersistence<MyData, string> {
 *
 *     public constructor() {
 *         base("mybucket", "mydata", new MyDataCouchbaseSchema());
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
 *     let persistence = new MyCouchbasePersistence();
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
 */
class IdentifiableCouchbasePersistence extends CouchbasePersistence_1.CouchbasePersistence {
    /**
     * Creates a new instance of the persistence component.
     *
     * @param bucket    (optional) a bucket name.
     * @param collection    (optional) a collection name.
     */
    constructor(bucket, collection) {
        super(bucket, collection);
        /**
         * Flag to turn on automated string ID generation
         */
        this._autoGenerateId = true;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        super.configure(config);
        this._maxPageSize = config.getAsIntegerWithDefault("options.max_page_size", this._maxPageSize);
        this._collectionName = config.getAsStringWithDefault("collection", this._collectionName);
    }
    /**
     * Generates a list of unique ids for specific collection in the bucket
     * @param value a public unique ids.
     * @returns a unique bucket ids.
     */
    generateBucketIds(value) {
        if (value == null)
            return null;
        return value.map((id) => { return this.generateBucketId(id); });
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
            const objectIds = this.generateBucketIds(ids);
            let items = yield new Promise((resolve, reject) => {
                this._bucket.getMulti(objectIds, (count, items) => {
                    // Convert to array of results
                    items = Object.values(items);
                    // Define the error
                    let err = null;
                    if (count > 0 && count == objectIds.length) {
                        err = items[0].error;
                        // Ignore "Key does not exist on the server" error
                        if (err && err.message && err.code == 13)
                            err = null;
                    }
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve(items);
                });
            });
            this._logger.trace(context, "Retrieved %d from %s", items.length, this._bucketName);
            items = items.map(item => item.value);
            items = items.filter((item) => item != null);
            items = items.map(this.convertToPublic);
            return items;
        });
    }
    /**
     * Gets a data item by its unique id.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param id                an id of data item to be retrieved.
     * @returns                 a found data item.
     */
    getOneById(context, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = this.generateBucketId(id);
            let item = yield new Promise((resolve, reject) => {
                this._bucket.get(objectId, (err, result) => {
                    // Ignore "Key does not exist on the server" error
                    if (err && err.message && err.code == 13)
                        err = null;
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    const item = result != null ? result.value : null;
                    resolve(item);
                });
            });
            this._logger.trace(context, "Retrieved from %s by id = %s", this._bucketName, objectId);
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
            let newItem = item;
            // Assign unique id
            if (newItem.id == null && this._autoGenerateId) {
                const _item = Object.assign({}, item);
                _item.id = pip_services4_data_node_1.IdGenerator.nextLong();
                newItem = _item;
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
            let newItem = item;
            // Assign unique id
            if (newItem.id == null && this._autoGenerateId) {
                const _item = Object.assign({}, item);
                _item.id = pip_services4_data_node_1.IdGenerator.nextLong();
                newItem = _item;
            }
            const id = newItem.id.toString();
            const objectId = this.generateBucketId(id);
            newItem = this.convertFromPublic(newItem);
            yield new Promise((resolve, reject) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._bucket.upsert(objectId, newItem, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
            this._logger.trace(context, "Set in %s with id = %s", this._bucketName, id);
            newItem = this.convertToPublic(newItem);
            return newItem;
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
            let newItem = Object.assign(item);
            newItem = this.convertFromPublic(newItem);
            const id = newItem.id.toString();
            const objectId = this.generateBucketId(id);
            yield new Promise((resolve, reject) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._bucket.replace(objectId, newItem, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
            this._logger.trace(context, "Updated in %s with id = %s", this._bucketName, id);
            newItem = this.convertToPublic(newItem);
            return newItem;
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
            let newItem = data.getAsObject();
            newItem = this.convertFromPublicPartial(newItem);
            const objectId = this.generateBucketId(id);
            // Todo: repeat until update is successful
            const result = yield new Promise((resolve, reject) => {
                this._bucket.get(objectId, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            });
            if (result == null || result.value == null) {
                return null;
            }
            const objectValue = Object.assign(result.value, newItem);
            yield new Promise((resolve, reject) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._bucket.replace(objectId, objectValue, { cas: result.cas }, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
            this._logger.trace(context, "Updated partially in %s with id = %s", this._bucketName, id);
            newItem = this.convertToPublic(objectValue);
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
            const objectId = this.generateBucketId(id);
            let oldItem = yield new Promise((resolve, reject) => {
                this._bucket.get(objectId, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    const item = result != null ? result.value : null;
                    resolve(item);
                });
            });
            yield new Promise((resolve, reject) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this._bucket.remove(objectId, (err, result) => {
                    // Ignore "Key does not exist on the server" error
                    if (err && err.message && err.code == 13)
                        err = null;
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
            this._logger.trace(context, "Deleted from %s with id = %s", this._bucketName, id);
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
            let count = 0;
            for (const id of ids) {
                const objectId = this.generateBucketId(id);
                const deleted = yield new Promise((resolve, reject) => {
                    this._bucket.remove(objectId, (err) => {
                        // Ignore "Key does not exist on the server" error
                        if (err && err.message && err.code == 13) {
                            resolve(false);
                        }
                        else if (err == null) {
                            resolve(true);
                        }
                        else {
                            reject(err);
                        }
                    });
                });
                if (deleted) {
                    count++;
                }
            }
            this._logger.trace(context, "Deleted %d items from %s", count, this._bucketName);
        });
    }
}
exports.IdentifiableCouchbasePersistence = IdentifiableCouchbasePersistence;
//# sourceMappingURL=IdentifiableCouchbasePersistence.js.map