"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureFunctionContextHelper = void 0;
/** @module containers */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
class AzureFunctionContextHelper {
    /**
     * Returns context from Azure Function context.
     * @param context the Azure Function context
     * @return returns context from context
     */
    static getTraceId(context) {
        let context = context.trace_id || "";
        try {
            if ((context == null || context == "") && context.hasOwnProperty('body')) {
                context = context.body.trace_id;
                if (context == null || context == "") {
                    context = context.query.trace_id;
                }
            }
        }
        catch (e) {
            // Ignore the error
        }
        return context;
    }
    /**
     * Returns command from Azure Function context.
     * @param context the Azure Function context
     * @return returns command from context
     */
    static getCommand(context) {
        let cmd = context.cmd || "";
        try {
            if ((cmd == null || cmd == "") && context.hasOwnProperty('body')) {
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
            if (context.hasOwnProperty('body')) {
                body = context.body;
            }
        }
        catch (e) {
            // Ignore the error
        }
        return pip_services3_commons_node_1.Parameters.fromValue(body);
    }
}
exports.AzureFunctionContextHelper = AzureFunctionContextHelper;
//# sourceMappingURL=AzureFunctionContextHelper.js.map