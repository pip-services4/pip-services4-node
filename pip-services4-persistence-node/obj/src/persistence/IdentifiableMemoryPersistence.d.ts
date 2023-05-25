/** @module persistence */
import { IIdentifiable } from 'pip-services4-commons-node';
import { AnyValueMap } from 'pip-services4-commons-node';
import { MemoryPersistence } from './MemoryPersistence';
import { IWriter } from '../IWriter';
import { IGetter } from '../IGetter';
import { ISetter } from '../ISetter';
import { ILoader } from '../ILoader';
import { ISaver } from '../ISaver';
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
export declare class IdentifiableMemoryPersistence<T extends IIdentifiable<K>, K> extends MemoryPersistence<T> implements IWriter<T, K>, IGetter<T, K>, ISetter<T> {
    /**
     * Creates a new instance of the persistence.
     *
     * @param loader    (optional) a loader to load items from external datasource.
     * @param saver     (optional) a saver to save items to external datasource.
     */
    constructor(loader?: ILoader<T>, saver?: ISaver<T>);
    /**
     * Gets a list of data items retrieved by given unique ids.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param ids               ids of data items to be retrieved
     * @returns                 a list with found data items.
     */
    getListByIds(context: IContext, ids: K[]): Promise<T[]>;
    /**
     * Gets a data item by its unique id.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param id                an id of data item to be retrieved.
     * @returns                 a found data item or <code>null</code> if nothing was found.
     */
    getOneById(context: IContext, id: K): Promise<T>;
    /**
     * Creates a data item.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be created.
     * @returns                a created data item.
     */
    create(context: IContext, item: T): Promise<T>;
    /**
     * Sets a data item. If the data item exists it updates it,
     * otherwise it create a new data item.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param item              a item to be set.
     * @returns                 a set data item.
     */
    set(context: IContext, item: T): Promise<T>;
    /**
     * Updates a data item.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be updated.
     * @returns                 the updated data item.
     */
    update(context: IContext, item: T): Promise<T>;
    /**
     * Updates only few selected fields in a data item.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param id                an id of data item to be updated.
     * @param data              a map with fields to be updated.
     * @returns                 the updated data item.
     */
    updatePartially(context: IContext, id: K, data: AnyValueMap): Promise<T>;
    /**
     * Deleted a data item by it's unique id.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param id                an id of the item to be deleted
     * @returns                 the deleted data item.
     */
    deleteById(context: IContext, id: K): Promise<T>;
    /**
     * Deletes multiple data items by their unique ids.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param ids               ids of data items to be deleted.
     */
    deleteByIds(context: IContext, ids: K[]): Promise<void>;
}
