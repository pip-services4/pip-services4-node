/** @module build */
import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-commons-node';

import { RabbitMQMessageQueue } from '../queues/RabbitMQMessageQueue';
import { RabbitMQMessageQueueFactory } from './RabbitMQMessageQueueFactory';

/**
 * Creates [[RabbitMQMessageQueue]] components by their descriptors.
 * 
 * @see [[RabbitMQMessageQueue]]
 */
export class DefaultRabbitMQFactory extends Factory {
	private static readonly RabbitMQMessageQueueDescriptor: Descriptor = new Descriptor("pip-services", "message-queue", "rabbitmq", "*", "1.0");
	private static readonly RabbitMQMessageQueueFactoryDescriptor: Descriptor = new Descriptor("pip-services", "queue-factory", "rabbitmq", "*", "1.0");

	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.register(DefaultRabbitMQFactory.RabbitMQMessageQueueDescriptor, (locator: Descriptor) => {
            let name = (typeof locator.getName === "function") ? locator.getName() : null; 
            return new RabbitMQMessageQueue(name);
        });
		this.registerAsType(DefaultRabbitMQFactory.RabbitMQMessageQueueFactoryDescriptor, RabbitMQMessageQueueFactory);
	}
}