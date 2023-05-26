/** @module data */
/**
 * Data transfer object to pass tokenized paging parameters for queries.
 * It can be used for complex paging scenarios, like paging across multiple databases
 * where the previous state is encoded in a token. The token is usually retrieved from
 * the previous response. The initial request shall go with token == <code>null</code>
 *
 * The page is defined by two parameters:
 * - the <code>token</code> token that defines a starting point for the search.
 * - the <code>take</code> parameter sets how many items to return in a page.
 * - additionally, the optional <code>total</code> parameter tells to return total number of items in the query.
 *
 * Remember: not all implementations support the <code>total</code> parameter
 * because its generation may lead to severe performance implications.
 *
 * ### Example ###
 *
 *     let filter = FilterParams.fromTuples("type", "Type1");
 *     let paging = new TokenizedPagingParams(null, 100);
 *
 *     myDataClient.getDataByFilter(filter, paging, (err, page) => {...});
 */
export declare class TokenizedPagingParams {
    /** The start token */
    token: string;
    /** The number of items to return.  */
    take: number;
    /** The flag to return the total number of items. */
    total: boolean;
    /**
     * Creates a new instance and sets its values.
     *
     * @param token     token that defines a starting point for the search.
     * @param take         the number of items to return.
     * @param total     true to return the total number of items.
     */
    constructor(token?: string, take?: number, total?: boolean);
    /**
     * Gets the number of items to return in a page.
     *
     * @param maxTake     the maximum number of items to return.
     * @returns         the number of items to return.
     */
    getTake(maxTake: number): number;
    /**
     * Converts specified value into TokenizedPagingParams.
     *
     * @param value     value to be converted
     * @returns         a newly created PagingParams.
     */
    static fromValue(value: any): TokenizedPagingParams;
    /**
     * Creates a new TokenizedPagingParams from a list of key-value pairs called tuples.
     *
     * @param tuples    a list of values where odd elements are keys and the following even elements are values
     * @returns         a newly created TokenizedPagingParams.
     */
    static fromTuples(...tuples: any[]): TokenizedPagingParams;
    /**
     * Creates a new TokenizedPagingParams and sets it parameters from the specified map
     *
     * @param map        a AnyValueMap or StringValueMap to initialize this TokenizedPagingParams
     * @returns         a newly created PagingParams.
     */
    static fromMap(map: any): TokenizedPagingParams;
}
