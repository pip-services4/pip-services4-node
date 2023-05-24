/** @module build */
import { Factory } from 'pip-services4-components-node';
/**
 * Creates [[RabbitMQMessageQueue]] components by their descriptors.
 *
 * @see [[RabbitMQMessageQueue]]
 */
export declare class DefaultRabbitMQFactory extends Factory {
    private static readonly RabbitMQMessageQueueDescriptor;
    private static readonly RabbitMQMessageQueueFactoryDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
