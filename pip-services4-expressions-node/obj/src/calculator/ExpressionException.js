"use strict";
/** @module calculator */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionException = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_components_node_1 = require("pip-services4-components-node");
/**
 * Exception that can be thrown by Expression Calculator.
 */
class ExpressionException extends pip_services4_commons_node_1.BadRequestException {
    constructor(context, code, message, line = 0, column = 0) {
        if (line != 0 || column != 0) {
            message = message + " at line " + line + " and column " + column;
        }
        super(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, code, message);
    }
}
exports.ExpressionException = ExpressionException;
//# sourceMappingURL=ExpressionException.js.map