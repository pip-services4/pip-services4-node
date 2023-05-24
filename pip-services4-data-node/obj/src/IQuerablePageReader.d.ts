/** @module core */
import { DataPage } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { SortParams } from 'pip-services4-commons-node';
/**
 * Interface for data processing components that can query a page of data items.
 */
export interface IQuerablePageReader<T> {
    /**
     * Gets a page of data items using a query string.
     *
     * @param correlationId    (optional) transaction id to trace execution through call chain.
     * @param query             (optional) a query string
     * @param paging            (optional) paging parameters
     * @param sort              (optional) sort parameters
     * @returns                 a requested page with data items.
     */
    getPageByQuery(correlationId: string, query: string, paging: PagingParams, sort: SortParams): Promise<DataPage<T>>;
}
