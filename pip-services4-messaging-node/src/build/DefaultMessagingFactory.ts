/** @module build */
import { Descriptor, Factory } from 'pip-services4-components-node';

import { MemoryMessageQueue } from '../queues/MemoryMessageQueue';
import { MemoryMessageQueueFactory } from './MemoryMessageQueueFactory';

/**
 * Creates [[MemoryMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[MemoryMessageQueue]]
 */
export class DefaultMessagingFactory extends Factory {
    private static readonly MemoryQueueDescriptor: Descriptor = new Descriptor("pip-services", "message-queue", "memory", "*", "1.0");
    private static readonly MemoryQueueFactoryDescriptor: Descriptor = new Descriptor("pip-services", "queue-factory", "memory", "*", "1.0");

    /**
     * Create a new instance of the factory.
     */
    public constructor() {
        super();
        this.register(DefaultMessagingFactory.MemoryQueueDescriptor, (locator: Descriptor) => {
            const name = (typeof locator.getName === "function") ? locator.getName() : null; 
            return new MemoryMessageQueue(name);
        });
        this.registerAsType(DefaultMessagingFactory.MemoryQueueFactoryDescriptor, MemoryMessageQueueFactory);
    }
}
