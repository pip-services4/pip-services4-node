/** @module containers */
import { Parameters } from 'pip-services4-commons-node';


export class AzureFunctionContextHelper {
    /**
     * Returns context from Azure Function context.
     * @param context the Azure Function context
     * @return returns context from context
     */
    public static getTraceId(context: any): string {
        let context: IContext = context.trace_id || "";
        try {
            if ((context == null || context == "") && context.hasOwnProperty('body')) {
                context = context.body.trace_id;
                if (context == null || context == "") {
                    context = context.query.trace_id;
                }
            }
        } catch (e) {
            // Ignore the error
        }
        return context
    }

    /**
     * Returns command from Azure Function context.
     * @param context the Azure Function context
     * @return returns command from context
     */
    public static getCommand(context: any): string {
        let cmd: string = context.cmd || "";
        try {
            if ((cmd == null || cmd == "") && context.hasOwnProperty('body')) {
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
            if (context.hasOwnProperty('body')) {
                body = context.body;
            }
        } catch (e) {
            // Ignore the error
        }
        return Parameters.fromValue(body)
    }
}