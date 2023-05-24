"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagingParamsSchema = void 0;
/** @module validate */
const TypeCode_1 = require("../convert/TypeCode");
const ObjectSchema_1 = require("./ObjectSchema");
/**
 * Schema to validate [[PagingParams]].
 *
 * @see [[PagingParams]]
 */
class PagingParamsSchema extends ObjectSchema_1.ObjectSchema {
    /**
     * Creates a new instance of validation schema.
     */
    constructor() {
        super();
        this.withOptionalProperty("skip", TypeCode_1.TypeCode.Long);
        this.withOptionalProperty("take", TypeCode_1.TypeCode.Long);
        this.withOptionalProperty("total", TypeCode_1.TypeCode.Boolean);
    }
}
exports.PagingParamsSchema = PagingParamsSchema;
//# sourceMappingURL=PagingParamsSchema.js.map