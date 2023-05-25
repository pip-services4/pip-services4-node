"use strict";
/** @module data */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagingParams = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
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
class PagingParams {
    /**
     * Creates a new instance and sets its values.
     *
     * @param skip 		the number of items to skip.
     * @param take 		the number of items to return.
     * @param total 	true to return the total number of items.
     */
    constructor(skip = null, take = null, total = null) {
        this.skip = skip;
        this.take = take;
        this.total = !!total;
        // This is for correctly using PagingParams with gRPC. gRPC defaults to 0 when take is null,
        // so we have to set it back to null if we get 0 in the constructor.
        if (this.take == 0) {
            this.take = null;
        }
    }
    /**
     * Gets the number of items to skip.
     *
     * @param minSkip 	the minimum number of items to skip.
     * @returns 		the number of items to skip.
     */
    getSkip(minSkip) {
        if (this.skip == null)
            return minSkip;
        if (this.skip < minSkip)
            return minSkip;
        return this.skip;
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
     * Converts specified value into PagingParams.
     *
     * @param value     value to be converted
     * @returns         a newly created PagingParams.
     */
    static fromValue(value) {
        if (value instanceof PagingParams) {
            return value;
        }
        let map = pip_services4_commons_node_1.AnyValueMap.fromValue(value);
        return PagingParams.fromMap(map);
    }
    /**
     * Creates a new PagingParams from a list of key-value pairs called tuples.
     *
     * @param tuples    a list of values where odd elements are keys and the following even elements are values
     * @returns         a newly created PagingParams.
     */
    static fromTuples(...tuples) {
        let map = pip_services4_commons_node_1.AnyValueMap.fromTuplesArray(tuples);
        return PagingParams.fromMap(map);
    }
    /**
     * Creates a new PagingParams and sets it parameters from the specified map
     *
     * @param map    	a AnyValueMap or StringValueMap to initialize this PagingParams
     * @returns         a newly created PagingParams.
     */
    static fromMap(map) {
        let skip = map.getAsNullableInteger("skip");
        let take = map.getAsNullableInteger("take");
        let total = map.getAsBooleanWithDefault("total", false);
        return new PagingParams(skip, take, total);
    }
}
exports.PagingParams = PagingParams;
//# sourceMappingURL=PagingParams.js.map