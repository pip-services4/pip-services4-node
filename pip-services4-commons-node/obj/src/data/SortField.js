"use strict";
/** @module data */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortField = void 0;
/**
 * Defines a field name and order used to sort query results.
 *
 * @see [[SortParams]]
 *
 * ### Example ###
 *
 *     let filter = FilterParams.fromTuples("type", "Type1");
 *     let paging = new PagingParams(0, 100);
 *     let sorting = new SortingParams(new SortField("create_time", true));
 *
 *     myDataClient.getDataByFilter(filter, paging, sorting, (err, page) => {...});
 */
class SortField {
    /**
     * Creates a new instance and assigns its values.
     *
     * @param name 			the name of the field to sort by.
     * @param ascending 	true to sort in ascending order, and false to sort in descending order.
     */
    constructor(name = null, ascending = true) {
        this.name = name;
        this.ascending = ascending;
    }
}
exports.SortField = SortField;
//# sourceMappingURL=SortField.js.map