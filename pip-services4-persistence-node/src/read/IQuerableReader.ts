/** @module core */
import { SortParams } from 'pip-services4-commons-node';

/**
 * Interface for data processing components that can query a list of data items.
 */
export interface IQuerableReader<T> {
    /**
     * Gets a list of data items using a query string.
     * 
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param query            (optional) a query string
     * @param sort             (optional) sort parameters
     * @returns                a list with found data items.
     */
    getListByQuery(context: IContext, query: string, sort: SortParams): Promise<T[]>;
}
