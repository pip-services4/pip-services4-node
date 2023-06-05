"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultGrpcFactory = void 0;
/** @module build */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const GrpcEndpoint_1 = require("../controllers/GrpcEndpoint");
/**
 * Creates GRPC components by their descriptors.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[GrpcEndpoint]]
 */
class DefaultGrpcFactory extends pip_services4_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultGrpcFactory.GrpcEndpointDescriptor, GrpcEndpoint_1.GrpcEndpoint);
    }
}
exports.DefaultGrpcFactory = DefaultGrpcFactory;
DefaultGrpcFactory.GrpcEndpointDescriptor = new pip_services4_components_node_2.Descriptor("pip-services", "endpoint", "grpc", "*", "1.0");
//# sourceMappingURL=DefaultGrpcFactory.js.map