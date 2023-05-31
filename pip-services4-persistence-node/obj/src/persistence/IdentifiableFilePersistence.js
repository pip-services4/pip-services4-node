"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifiableFilePersistence = void 0;
const IdentifiableMemoryPersistence_1 = require("./IdentifiableMemoryPersistence");
const JsonFilePersister_1 = require("./JsonFilePersister");
/**
 * Abstract persistence component that stores data in flat files
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
 * @see [[JsonFilePersister]]
 * @see [[MemoryPersistence]]
 *
 * ### Configuration parameters ###
 *
 * - path:                    path to the file where data is stored
 * - options:
 *     - max_page_size:       Maximum number of items returned in a single page (default: 100)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>       (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 *
 * ### Examples ###
 *
 *     class MyFilePersistence extends IdentifiableFilePersistence<MyData, string> {
 *         public constructor(path?: string) {
 *             super(new JsonPersister(path));
 *         }
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
 *         public async getPageByFilter(context: IContext, filter: FilterParams,
 *             paging: PagingParams): Promise<DataPage<MyData>> {
 *             return await super.getPageByFilter(context, this.composeFilter(filter), paging, null, null);
 *         }
 *
 *     }
 *
 *     let persistence = new MyFilePersistence("./data/data.json");
 *
 *     let item = await persistence.create("123", { id: "1", name: "ABC" });
 *
 *     let page = await persistence.getPageByFilter(
 *             "123",
 *             FilterParams.fromTuples("name", "ABC"),
 *             null
 *     );
 *     console.log(page.data);          // Result: { id: "1", name: "ABC" }
 *
 *     item = await persistence.deleteById("123", "1");
 */
class IdentifiableFilePersistence extends IdentifiableMemoryPersistence_1.IdentifiableMemoryPersistence {
    /**
     * Creates a new instance of the persistence.
     *
     * @param persister    (optional) a persister component that loads and saves data from/to flat file.
     */
    constructor(persister) {
        if (persister == null) {
            persister = new JsonFilePersister_1.JsonFilePersister();
        }
        super(persister, persister);
        this._persister = persister;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        super.configure(config);
        this._persister.configure(config);
    }
}
exports.IdentifiableFilePersistence = IdentifiableFilePersistence;
//# sourceMappingURL=IdentifiableFilePersistence.js.map