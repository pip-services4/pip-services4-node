"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectionParamsSchema = void 0;
/** @module validate */
const TypeCode_1 = require("../convert/TypeCode");
const ArraySchema_1 = require("./ArraySchema");
/**
 * Schema to validate [[ProjectionParams]]
 *
 * @see [[ProjectionParams]]
 */
class ProjectionParamsSchema extends ArraySchema_1.ArraySchema {
    /**
     * Creates a new instance of validation schema.
     */
    constructor() {
        super(TypeCode_1.TypeCode.String);
    }
}
exports.ProjectionParamsSchema = ProjectionParamsSchema;
//# sourceMappingURL=ProjectionParamsSchema.js.map