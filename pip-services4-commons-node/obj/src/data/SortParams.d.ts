/** @module data */
import { SortField } from './SortField';
/**
 * Defines a field name and order used to sort query results.
 *
 * @see [[SortField]]
 *
 * ### Example ###
 *
 *     let filter = FilterParams.fromTuples("type", "Type1");
 *     let paging = new PagingParams(0, 100);
 *     let sorting = new SortingParams(new SortField("create_time", true));
 *
 *     myDataClient.getDataByFilter(filter, paging, sorting, (err, page) => {...});
 */
export declare class SortParams extends Array<SortField> {
    /**
     * Creates a new instance and initializes it with specified sort fields.
     *
     * @param fields    a list of fields to sort by.
     */
    constructor(...fields: SortField[]);
}
