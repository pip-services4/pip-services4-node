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
     * Returns correlationId from Google Function request.
     * @param req the Google Function request
     * @return returns correlationId from request
     */
    static getCorrelationId(req) {
        let correlationId = req.correlation_id || "";
        try {
            if ((correlationId == null || correlationId == "") && req.hasOwnProperty('body')) {
                correlationId = req.body.correlation_id;
                if (correlationId == null || correlationId == "") {
                    correlationId = req.query.correlation_id;
                }
            }
        }
        catch (e) {
            // Ignore the error
        }
        return correlationId;
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