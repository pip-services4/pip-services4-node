"use strict";
/** @module build */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryMessageQueueFactory = void 0;
const MemoryMessageQueue_1 = require("../queues/MemoryMessageQueue");
const MessageQueueFactory_1 = require("./MessageQueueFactory");
const pip_services4_components_node_1 = require("pip-services4-components-node");
/**
 * Creates [[MemoryMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[MemoryMessageQueue]]
 */
class MemoryMessageQueueFactory extends MessageQueueFactory_1.MessageQueueFactory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.register(MemoryMessageQueueFactory.MemoryQueueDescriptor, (locator) => {
            const name = (typeof locator.getName === "function") ? locator.getName() : null;
            return this.createQueue(name);
        });
    }
    /**
     * Creates a message queue component and assigns its name.
     * @param name a name of the created message queue.
     */
    createQueue(name) {
        const queue = new MemoryMessageQueue_1.MemoryMessageQueue(name);
        if (this._config != null) {
            queue.configure(this._config);
        }
        if (this._references != null) {
            queue.setReferences(this._references);
        }
        return queue;
    }
}
exports.MemoryMessageQueueFactory = MemoryMessageQueueFactory;
MemoryMessageQueueFactory.MemoryQueueDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "message-queue", "memory", "*", "1.0");
//# sourceMappingURL=MemoryMessageQueueFactory.js.map