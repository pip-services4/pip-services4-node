/** @module core */
import { IContext } from 'pip-services4-components-node';
import { DataPage } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { SortParams } from 'pip-services4-data-node';
/**
 * Interface for data processing components that can query a page of data items.
 */
export interface IQuerablePageReader<T> {
    /**
     * Gets a page of data items using a query string.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param query             (optional) a query string
     * @param paging            (optional) paging parameters
     * @param sort              (optional) sort parameters
     * @returns                 a requested page with data items.
     */
    getPageByQuery(context: IContext, query: string, paging: PagingParams, sort: SortParams): Promise<DataPage<T>>;
}
