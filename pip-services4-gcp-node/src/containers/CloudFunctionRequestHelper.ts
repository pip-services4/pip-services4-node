/** @module containers */
import { Parameters } from 'pip-services4-commons-node';


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
        let context: IContext = req.trace_id || "";
        try {
            if ((context == null || context == "") && req.hasOwnProperty('body')) {
                context = req.body.trace_id;
                if (context == null || context == "") {
                    context = req.query.trace_id;
                }
            }
        } catch (e) {
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
            if ((cmd == null || cmd == "") && req.hasOwnProperty('body')) {
                cmd = req.body.cmd;
                if (cmd == null || cmd == "") {
                    cmd = req.query.cmd;
                }
            }
        } catch (e) {
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
            if (req.hasOwnProperty('body')) {
                body = req.body;
            }
        } catch (e) {
            // Ignore the error
        }
        return Parameters.fromValue(body)
    }
}