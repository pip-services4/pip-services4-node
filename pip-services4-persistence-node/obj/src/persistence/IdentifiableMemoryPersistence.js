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
exports.IdentifiableMemoryPersistence = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
const MemoryPersistence_1 = require("./MemoryPersistence");
/**
 * Abstract persistence component that stores data in memory
 * and implements a number of CRUD operations over data items with unique ids.
 * The data items must implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/data.iidentifiable.html IIdentifiable interface]].
 *
 * In basic scenarios child classes shall only override [[getPageByFilter]],
 * [[getListByFilter]] or [[deleteByFilter]] operations with specific filter function.
 * All other operations can be used out of the box.
 *
 * In complex scenarios child classes can implement additional operations by
 * accessing cached items via this._items property and calling [[save]] method
 * on updates.
 *
 * @see [[MemoryPersistence]]
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>     (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 *
 * ### Examples ###
 *
 *     class MyMemoryPersistence extends IdentifiableMemoryPersistence<MyData, string> {
 *
 *         private composeFilter(filter: FilterParams): any {
 *             filter = filter || new FilterParams();
 *             let name = filter.getAsNullableString("name");
 *             return (item) => {
 *                 if (name != null && item.name != name)
 *                     return false;
 *                 return true;
 *             };
 *         }
 *
 *         public async getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): DataPage<MyData> {
 *             return await super.getPageByFilter(context, this.composeFilter(filter), paging, null, null);
 *         }
 *
 *     }
 *
 *     let persistence = new MyMemoryPersistence();
 *
 *     let item = await persistence.create("123", { id: "1", name: "ABC" });
 *
 *     let page = await persistence.getPageByFilter(
 *             "123",
 *             FilterParams.fromTuples("name", "ABC"),
 *             null
 *      );
 *      console.log(page.data);          // Result: { id: "1", name: "ABC" }
 *
 *      item = await persistence.deleteById("123", "1");
 */
class IdentifiableMemoryPersistence extends MemoryPersistence_1.MemoryPersistence {
    /**
     * Creates a new instance of the persistence.
     *
     * @param loader    (optional) a loader to load items from external datasource.
     * @param saver     (optional) a saver to save items to external datasource.
     */
    constructor(loader, saver) {
        super(loader, saver);
    }
    /**
     * Gets a list of data items retrieved by given unique ids.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param ids               ids of data items to be retrieved
     * @returns                 a list with found data items.
     */
    getListByIds(context, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = (item) => {
                return ids.some(id => id == item.id);
            };
            return yield this.getListByFilter(context, filter, null, null);
        });
    }
    /**
     * Gets a data item by its unique id.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param id                an id of data item to be retrieved.
     * @returns                 a found data item or <code>null</code> if nothing was found.
     */
    getOneById(context, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this._items.filter(item => item.id == id);
            const item = items.length > 0 ? items[0] : null;
            if (item != null) {
                this._logger.trace(context, "Retrieved item %s", id);
            }
            else {
                this._logger.trace(context, "Cannot find item by %s", id);
            }
            return item;
        });
    }
    /**
     * Creates a data item.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be created.
     * @returns                a created data item.
     */
    create(context, item) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (item.id == null) {
                // Clone the object
                item = Object.assign({}, item);
                pip_services4_commons_node_1.ObjectWriter.setProperty(item, "id", pip_services4_data_node_1.IdGenerator.nextLong());
            }
            return yield _super.create.call(this, context, item);
        });
    }
    /**
     * Sets a data item. If the data item exists it updates it,
     * otherwise it create a new data item.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param item              a item to be set.
     * @returns                 a set data item.
     */
    set(context, item) {
        return __awaiter(this, void 0, void 0, function* () {
            // Clone the object
            item = Object.assign({}, item);
            if (item.id == null) {
                pip_services4_commons_node_1.ObjectWriter.setProperty(item, "id", pip_services4_data_node_1.IdGenerator.nextLong());
            }
            const index = this._items.map(item => item.id).indexOf(item.id);
            if (index < 0) {
                this._items.push(item);
            }
            else {
                this._items[index] = item;
            }
            this._logger.trace(context, "Set item %s", item.id);
            yield this.save(context);
            return item;
        });
    }
    /**
     * Updates a data item.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be updated.
     * @returns                 the updated data item.
     */
    update(context, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this._items.map(item => item.id).indexOf(item.id);
            if (index < 0) {
                this._logger.trace(context, "Item %s was not found", item.id);
                return null;
            }
            // Clone the object
            item = Object.assign({}, item);
            this._items[index] = item;
            this._logger.trace(context, "Updated item %s", item.id);
            yield this.save(context);
            return item;
        });
    }
    /**
     * Updates only few selected fields in a data item.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param id                an id of data item to be updated.
     * @param data              a map with fields to be updated.
     * @returns                 the updated data item.
     */
    updatePartially(context, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this._items.map(item => item.id).indexOf(id);
            if (index < 0) {
                this._logger.trace(context, "Item %s was not found", id);
                return null;
            }
            let item = this._items[index];
            item = Object.assign(item, data.getAsObject());
            this._items[index] = item;
            this._logger.trace(context, "Partially updated item %s", id);
            yield this.save(context);
            return item;
        });
    }
    /**
     * Deleted a data item by it's unique id.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param id                an id of the item to be deleted
     * @returns                 the deleted data item.
     */
    deleteById(context, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this._items.map(item => item.id).indexOf(id);
            const item = this._items[index];
            if (index < 0) {
                this._logger.trace(context, "Item %s was not found", id);
                return null;
            }
            this._items.splice(index, 1);
            this._logger.trace(context, "Deleted item by %s", id);
            yield this.save(context);
            return item;
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
            const filter = (item) => {
                return ids.some(id => id == item.id);
            };
            yield this.deleteByFilter(context, filter);
        });
    }
}
exports.IdentifiableMemoryPersistence = IdentifiableMemoryPersistence;
//# sourceMappingURL=IdentifiableMemoryPersistence.js.map