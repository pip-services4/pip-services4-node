"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectionParamsSchema = void 0;
/** @module validate */
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
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
        super(pip_services4_commons_node_1.TypeCode.String);
    }
}
exports.ProjectionParamsSchema = ProjectionParamsSchema;
//# sourceMappingURL=ProjectionParamsSchema.js.map