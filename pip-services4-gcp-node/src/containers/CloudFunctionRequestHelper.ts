/** @module containers */
import { Parameters } from 'pip-services4-components-node';


/**
 * Class that helps to prepare function requests
 */
export class CloudFunctionRequestHelper {
    /**
     * Returns context from Google Function request.
     * @param req the Google Function request
     * @return returns context from request
     */
    public static getTraceId(req: any): string {
        let context: string = req.trace_id || req.correlation_id || "";
        try {
            if ((context == null || context == "") && Object.prototype.hasOwnProperty.call(req, 'body')) {
                context = req.body.trace_id || req.body.correlation_id;
                if (context == null || context == "") {
                    context = req.query.trace_id || req.query.correlation_id;
                }
            }
        } catch (ex) {
            // Ignore the error
        }
        return context
    }

    /**
     * Returns command from Google Function request.
     * @param req the Google Function request
     * @return returns command from request
     */
    public static getCommand(req: any): string {
        let cmd: string = req.cmd || "";
        try {
            if ((cmd == null || cmd == "") && Object.hasOwnProperty.call(req, 'body')) {
                cmd = req.body.cmd;
                if (cmd == null || cmd == "") {
                    cmd = req.query.cmd;
                }
            }
        } catch (ex) {
            // Ignore the error
        }
        return cmd
    }

    /**
     * Returns body from Google Function request http request.
     * @param req the Google Function request
     * @return returns body from request
     */
    public static getParameters(req: any): Parameters {
        let body: any = req;
        try {
            if (Object.prototype.hasOwnProperty.call(req, 'body')) {
                body = req.body;
            }
        } catch (ex) {
            // Ignore the error
        }
        return Parameters.fromValue(body)
    }
}