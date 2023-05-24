"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterParamsSchema = void 0;
/** @module validate */
const TypeCode_1 = require("../convert/TypeCode");
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
        super(TypeCode_1.TypeCode.String, null);
    }
}
exports.FilterParamsSchema = FilterParamsSchema;
//# sourceMappingURL=FilterParamsSchema.js.map