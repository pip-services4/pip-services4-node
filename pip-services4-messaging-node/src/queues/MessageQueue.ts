/** @module queues */
import { IMessageQueue } from './IMessageQueue';
import { IMessageReceiver } from './IMessageReceiver';
import { MessagingCapabilities } from './MessagingCapabilities';
import { MessageEnvelope } from './MessageEnvelope';
import { InvalidStateException } from 'pip-services4-commons-node';
import { IReferenceable, IConfigurable, ConfigParams, NameResolver, IReferences, IContext, ContextResolver } from 'pip-services4-components-node';
import { ConnectionResolver, CredentialResolver, ConnectionParams, CredentialParams } from 'pip-services4-config-node';
import { CompositeLogger, CompositeCounters } from 'pip-services4-observability-node';

/**
 * Abstract message queue that is used as a basis for specific message queue implementations.
 * 
 * ### Configuration parameters ###
 * 
 * - name:                        name of the message queue
 * - connection(s):
 *   - discovery_key:             key to retrieve parameters from discovery service
 *   - protocol:                  connection protocol like http, https, tcp, udp
 *   - host:                      host name or IP address
 *   - port:                      port number
 *   - uri:                       resource URI or connection string with all parameters in it
 * - credential(s):
 *   - store_key:                 key to retrieve parameters from credential store
 *   - username:                  user name
 *   - password:                  user password
 *   - access_id:                 application access id
 *   - access_key:                application secret key
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] components to discover connection(s)
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/auth.icredentialstore.html ICredentialStore]] componetns to lookup credential(s)
 */
export abstract class MessageQueue implements IMessageQueue, IReferenceable, IConfigurable {
    protected _logger: CompositeLogger = new CompositeLogger();
    protected _counters: CompositeCounters = new CompositeCounters();
    protected _connectionResolver: ConnectionResolver = new ConnectionResolver();
    protected _credentialResolver: CredentialResolver = new CredentialResolver();

    protected _name: string;
    protected _capabilities: MessagingCapabilities;

    /**
     * Creates a new instance of the message queue.
     * 
     * @param name  (optional) a queue name
     * @param capabilities (optional) a capabilities of this message queue
     */
    public constructor(name?: string, capabilities?: MessagingCapabilities) {
        this._name = name;
        this._capabilities = capabilities
            || new MessagingCapabilities(false, false, false, false, false, false, false, false, false);
    }
    
    /**
     * Gets the queue name
     * 
     * @returns the queue name.
     */
    public getName(): string { return this._name; }

    /**
     * Gets the queue capabilities
     * 
     * @returns the queue's capabilities object.
     */
    public getCapabilities(): MessagingCapabilities { return this._capabilities; }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._name = NameResolver.resolve(config, this._name);
        this._logger.configure(config);
        this._connectionResolver.configure(config);
        this._credentialResolver.configure(config);

