/** @module build */
import { IMessageQueue } from '../queues/IMessageQueue';
import { MessageQueueFactory } from './MessageQueueFactory';
/**
 * Creates [[MemoryMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[MemoryMessageQueue]]
 */
export declare class MemoryMessageQueueFactory extends MessageQueueFactory {
    private static readonly MemoryQueueDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
    /**
     * Creates a message queue component and assigns its name.
     * @param name a name of the created message queue.
     */
    createQueue(name: string): IMessageQueue;
}
