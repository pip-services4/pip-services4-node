"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterParamsSchema = void 0;
/** @module validate */
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const MapSchema_1 = require("./MapSchema");
/**
 * Schema to validate [[FilterParams]].
 *
 * @see [[FilterParams]]
 */
class FilterParamsSchema extends MapSchema_1.MapSchema {
    /**
     * Creates a new instance of validation schema.
     */
    constructor() {
        super(pip_services4_commons_node_1.TypeCode.String, null);
    }
}
exports.FilterParamsSchema = FilterParamsSchema;
//# sourceMappingURL=FilterParamsSchema.js.map