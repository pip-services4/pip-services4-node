"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttMessageQueueFactory = void 0;
const pip_services4_messaging_node_1 = require("pip-services4-messaging-node");
const MqttMessageQueue_1 = require("../queues/MqttMessageQueue");
const pip_services4_components_node_1 = require("pip-services4-components-node");
/**
 * Creates [[MqttMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[MqttMessageQueue]]
 */
class MqttMessageQueueFactory extends pip_services4_messaging_node_1.MessageQueueFactory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.register(MqttMessageQueueFactory.MqttQueueDescriptor, (locator) => {
            const name = (typeof locator.getName === "function") ? locator.getName() : null;
            return this.createQueue(name);
        });
    }
    /**
     * Creates a message queue component and assigns its name.
     * @param name a name of the created message queue.
     */
    createQueue(name) {
        const queue = new MqttMessageQueue_1.MqttMessageQueue(name);
        if (this._config != null) {
            queue.configure(this._config);
        }
        if (this._references != null) {
            queue.setReferences(this._references);
        }
        return queue;
    }
}
exports.MqttMessageQueueFactory = MqttMessageQueueFactory;
MqttMessageQueueFactory.MqttQueueDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "message-queue", "mqtt", "*", "1.0");
//# sourceMappingURL=MqttMessageQueueFactory.js.map