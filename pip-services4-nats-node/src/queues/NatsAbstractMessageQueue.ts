/** @module queues */
/** @hidden */
import nats = require('nats');

import { ConnectionException, DateTimeConverter, InvalidStateException } from 'pip-services4-commons-node';
import { StringConverter } from 'pip-services4-commons-node';
import { MessageQueue } from 'pip-services4-messaging-node';
import { MessagingCapabilities } from 'pip-services4-messaging-node';
import { MessageEnvelope } from 'pip-services4-messaging-node';

import { NatsConnection } from '../connect/NatsConnection';
import { IReferenceable, IUnreferenceable, IConfigurable, IOpenable, ICleanable, ConfigParams, IReferences, DependencyResolver, IContext, Context } from 'pip-services4-components-node';
import { CompositeLogger } from 'pip-services4-observability-node';

/**
 * Abstract NATS message queue with ability to connect to NATS server.
 */
export abstract class NatsAbstractMessageQueue extends MessageQueue
    implements IReferenceable, IUnreferenceable, IConfigurable, IOpenable, ICleanable {

    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        "subject", null,
        "queue_group", null,
        "options.serialize_envelop", true,
        "options.retry_connect", true,
        "options.connect_timeout", 0,
        "options.reconnect_timeout", 3000,
        "options.max_reconnect", 3,
        "options.flush_timeout", 3000
    );

    private _config: ConfigParams;
    private _references: IReferences;
    private _opened: boolean;
    private _localConnection: boolean;

    /**
     * The dependency resolver.
     */
    protected _dependencyResolver: DependencyResolver = new DependencyResolver(NatsAbstractMessageQueue._defaultConfig);
    /** 
     * The logger.
     */
    protected _logger: CompositeLogger = new CompositeLogger();
    
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
    public constructor(name?: string, capabilities?: MessagingCapabilities) {
        super(name, capabilities);
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        config = config.setDefaults(NatsAbstractMessageQueue._defaultConfig);
        this._config = config;

        this._dependencyResolver.configure(config);

        // this._serializeEnvelop = config.getAsBooleanWithDefault("options.serialize_envelop", this._serializeEnvelop)
        this._subject = config.getAsStringWithDefault("topic", this._subject);
        this._subject = config.getAsStringWithDefault("subject", this._subject);
        this._queueGroup = config.getAsStringWithDefault("group", this._queueGroup);
        this._queueGroup = config.getAsStringWithDefault("queue_group", this._queueGroup);
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._references = references;
        this._logger.setReferences(references);

        // Get connection
        this._dependencyResolver.setReferences(references);
        this._connection = this._dependencyResolver.getOneOptional('connection');
        // Or create a local one
        if (this._connection == null) {
            this._connection = this.createConnection();
            this._localConnection = true;
        } else {
            this._localConnection = false;
        }
    }

    /**
	 * Unsets (clears) previously set references to dependent components. 
     */
    public unsetReferences(): void {
        this._connection = null;
    }

    private createConnection(): NatsConnection {
        const connection = new NatsConnection();
        
        if (this._config)
            connection.configure(this._config);
        
        if (this._references)
            connection.setReferences(this._references);
            
        return connection;
    }

    /**
	 * Checks if the component is opened.
	 * 
	 * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._opened;
    }

    /**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        if (this._opened) {
            return;
        }
        
        if (this._connection == null) {
            this._connection = this.createConnection();
            this._localConnection = true;
        }

        if (this._localConnection) {
            await this._connection.open(context);
        }

        if (!this._connection.isOpen()) {
            throw new ConnectionException(
                context != null ? context.getTraceId() : null,
                "CONNECT_FAILED",
                "NATS connection is not opened"
            );
        }

        this._opened = true;
        this._client = this._connection.getConnection();
    }
    
    /**
	 * Closes component and frees used resources.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async close(context: IContext): Promise<void> {
        if (!this._opened) {
            return;
        }

        if (this._connection == null) {
            throw new InvalidStateException(
                context != null ? context.getTraceId() : null,
                'NO_CONNECTION',
                'NATS connection is missing'
            );
        }

        if (this._localConnection) {
            await this._connection.close(context);
        }
        
        this._opened = false;
        this._client = null;
    }

    protected getSubject(): string {
        return this._subject != null && this._subject != "" ? this._subject : this._name;
    }

    protected fromMessage(message: MessageEnvelope): any {
        if (message == null) return null;

        const data = message.message || nats.Empty;
        const headers = nats.headers();
        headers.append("message_id", message.message_id);
        headers.append("trace_id", message.trace_id);
        headers.append("message_type", message.message_type);
        headers.append("sent_time", StringConverter.toNullableString(message.sent_time || new Date()));

        return {
            data: data,
            headers: headers
        };
    }

    protected toMessage(msg: any): MessageEnvelope {
        if (msg == null) return null;

        const context = Context.fromTraceId(msg.headers.get("trace_id"));
        const messageType = msg.headers.get("message_type");
        const message = new MessageEnvelope(context, messageType, Buffer.from(msg.data));
        message.message_id = msg.headers.get("message_id");
        message.sent_time = DateTimeConverter.toNullableDateTime(msg.headers.get("sent_time"));
        message.message = msg.data;
        return message;
    }

    /**
	 * Clears component state.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async clear(context: IContext): Promise<void> {
        // Not supported
    }

    /**
     * Reads the current number of messages in the queue to be delivered.
     * 
     * @returns number of messages in the queue.
     */
    public async readMessageCount(): Promise<number> {
        // Not supported
        return 0;
    }

    /**
     * Sends a message into the queue.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param message           a message envelop to be sent.
     */
    public async send(context: IContext, message: MessageEnvelope): Promise<void> {
        this.checkOpen(context);

        const subject = this.getName() || this._subject;
        const msg = this.fromMessage(message);

        await this._connection.publish(subject, msg);
    }

    /**
     * Renews a lock on a message that makes it invisible from other receivers in the queue.
     * This method is usually used to extend the message processing time.
     * 
     * Important: This method is not supported by NATS.
     * 
     * @param message       a message to extend its lock.
     * @param lockTimeout   a locking timeout in milliseconds.
     */
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     public async renewLock(message: MessageEnvelope, lockTimeout: number): Promise<void> {
        // Not supported
    }

    /**
     * Permanently removes a message from the queue.
     * This method is usually used to remove the message after successful processing.
     * 
     * Important: This method is not supported by NATS.
     * 
     * @param message   a message to remove.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async complete(message: MessageEnvelope): Promise<void> {
        // Not supported
    }

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async abandon(message: MessageEnvelope): Promise<void> {
        // Not supported
    }

    /**
     * Permanently removes a message from the queue and sends it to dead letter queue.
     * 
     * Important: This method is not supported by NATS.
     * 
     * @param message   a message to be removed.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async moveToDeadLetter(message: MessageEnvelope): Promise<void> {
        // Not supported
    }
    
}