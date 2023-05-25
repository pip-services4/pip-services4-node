"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagingParamsSchema = void 0;
/** @module validate */
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
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
        this.withOptionalProperty("skip", pip_services4_commons_node_1.TypeCode.Long);
        this.withOptionalProperty("take", pip_services4_commons_node_1.TypeCode.Long);
        this.withOptionalProperty("total", pip_services4_commons_node_1.TypeCode.Boolean);
    }
}
exports.PagingParamsSchema = PagingParamsSchema;
//# sourceMappingURL=PagingParamsSchema.js.map