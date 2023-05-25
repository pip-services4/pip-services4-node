"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestGrpcClient = void 0;
/** @module test */
const GrpcClient_1 = require("../clients/GrpcClient");
/**
 * GRPC client used for automated testing.
 */
class TestGrpcClient extends GrpcClient_1.GrpcClient {
    constructor(clientTypeOrPath, clientName, packageOptions) {
        super(clientTypeOrPath, clientName, packageOptions);
    }
    /**
     * Calls a remote method via GRPC protocol.
     *
     * @param method            a method name to called
     * @param context     (optional) a context to trace execution through call chain.
     * @param request           (optional) request object.
     * @returns the received result.
     */
    call(method, context, request = {}) {
        return super.call(method, context, request);
    }
}
exports.TestGrpcClient = TestGrpcClient;
//# sourceMappingURL=TestGrpcClient.js.map