/** @module build */
import { Descriptor, Factory } from 'pip-services4-components-node';

import { KafkaMessageQueue } from '../queues/KafkaMessageQueue';
import { KafkaConnection } from '../connect/KafkaConnection';
import { KafkaMessageQueueFactory } from './KafkaMessageQueueFactory';

/**
 * Creates [[KafkaMessageQueue]] components by their descriptors.
 * 
 * @see [[KafkaMessageQueue]]
 */
export class DefaultKafkaFactory extends Factory {
    private static readonly KafkaQueueDescriptor: Descriptor = new Descriptor("pip-services", "message-queue", "kafka", "*", "1.0");
    private static readonly KafkaConnectionDescriptor: Descriptor = new Descriptor("pip-services", "connection", "kafka", "*", "1.0");
    private static readonly KafkaQueueFactoryDescriptor: Descriptor = new Descriptor("pip-services", "queue-factory", "kafka", "*", "1.0");

    /**
     * Create a new instance of the factory.
     */
    public constructor() {
        super();
        this.register(DefaultKafkaFactory.KafkaQueueDescriptor, (locator: Descriptor) => {
            const name = (typeof locator.getName === "function") ? locator.getName() : null; 
            return new KafkaMessageQueue(name);
        });
        this.registerAsType(DefaultKafkaFactory.KafkaConnectionDescriptor, KafkaConnection);
        this.registerAsType(DefaultKafkaFactory.KafkaQueueFactoryDescriptor, KafkaMessageQueueFactory);
    }
}