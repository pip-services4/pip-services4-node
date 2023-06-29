"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQMessageQueueFactory = void 0;
const pip_services4_messaging_node_1 = require("pip-services4-messaging-node");
const RabbitMQMessageQueue_1 = require("../queues/RabbitMQMessageQueue");
const pip_services4_components_node_1 = require("pip-services4-components-node");
/**
 * Creates [[RabbitMQMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[RabbitMQMessageQueue]]
 */
class RabbitMQMessageQueueFactory extends pip_services4_messaging_node_1.MessageQueueFactory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.register(RabbitMQMessageQueueFactory.MemoryQueueDescriptor, (locator) => {
            const name = (typeof locator.getName === "function") ? locator.getName() : null;
            return this.createQueue(name);
        });
    }
    /**
     * Creates a message queue component and assigns its name.
     * @param name a name of the created message queue.
     */
    createQueue(name) {
        const queue = new RabbitMQMessageQueue_1.RabbitMQMessageQueue(name);
        if (this._config != null) {
            queue.configure(this._config);
        }
        if (this._references != null) {
            queue.setReferences(this._references);
        }
        return queue;
    }
}
exports.RabbitMQMessageQueueFactory = RabbitMQMessageQueueFactory;
RabbitMQMessageQueueFactory.MemoryQueueDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "message-queue", "rabbitmq", "*", "*");
//# sourceMappingURL=RabbitMQMessageQueueFactory.js.map