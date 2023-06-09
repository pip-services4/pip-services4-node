/** @module core */
import { IContext } from 'pip-services4-components-node';
import { DataPage } from 'pip-services4-data-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { SortParams } from 'pip-services4-data-node';

/**
 * Interface for data processing components that can retrieve a page of data items by a filter.
 */
export interface IFilteredPageReader<T> {
    /**
     * Gets a page of data items using filter parameters.
     * 
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param filter            (optional) filter parameters
     * @param paging            (optional) paging parameters
     * @param sort              (optional) sort parameters
     * @returns                 a requested page with found data items.
     */
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams, sort: SortParams): Promise<DataPage<T>>;
}
