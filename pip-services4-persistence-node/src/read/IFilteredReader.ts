/** @module core */
import { IContext } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { SortParams } from 'pip-services4-data-node';

/**
 * Interface for data processing components that can retrieve a list of data items by filter.
 */
export interface IFilteredReader<T> {
    /**
     * Gets a list of data items using filter parameters.
     * 
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param filter             (optional) filter parameters
     * @param sort              (optional) sort parameters
     * @returns                a list with found data items.
     */
    getListByFilter(context: IContext, filter: FilterParams, sort: SortParams): Promise<T[]>;
}
