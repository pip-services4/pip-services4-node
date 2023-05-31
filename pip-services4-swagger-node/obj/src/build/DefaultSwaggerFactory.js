"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSwaggerFactory = void 0;
/** @module build */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const SwaggerController_1 = require("../controllers/SwaggerController");
/**
 * Creates Swagger components by their descriptors.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[HttpEndpoint]]
 * @see [[HeartbeatRestController]]
 * @see [[StatusRestController]]
 */
class DefaultSwaggerFactory extends pip_services4_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultSwaggerFactory.SwaggerControllerDescriptor, SwaggerController_1.SwaggerController);
    }
}
exports.DefaultSwaggerFactory = DefaultSwaggerFactory;
DefaultSwaggerFactory.SwaggerControllerDescriptor = new pip_services4_components_node_2.Descriptor("pip-services", "swagger-controller", "*", "*", "1.0");
//# sourceMappingURL=DefaultSwaggerFactory.js.map