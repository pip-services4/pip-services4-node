/** @module data */
/**
 * Data transfer object that is used to pass results of paginated queries.
 * It contains items of retrieved page and optional total number of items.
 *
 * Most often this object type is used to send responses to paginated queries.
 * Pagination parameters are defined by [[TokenizedPagingParams]] object.
 * The <code>token</code> parameter in the TokenizedPagingParams there means where to start the searxh.
 * The <code>takes</code> parameter sets number of items to return in the page.
 * And the optional <code>total</code> parameter tells to return total number of items in the query.
 *
 * The data page returns a token that shall be passed to the next search as a starting point.
 *
 * Remember: not all implementations support the <code>total</code> parameter
 * because its generation may lead to severe performance implications.
 *
 * @see [[PagingParams]]
 *
 * ### Example ###
 *
 *     page := await myDataClient.getDataByFilter(
 *         "123",
 *         FilterParams.fromTuples("completed": true),
 *         new TokenizedPagingParams(null, 100, true)
 *     );
 */
export declare class TokenizedDataPage<T> {
    /** The items of the retrieved page. */
    data: T[];
    /** The starting point for the next search. */
    token: string;
    /** The total amount of items in a request. */
    total: number;
    /**
     * Creates a new instance of data page and assigns its values.
     *
     * @param data      a list of items from the retrieved page.
     * @param token     (optional) a token to define astarting point for the next search.
     * @param total     (optional) a total number of objects in the result.
     */
    constructor(data?: T[], token?: string, total?: number);
}
