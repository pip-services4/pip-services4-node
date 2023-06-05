"use strict";
/** @module containers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureFunctionContextHelper = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
class AzureFunctionContextHelper {
    /**
     * Returns context from Azure Function context.
     * @param context the Azure Function context
     * @return returns context from context
     */
    static getTraceId(context) {
        let traceId = context.trace_id || "";
        try {
            if ((context == null || context == "") && Object.prototype.hasOwnProperty.call(context, 'body')) {
                traceId = context.body.trace_id;
                if (context == null || context == "") {
                    traceId = context.query.trace_id;
                }
            }
        }
        catch (e) {
            // Ignore the error
        }
        return traceId;
    }
    /**
     * Returns command from Azure Function context.
     * @param context the Azure Function context
     * @return returns command from context
     */
    static getCommand(context) {
        let cmd = context.cmd || "";
        try {
            if ((cmd == null || cmd == "") && Object.prototype.hasOwnProperty.call(context, 'body')) {
                cmd = context.body.cmd;
                if (cmd == null || cmd == "") {
                    cmd = context.query.cmd;
                }
            }
        }
        catch (e) {
            // Ignore the error
        }
        return cmd;
    }
    /**
     * Returns body from Azure Function context http request.
     * @param context the Azure Function context
     * @return returns body from context
     */
    static getParameters(context) {
        let body = context;
        try {
            if (Object.prototype.hasOwnProperty.call(context, 'body')) {
                body = context.body;
            }
        }
        catch (e) {
            // Ignore the error
        }
        return pip_services4_components_node_1.Parameters.fromValue(body);
    }
}
exports.AzureFunctionContextHelper = AzureFunctionContextHelper;
//# sourceMappingURL=AzureFunctionContextHelper.js.map