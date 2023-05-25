"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudFunctionRequestHelper = void 0;
/** @module containers */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
/**
 * Class that helps to prepare function requests
 */
class CloudFunctionRequestHelper {
    /**
     * Returns context from Google Function request.
     * @param req the Google Function request
     * @return returns context from request
     */
    static getTraceId(req) {
        let context = req.trace_id || "";
        try {
            if ((context == null || context == "") && req.hasOwnProperty('body')) {
                context = req.body.trace_id;
                if (context == null || context == "") {
                    context = req.query.trace_id;
                }
            }
        }
        catch (e) {
            // Ignore the error
        }
        return context;
    }
    /**
     * Returns command from Google Function request.
     * @param req the Google Function request
     * @return returns command from request
     */
    static getCommand(req) {
        let cmd = req.cmd || "";
        try {
            if ((cmd == null || cmd == "") && req.hasOwnProperty('body')) {
                cmd = req.body.cmd;
                if (cmd == null || cmd == "") {
                    cmd = req.query.cmd;
                }
            }
        }
        catch (e) {
            // Ignore the error
        }
        return cmd;
    }
    /**
     * Returns body from Google Function request http request.
     * @param req the Google Function request
     * @return returns body from request
     */
    static getParameters(req) {
        let body = req;
        try {
            if (req.hasOwnProperty('body')) {
                body = req.body;
            }
        }
        catch (e) {
            // Ignore the error
        }
        return pip_services3_commons_node_1.Parameters.fromValue(body);
    }
}
exports.CloudFunctionRequestHelper = CloudFunctionRequestHelper;
//# sourceMappingURL=CloudFunctionRequestHelper.js.map