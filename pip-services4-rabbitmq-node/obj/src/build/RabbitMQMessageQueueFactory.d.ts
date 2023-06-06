/** @module build */
import { IMessageQueue } from 'pip-services4-messaging-node';
import { MessageQueueFactory } from 'pip-services4-messaging-node';
/**
 * Creates [[RabbitMQMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[RabbitMQMessageQueue]]
 */
export declare class RabbitMQMessageQueueFactory extends MessageQueueFactory {
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
