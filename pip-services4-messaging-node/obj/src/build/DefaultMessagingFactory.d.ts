/** @module build */
import { Factory } from 'pip-services4-components-node';
/**
 * Creates [[MemoryMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[MemoryMessageQueue]]
 */
export declare class DefaultMessagingFactory extends Factory {
    private static readonly MemoryQueueDescriptor;
    private static readonly MemoryQueueFactoryDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
