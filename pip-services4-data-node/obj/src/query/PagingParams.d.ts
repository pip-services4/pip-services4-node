/** @module data */
/**
 * Data transfer object to pass paging parameters for queries.
 *
 * The page is defined by two parameters:
 * - the <code>skip</code> parameter defines number of items to skip.
 * - the <code>take</code> parameter sets how many items to return in a page.
 * - additionally, the optional <code>total</code> parameter tells to return total number of items in the query.
 *
 * Remember: not all implementations support the <code>total</code> parameter
 * because its generation may lead to severe performance implications.
 *
 * ### Example ###
 *
 *     let filter = FilterParams.fromTuples("type", "Type1");
 *     let paging = new PagingParams(0, 100);
 *
 *     myDataClient.getDataByFilter(filter, paging, (err, page) => {...});
 */
export declare class PagingParams {
    /** The number of items to skip. */
    skip: number;
    /** The number of items to return.  */
    take: number;
    /** The flag to return the total number of items. */
    total: boolean;
    /**
     * Creates a new instance and sets its values.
     *
     * @param skip 		the number of items to skip.
     * @param take 		the number of items to return.
     * @param total 	true to return the total number of items.
     */
    constructor(skip?: number, take?: number, total?: boolean);
    /**
     * Gets the number of items to skip.
     *
     * @param minSkip 	the minimum number of items to skip.
     * @returns 		the number of items to skip.
     */
    getSkip(minSkip: number): number;
    /**
     * Gets the number of items to return in a page.
     *
     * @param maxTake 	the maximum number of items to return.
     * @returns 		the number of items to return.
     */
    getTake(maxTake: number): number;
    /**
     * Converts specified value into PagingParams.
     *
     * @param value     value to be converted
     * @returns         a newly created PagingParams.
     */
    static fromValue(value: any): PagingParams;
    /**
     * Creates a new PagingParams from a list of key-value pairs called tuples.
     *
     * @param tuples    a list of values where odd elements are keys and the following even elements are values
     * @returns         a newly created PagingParams.
     */
    static fromTuples(...tuples: any[]): PagingParams;
    /**
     * Creates a new PagingParams and sets it parameters from the specified map
     *
     * @param map    	a AnyValueMap or StringValueMap to initialize this PagingParams
     * @returns         a newly created PagingParams.
     */
    static fromMap(map: any): PagingParams;
}
