/** @module core */
import { IContext } from 'pip-services4-components-node';
/**
 * Interface for data processing components that can set (create or update) data items.
 */
export interface ISetter<T> {
    /**
     * Sets a data item. If the data item exists it updates it,
     * otherwise it create a new data item.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param item              a item to be set.
     * @returns                 the processed data item.
     */
    set(context: IContext, item: T): Promise<T>;
}
