import { MessageQueue } from 'pip-services4-messaging-node';
import { MessagingCapabilities } from 'pip-services4-messaging-node';
import { MessageEnvelope } from 'pip-services4-messaging-node';
import { NatsConnection } from '../connect/NatsConnection';
import { IReferenceable, IUnreferenceable, IConfigurable, IOpenable, ICleanable, ConfigParams, IReferences, DependencyResolver, IContext } from 'pip-services4-components-node';
import { CompositeLogger } from 'pip-services4-observability-node';
/**
 * Abstract NATS message queue with ability to connect to NATS server.
 */
export declare abstract class NatsAbstractMessageQueue extends MessageQueue implements IReferenceable, IUnreferenceable, IConfigurable, IOpenable, ICleanable {
    private static _defaultConfig;
    private _config;
    private _references;
    private _opened;
    private _localConnection;
    /**
     * The dependency resolver.
     */
    protected _dependencyResolver: DependencyResolver;
    /**
     * The logger.
     */
    protected _logger: CompositeLogger;
    /**
     * The NATS connection component.
     */
    protected _connection: NatsConnection;
    /**
     * The NATS connection pool object.
     */
    protected _client: any;
    protected _serializeEnvelop: boolean;
    protected _subject: string;
    protected _queueGroup: string;
    /**
     * Creates a new instance of the persistence component.
     *
     * @param name    (optional) a queue name.
     */
    constructor(name?: string, capabilities?: MessagingCapabilities);
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Unsets (clears) previously set references to dependent components.
     */
    unsetReferences(): void;
    private createConnection;
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen(): boolean;
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context: IContext): Promise<void>;
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    close(context: IContext): Promise<void>;
    protected getSubject(): string;
    protected fromMessage(message: MessageEnvelope): any;
    protected toMessage(msg: any): MessageEnvelope;
    /**
     * Clears component state.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    clear(context: IContext): Promise<void>;
    /**
     * Reads the current number of messages in the queue to be delivered.
     *
     * @returns number of messages in the queue.
     */
    readMessageCount(): Promise<number>;
    /**
     * Sends a message into the queue.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param message           a message envelop to be sent.
     */
    send(context: IContext, message: MessageEnvelope): Promise<void>;
    /**
     * Renews a lock on a message that makes it invisible from other receivers in the queue.
     * This method is usually used to extend the message processing time.
     *
     * Important: This method is not supported by NATS.
     *
     * @param message       a message to extend its lock.
     * @param lockTimeout   a locking timeout in milliseconds.
     */
    renewLock(message: MessageEnvelope, lockTimeout: number): Promise<void>;
    /**
     * Permanently removes a message from the queue.
     * This method is usually used to remove the message after successful processing.
     *
     * Important: This method is not supported by NATS.
     *
     * @param message   a message to remove.
     */
    complete(message: MessageEnvelope): Promise<void>;
    /**
     * Returnes message into the queue and makes it available for all subscribers to receive it again.
     * This method is usually used to return a message which could not be processed at the moment
     * to repeat the attempt. Messages that cause unrecoverable errors shall be removed permanently
     * or/and send to dead letter queue.
     *
     * Important: This method is not supported by NATS.
     *
     * @param message   a message to return.
     */
    abandon(message: MessageEnvelope): Promise<void>;
    /**
     * Permanently removes a message from the queue and sends it to dead letter queue.
     *
     * Important: This method is not supported by NATS.
     *
     * @param message   a message to be removed.
     */
    moveToDeadLetter(message: MessageEnvelope): Promise<void>;
}
