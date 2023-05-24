"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsMessageQueueFactory = void 0;
/** @module build */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_messaging_node_1 = require("pip-services4-messaging-node");
const NatsMessageQueue_1 = require("../queues/NatsMessageQueue");
const NatsBareMessageQueue_1 = require("../queues/NatsBareMessageQueue");
/**
 * Creates [[NatsMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[NatsMessageQueue]]
 */
class NatsMessageQueueFactory extends pip_services3_messaging_node_1.MessageQueueFactory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.register(NatsMessageQueueFactory.NatsQueueDescriptor, (locator) => {
            let name = (typeof locator.getName === "function") ? locator.getName() : null;
            return this.createQueue(name);
        });
        this.register(NatsMessageQueueFactory.NatsBareQueueDescriptor, (locator) => {
            let name = (typeof locator.getName === "function") ? locator.getName() : null;
            return this.createBareQueue(name);
        });
    }
    /**
     * Creates a message queue component and assigns its name.
     * @param name a name of the created message queue.
     */
    createQueue(name) {
        let queue = new NatsMessageQueue_1.NatsMessageQueue(name);
        if (this._config != null) {
            queue.configure(this._config);
        }
        if (this._references != null) {
            queue.setReferences(this._references);
        }
        return queue;
    }
    /**
     * Creates a bare message queue component and assigns its name.
     * @param name a name of the created message queue.
     */
    createBareQueue(name) {
        let queue = new NatsBareMessageQueue_1.NatsBareMessageQueue(name);
        if (this._config != null) {
            queue.configure(this._config);
        }
        if (this._references != null) {
            queue.setReferences(this._references);
        }
        return queue;
    }
}
exports.NatsMessageQueueFactory = NatsMessageQueueFactory;
NatsMessageQueueFactory.NatsQueueDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "message-queue", "nats", "*", "1.0");
NatsMessageQueueFactory.NatsBareQueueDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "message-queue", "bare-nats", "*", "1.0");
//# sourceMappingURL=NatsMessageQueueFactory.js.map