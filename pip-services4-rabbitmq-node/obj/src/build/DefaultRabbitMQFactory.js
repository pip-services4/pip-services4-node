"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultRabbitMQFactory = void 0;
/** @module build */
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const RabbitMQMessageQueue_1 = require("../queues/RabbitMQMessageQueue");
const RabbitMQMessageQueueFactory_1 = require("./RabbitMQMessageQueueFactory");
/**
 * Creates [[RabbitMQMessageQueue]] components by their descriptors.
 *
 * @see [[RabbitMQMessageQueue]]
 */
class DefaultRabbitMQFactory extends pip_services3_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.register(DefaultRabbitMQFactory.RabbitMQMessageQueueDescriptor, (locator) => {
            let name = (typeof locator.getName === "function") ? locator.getName() : null;
            return new RabbitMQMessageQueue_1.RabbitMQMessageQueue(name);
        });
        this.registerAsType(DefaultRabbitMQFactory.RabbitMQMessageQueueFactoryDescriptor, RabbitMQMessageQueueFactory_1.RabbitMQMessageQueueFactory);
    }
}
exports.DefaultRabbitMQFactory = DefaultRabbitMQFactory;
DefaultRabbitMQFactory.RabbitMQMessageQueueDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "message-queue", "rabbitmq", "*", "1.0");
DefaultRabbitMQFactory.RabbitMQMessageQueueFactoryDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "queue-factory", "rabbitmq", "*", "1.0");
//# sourceMappingURL=DefaultRabbitMQFactory.js.map