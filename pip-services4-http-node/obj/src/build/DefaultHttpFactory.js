"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultHttpFactory = void 0;
/** @module build */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const HttpEndpoint_1 = require("../controllers/HttpEndpoint");
const HeartbeatRestController_1 = require("../controllers/HeartbeatRestController");
const StatusRestController_1 = require("../controllers/StatusRestController");
/**
 * Creates RPC components by their descriptors.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[HttpEndpoint]]
 * @see [[HeartbeatRestController]]
 * @see [[StatusRestController]]
 */
class DefaultHttpFactory extends pip_services4_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultHttpFactory.HttpEndpointDescriptor, HttpEndpoint_1.HttpEndpoint);
        this.registerAsType(DefaultHttpFactory.HeartbeatServiceDescriptor, HeartbeatRestController_1.HeartbeatRestController);
        this.registerAsType(DefaultHttpFactory.StatusServiceDescriptor, StatusRestController_1.StatusRestController);
    }
}
exports.DefaultHttpFactory = DefaultHttpFactory;
DefaultHttpFactory.HttpEndpointDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "endpoint", "http", "*", "1.0");
DefaultHttpFactory.StatusServiceDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "status-controller", "http", "*", "1.0");
DefaultHttpFactory.HeartbeatServiceDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "heartbeat-controller", "http", "*", "1.0");
//# sourceMappingURL=DefaultHttpFactory.js.map