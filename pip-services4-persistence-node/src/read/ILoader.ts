/** @module core */

/**
 * Interface for data processing components that load data items.
 */
export interface ILoader<T> {
    /**
     * Loads data items.
     * 
     * @param context    (optional) transaction id to trace execution through call chain. 
     * @returns a list with loaded data items.
     */
    load(context: IContext): Promise<T[]>;
}
