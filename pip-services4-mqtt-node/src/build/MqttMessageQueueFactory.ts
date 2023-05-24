/** @module build */
import { Descriptor } from 'pip-services4-commons-node';
import { IMessageQueue } from 'pip-services4-messaging-node';
import { MessageQueueFactory } from 'pip-services4-messaging-node';

import { MqttMessageQueue } from '../queues/MqttMessageQueue';

/**
 * Creates [[MqttMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[MqttMessageQueue]]
 */
export class MqttMessageQueueFactory extends MessageQueueFactory {
    private static readonly MqttQueueDescriptor: Descriptor = new Descriptor("pip-services", "message-queue", "mqtt", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.register(MqttMessageQueueFactory.MqttQueueDescriptor, (locator: Descriptor) => {
            let name = (typeof locator.getName === "function") ? locator.getName() : null; 
            return this.createQueue(name);
        });
    }

    /**
     * Creates a message queue component and assigns its name.
     * @param name a name of the created message queue.
     */
     public createQueue(name: string): IMessageQueue {
        let queue = new MqttMessageQueue(name);

        if (this._config != null) {
            queue.configure(this._config);
        }
        if (this._references != null) {
            queue.setReferences(this._references);
        }

        return queue;        
    }    
}
