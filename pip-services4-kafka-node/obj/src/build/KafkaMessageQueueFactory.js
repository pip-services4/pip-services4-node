"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaMessageQueueFactory = void 0;
const pip_services4_messaging_node_1 = require("pip-services4-messaging-node");
const KafkaMessageQueue_1 = require("../queues/KafkaMessageQueue");
const pip_services4_components_node_1 = require("pip-services4-components-node");
/**
 * Creates [[KafkaMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[KafkaMessageQueue]]
 */
class KafkaMessageQueueFactory extends pip_services4_messaging_node_1.MessageQueueFactory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.register(KafkaMessageQueueFactory.KafkaQueueDescriptor, (locator) => {
            const name = (typeof locator.getName === "function") ? locator.getName() : null;
            return this.createQueue(name);
        });
    }
    /**
     * Creates a message queue component and assigns its name.
     * @param name a name of the created message queue.
     */
    createQueue(name) {
        const queue = new KafkaMessageQueue_1.KafkaMessageQueue(name);
        if (this._config != null) {
            queue.configure(this._config);
        }
        if (this._references != null) {
            queue.setReferences(this._references);
        }
        return queue;
    }
}
exports.KafkaMessageQueueFactory = KafkaMessageQueueFactory;
KafkaMessageQueueFactory.KafkaQueueDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "message-queue", "kafka", "*", "1.0");
//# sourceMappingURL=KafkaMessageQueueFactory.js.map