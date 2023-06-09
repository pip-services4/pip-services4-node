"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRestClient = void 0;
const RestClient_1 = require("../clients/RestClient");
/**
 * REST client used for automated testing.
 */
class TestRestClient extends RestClient_1.RestClient {
    constructor(baseRoute) {
        super();
        this._baseRoute = baseRoute;
    }
    /**
     * Calls a remote method via HTTP/REST protocol.
     *
     * @param method            HTTP method: "get", "head", "post", "put", "delete"
     * @param route             a command route. Base route will be added to this route
     * @param context           (optional) a context to trace execution through call chain.
     * @param params            (optional) query parameters.
     * @param data              (optional) body object.
     * @returns                 a result object.
     */
    call(method, route, context, params = {}, data) {
        return super.call(method, route, context, params, data);
    }
}
exports.TestRestClient = TestRestClient;
//# sourceMappingURL=TestRestClient.js.map