        this._name = config.getAsStringWithDefault("queue", this._name);
    }

    /**
     * Sets references to dependent components.
     * 
     * @param references     references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._connectionResolver.setReferences(references);
        this._credentialResolver.setReferences(references);
    }

    /**
     * Checks if the component is opened.
     * 
     * @returns true if the component has been opened and false otherwise.
     */
    public abstract isOpen(): boolean;

    /**
     * Opens the component.
     * 
     * @param context     (optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        const connections = await this._connectionResolver.resolveAll(context);
        const credential = await this._credentialResolver.lookup(context);

        await this.openWithParams(context, connections, credential);
    }

    /**
     * Opens the component with given connection and credential parameters.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param connection        connection parameters
     * @param credential        credential parameters
     */
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     protected async openWithParams(context: IContext, connections: ConnectionParams[], credential: CredentialParams): Promise<void> {
        throw new Error("Not supported");
    }   

    /**
     * Checks if the queue has been opened and throws an exception is it's not.
     * @param context     (optional) a context to trace execution through call chain.
     */
    protected checkOpen(context: IContext): void {
        if (!this.isOpen()) {
            throw new InvalidStateException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "NOT_OPENED",
                "The queue is not opened"
            );
        }
    }

    /**
     * Closes component and frees used resources.
     * 
     * @param context     (optional) execution context to trace execution through call chain.
     */
    public abstract close(context: IContext): Promise<void>;

    /**
     * Clears component state.
     * 
     * @param context     (optional) execution context to trace execution through call chain.
     */
    public abstract clear(context: IContext): Promise<void>;

    /**
     * Reads the current number of messages in the queue to be delivered.
     * 
     * @returns      a number of messages in the queue.
     */
    public abstract readMessageCount(): Promise<number>;

    /**
     * Sends a message into the queue.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param envelope          a message envelop to be sent.
     */
    public abstract send(context: IContext, envelope: MessageEnvelope): Promise<void>;

    /**
     * Sends an object into the queue.
     * Before sending the object is converted into JSON string and wrapped in a [[MessageEnvelope]].
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param messageType       a message type
     * @param value             an object value to be sent
     * 
     * @see [[send]]
     */
    public sendAsObject(context: IContext, messageType: string, message: any): Promise<void> {
        const envelope = new MessageEnvelope(context, messageType, message);
        return this.send(context, envelope);
    }

    /**
     * Peeks a single incoming message from the queue without removing it.
     * If there are no messages available in the queue it returns null.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @returns                 a peeked message or <code>null</code>.
     */
    public abstract peek(context: IContext): Promise<MessageEnvelope>;

    /**
     * Peeks multiple incoming messages from the queue without removing them.
     * If there are no messages available in the queue it returns an empty list.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param messageCount      a maximum number of messages to peek.
     * @returns                 a list of peeked messages
     */
    public abstract peekBatch(context: IContext, messageCount: number): Promise<MessageEnvelope[]>;

    /**
     * Receives an incoming message and removes it from the queue.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param waitTimeout       a timeout in milliseconds to wait for a message to come.
     * @returns                 a received message or <code>null</code>.
     */
    public abstract receive(context: IContext, waitTimeout: number): Promise<MessageEnvelope>;

    /**
     * Renews a lock on a message that makes it invisible from other receivers in the queue.
     * This method is usually used to extend the message processing time.
     * 
     * @param message       a message to extend its lock.
     * @param lockTimeout   a locking timeout in milliseconds.
     */
    public abstract renewLock(message: MessageEnvelope, lockTimeout: number): Promise<void>;

    /**
     * Permanently removes a message from the queue.
     * This method is usually used to remove the message after successful processing.
     * 
     * @param message   a message to remove.
     */
    public abstract complete(message: MessageEnvelope): Promise<void>;

    /**
     * Returnes message into the queue and makes it available for all subscribers to receive it again.
     * This method is usually used to return a message which could not be processed at the moment
     * to repeat the attempt. Messages that cause unrecoverable errors shall be removed permanently
     * or/and send to dead letter queue.
     * 
     * @param message   a message to return.
     */
    public abstract abandon(message: MessageEnvelope): Promise<void>;

    /**
     * Permanently removes a message from the queue and sends it to dead letter queue.
     * 
     * @param message   a message to be removed.
     */
    public abstract moveToDeadLetter(message: MessageEnvelope): Promise<void>;

    /**
     * Listens for incoming messages and blocks the current thread until queue is closed.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param receiver          a receiver to receive incoming messages.
     * 
     * @see [[IMessageReceiver]]
     * @see [[receive]]
     */
    public abstract listen(context: IContext, receiver: IMessageReceiver): void;

    /**
     * Ends listening for incoming messages.
     * When this method is call [[listen]] unblocks the thread and execution continues.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     */
    public abstract endListen(context: IContext): void;

    /**
     * Listens for incoming messages without blocking the current thread.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param receiver          a receiver to receive incoming messages.
     * 
     * @see [[listen]]
     * @see [[IMessageReceiver]]
     */
    public beginListen(context: IContext, receiver: IMessageReceiver): void {
        setImmediate(() => {
            this.listen(context, receiver);
        });
    }

    /**
     * Gets a string representation of the object.
     * 
     * @returns a string representation of the object.
     */
    public toString(): string {
        return "[" + this.getName() + "]";
    }

}