/** @module build */
import { ConfigParams, Factory, IConfigurable, IReferenceable, IReferences } from 'pip-services4-components-node';


import { IMessageQueue } from '../queues/IMessageQueue';
import { IMessageQueueFactory } from './IMessageQueueFactory';

/**
 * Creates [[IMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[MessageQueue]]
 */
export abstract class MessageQueueFactory extends Factory implements IMessageQueueFactory, IConfigurable, IReferenceable {
    protected _config: ConfigParams;
    protected _references: IReferences;

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
     public configure(config: ConfigParams): void {
        this._config = config;
    }

    /**
     * Sets references to dependent components.
     * 
     * @param references     references to locate the component dependencies. 
     */
     public setReferences(references: IReferences): void {
        this._references = references;
    }

    /**
     * Creates a message queue component and assigns its name.
     * @param name a name of the created message queue.
     */
    public abstract createQueue(name: string): IMessageQueue;
}
