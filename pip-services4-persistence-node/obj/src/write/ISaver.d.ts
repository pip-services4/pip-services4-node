/** @module core */
import { IContext } from 'pip-services4-components-node';
/**
 * Interface for data processing components that save data items.
 */
export interface ISaver<T> {
    /**
     * Saves given data items.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param item              a list of items to save.
     */
    save(context: IContext, items: T[]): Promise<void>;
}
