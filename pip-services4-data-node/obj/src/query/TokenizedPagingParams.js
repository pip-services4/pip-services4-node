"use strict";
/** @module data */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenizedPagingParams = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
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
class TokenizedPagingParams {
    /**
     * Creates a new instance and sets its values.
     *
     * @param token 	token that defines a starting point for the search.
     * @param take 		the number of items to return.
     * @param total 	true to return the total number of items.
     */
    constructor(token = null, take = null, total = null) {
        this.token = token;
        this.take = take;
        this.total = !!total;
        // This is for correctly using PagingParams with gRPC. gRPC defaults to 0 when take is null,
        // so we have to set it back to null if we get 0 in the constructor.
        if (this.take == 0) {
            this.take = null;
        }
    }
    /**
     * Gets the number of items to return in a page.
     *
     * @param maxTake 	the maximum number of items to return.
     * @returns 		the number of items to return.
     */
    getTake(maxTake) {
        if (this.take == null)
            return maxTake;
        if (this.take < 0)
            return 0;
        if (this.take > maxTake)
            return maxTake;
        return this.take;
    }
    /**
     * Converts specified value into TokenizedPagingParams.
     *
     * @param value     value to be converted
     * @returns         a newly created PagingParams.
     */
    static fromValue(value) {
        if (value instanceof TokenizedPagingParams) {
            return value;
        }
        let map = pip_services4_commons_node_1.AnyValueMap.fromValue(value);
        return TokenizedPagingParams.fromMap(map);
    }
    /**
     * Creates a new TokenizedPagingParams from a list of key-value pairs called tuples.
     *
     * @param tuples    a list of values where odd elements are keys and the following even elements are values
     * @returns         a newly created TokenizedPagingParams.
     */
    static fromTuples(...tuples) {
        let map = pip_services4_commons_node_1.AnyValueMap.fromTuplesArray(tuples);
        return TokenizedPagingParams.fromMap(map);
    }
    /**
     * Creates a new TokenizedPagingParams and sets it parameters from the specified map
     *
     * @param map    	a AnyValueMap or StringValueMap to initialize this TokenizedPagingParams
     * @returns         a newly created PagingParams.
     */
    static fromMap(map) {
        let token = map.getAsNullableString("token");
        let take = map.getAsNullableInteger("take");
        let total = map.getAsBooleanWithDefault("total", false);
        return new TokenizedPagingParams(token, take, total);
    }
}
exports.TokenizedPagingParams = TokenizedPagingParams;
//# sourceMappingURL=TokenizedPagingParams.js.map