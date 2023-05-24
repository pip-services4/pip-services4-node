"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQueueFactory = void 0;
/** @module build */
const pip_services3_components_node_1 = require("pip-services4-components-node");
/**
 * Creates [[IMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[MessageQueue]]
 */
class MessageQueueFactory extends pip_services3_components_node_1.Factory {
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._config = config;
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._references = references;
    }
}
exports.MessageQueueFactory = MessageQueueFactory;
//# sourceMappingURL=MessageQueueFactory.js.map