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
exports.MemoryPersistence = void 0;
const pip_services4_data_node_1 = require("pip-services4-data-node");
const pip_services4_data_node_2 = require("pip-services4-data-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
/**
 * Abstract persistence component that stores data in memory.
 *
 * This is the most basic persistence component that is only
 * able to store data items of any type. Specific CRUD operations
 * over the data items must be implemented in child classes by
 * accessing <code>this._items</code> property and calling [[save]] method.
 *
 * The component supports loading and saving items from another data source.
 * That allows to use it as a base class for file and other types
 * of persistence components that cache all data in memory.
 *
 * ### Configuration parameters ###
 *
 * - options:
 *     - max_page_size:       Maximum number of items returned in a single page (default: 100)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>       (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 *
 * ### Example ###
 *
 *     class MyMemoryPersistence extends MemoryPersistence<MyData> {
 *
 *         public async getByName(context: IContext, name: string): Promise<MyData> {
 *             let item = this._items.find((d) => d.name == name);
 *             return item;
 *         });
 *
 *         public set(correlatonId: string, item: MyData): Promise<MyData> {
 *             this._items = this._items.find((d) => d.name != name);
 *             this._items.push(item);
 *             await this.save(context);
 *             return item;
 *         }
 *
 *     }
 *
 *     let persistence = new MyMemoryPersistence();
 *
 *     let item = await persistence.set("123", { name: "ABC" });
 *     item = await persistence.getByName("123", "ABC");
 *     console.log(item);                   // Result: { name: "ABC" }
 */
class MemoryPersistence {
    /**
     * Creates a new instance of the persistence.
     *
     * @param loader    (optional) a loader to load items from external datasource.
     * @param saver     (optional) a saver to save items to external datasource.
     */
    constructor(loader, saver) {
        this._logger = new pip_services4_observability_node_1.CompositeLogger();
        this._items = [];
        this._opened = false;
        this._maxPageSize = 100;
        this._loader = loader;
        this._saver = saver;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._maxPageSize = config.getAsIntegerWithDefault("options.max_page_size", this._maxPageSize);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._opened;
    }
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.load(context);
            this._opened = true;
        });
    }
    load(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._loader == null) {
                return null;
            }
            this._items = yield this._loader.load(context);
            this._logger.trace(context, "Loaded %d items", this._items.length);
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    close(context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.save(context);
            this._opened = false;
        });
    }
    /**
     * Saves items to external data source using configured saver component.
     *
     * @param context     (optional) a context to trace execution through call chain.
     */
    save(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._saver == null) {
                return;
            }
            yield this._saver.save(context, this._items);
            this._logger.trace(context, "Saved %d items", this._items.length);
        });
    }
    /**
     * Clears component state.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    clear(context) {
        return __awaiter(this, void 0, void 0, function* () {
            this._items = [];
            this._logger.trace(context, "Cleared items");
            yield this.save(context);
        });
    }
    /**
     * Gets a page of data items retrieved by a given filter and sorted according to sort parameters.
     *
     * This method shall be called by a public getPageByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param filter            (optional) a filter function to filter items
     * @param paging            (optional) paging parameters
     * @param sort              (optional) sorting parameters
     * @param select            (optional) projection parameters (not used yet)
     * @returns                 a requested page with data items.
     */
    getPageByFilter(context, filter, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    paging, sort, select) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = this._items;
            // Filter and sort
            if (typeof filter === "function") {
                items = items.filter(filter);
            }
            if (typeof sort === "function") {
                items = items.sort((a, b) => {
                    const sa = sort(a);
                    const sb = sort(b);
                    if (sa < sb)
                        return -1;
                    if (sa > sb)
                        return 1;
                    return 0;
                });
            }
            // Extract a page
            paging = paging != null ? paging : new pip_services4_data_node_1.PagingParams();
            const skip = paging.getSkip(-1);
            const take = paging.getTake(this._maxPageSize);
            let total = null;
            if (paging.total) {
                total = items.length;
            }
            if (skip > 0) {
                items = items.slice(skip);
            }
            items = items.slice(0, take);
            this._logger.trace(context, "Retrieved %d items", items.length);
            return new pip_services4_data_node_2.DataPage(items, total);
        });
    }
    /**
     * Gets a number of items retrieved by a given filter.
     *
     * This method shall be called by a public getCountByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param filter            (optional) a filter function to filter items
     * @returns                 a number of data items that satisfy the filter.
     */
    getCountByFilter(context, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = this._items;
            // Filter and sort
            if (typeof filter === "function") {
                items = items.filter(filter);
            }
            this._logger.trace(context, "Counted %d items", items.length);
            return items.length;
        });
    }
    /**
     * Gets a list of data items retrieved by a given filter and sorted according to sort parameters.
     *
     * This method shall be called by a public getListByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param filter           (optional) a filter function to filter items
     * @param paging           (optional) paging parameters
     * @param sort             (optional) sorting parameters
     * @param select           (optional) projection parameters (not used yet)
     * @returns                a list with found data items.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getListByFilter(context, filter, sort, select) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = this._items;
            // Apply filter
            if (typeof filter === "function") {
                items = items.filter(filter);
            }
            // Apply sorting
            if (typeof sort === "function") {
                items = items.sort((a, b) => {
                    const sa = sort(a);
                    const sb = sort(b);
                    if (sa < sb)
                        return -1;
                    if (sa > sb)
                        return 1;
                    return 0;
                });
            }
            this._logger.trace(context, "Retrieved %d items", items.length);
            return items;
        });
    }
    /**
     * Gets a random item from items that match to a given filter.
     *
     * This method shall be called by a public getOneRandom method from child class that
     * receives FilterParams and converts them into a filter function.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param filter            (optional) a filter function to filter items.
     * @returns                 a random data item.
     */
    getOneRandom(context, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = this._items;
            // Apply filter
            if (typeof filter === "function") {
                items = items.filter(filter);
            }
            const index = Math.trunc(items.length * Math.random());
            const item = items.length > 0 ? items[index] : null;
            if (item != null) {
                this._logger.trace(context, "Retrieved a random item");
            }
            else {
                this._logger.trace(context, "Nothing to return as random item");
            }
            return item;
        });
    }
    /**
     * Creates a data item.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be created.
     * @returns                 a created data item
     */
    create(context, item) {
        return __awaiter(this, void 0, void 0, function* () {
            // Clone the object
            item = Object.assign({}, item);
            this._items.push(item);
            this._logger.trace(context, "Created item %s", item['id']);
            yield this.save(context);
            return item;
        });
    }
    /**
     * Deletes data items that match to a given filter.
     *
     * This method shall be called by a public deleteByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param filter            (optional) a filter function to filter items.
     */
    deleteByFilter(context, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let deleted = 0;
            for (let index = this._items.length - 1; index >= 0; index--) {
                const item = this._items[index];
                if (filter(item)) {
                    this._items.splice(index, 1);
                    deleted++;
                }
            }
            if (deleted == 0) {
                return;
            }
            this._logger.trace(context, "Deleted %s items", deleted);
            yield this.save(context);
        });
    }
}
exports.MemoryPersistence = MemoryPersistence;
//# sourceMappingURL=MemoryPersistence.js.map