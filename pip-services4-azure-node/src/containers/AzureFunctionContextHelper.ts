/** @module containers */

import { Parameters } from 'pip-services4-components-node';

export class AzureFunctionContextHelper {
    /**
     * Returns context from Azure Function context.
     * @param context the Azure Function context
     * @return returns context from context
     */
    public static getTraceId(context: any): string {
        let traceId = context.trace_id || "";
        try {
            if ((context == null || context == "") && Object.prototype.hasOwnProperty.call(context, 'body')) {
                traceId = context.body.trace_id;
                if (context == null || context == "") {
                    traceId = context.query.trace_id;
                }
            }
        } catch (e) {
            // Ignore the error
        }
        return traceId
    }

    /**
     * Returns command from Azure Function context.
     * @param context the Azure Function context
     * @return returns command from context
     */
    public static getCommand(context: any): string {
        let cmd: string = context.cmd || "";
        try {
            if ((cmd == null || cmd == "") && Object.prototype.hasOwnProperty.call(context, 'body')) {
                cmd = context.body.cmd;
                if (cmd == null || cmd == "") {
                    cmd = context.query.cmd;
                }
            }
        } catch (e) {
            // Ignore the error
        }
        return cmd
    }

    /**
     * Returns body from Azure Function context http request.
     * @param context the Azure Function context
     * @return returns body from context
     */
    public static getParameters(context: any): Parameters {
        let body: any = context;
        try {
            if (Object.prototype.hasOwnProperty.call(context, 'body')) {
                body = context.body;
            }
        } catch (e) {
            // Ignore the error
        }
        return Parameters.fromValue(body)
    }
}