import amqplib = require('amqplib');
import { IMessageReceiver } from 'pip-services4-messaging-node';
import { MessageQueue } from 'pip-services4-messaging-node';
import { MessageEnvelope } from 'pip-services4-messaging-node';
import { IConfigurable, IOpenable, ICleanable, ConfigParams, IContext } from 'pip-services4-components-node';
/**
 * Message queue that sends and receives messages via RabbitMQ message broker.
 *
 * RabbitMQ is a popular light-weight protocol to communicate IoT devices.
 *
 * ### Configuration parameters ###
 *
 *   - topic:                         name of RabbitMQ topic to subscribe
 *   - connection(s):
 *   	- discovery_key:               (optional) a key to retrieve the connection from  IDiscovery
 *   	- host:                        host name or IP address
 *   	- port:                        port number
 *   	- uri:                         resource URI or connection string with all parameters in it
 *   - credential(s):
 *   	- store_key:                   (optional) a key to retrieve the credentials from ICredentialStore
 *   	- username:                    user name
 *   	- password:                    user password
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connections
 * - <code>\*:credential-store:\*:\*:1.0</code>   (optional) Credential stores to resolve credentials
 *
 * @see [[MessageQueue]]
 * @see [[MessagingCapabilities]]
 *
 * ### Example ###
 *
 *    queue := new RabbitMQMessageQueue("myqueue")
 *    queue.configure(ConfigParams.fromTuples(
 *    	"exchange", "my_exchange",
 *    	"queue", "my_exchange",
 *    	"options.auto_create", true,
 *    	"connection.host", "5672",
 *    	"connection.port", "localhost",
 *    	"credential.username", "user",
 *    	"credential.password", "password",
 *    ))'
 *    await queue.open("123")'
 *    await queue.send("123", new MessageEnvelope("", "mymessage", "ABC"));
 *    message := await queue.receive("123", 10000);
 *    if (message != null) {
 *    	// ...
 *    	await queue.complete(message);
 *    }
 */
export declare class RabbitMQMessageQueue extends MessageQueue implements IConfigurable, IOpenable, ICleanable {
    /**
     * The RabbitMQ connection component.
     */
    protected _connection: amqplib.Connection;
    protected _mqChanel: amqplib.Channel;
    private interval;
    private _queue;
    private _exchange;
    private _exchangeType;
    private _routingKey;
    private _persistent;
    private _exclusive;
    private _autoCreate;
    private _autoDelete;
    private _noQueue;
    private _optionsResolver;
    private _listen;
    /**
     * Creates a new instance of the persistence component.
     *
     * @param name    (optional) a queue name.
     * @param config (optional) configuration parameters.
     */
    constructor(name?: string, config?: ConfigParams);
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    private checkOpened;
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
    /**
     * Reads the current number of messages in the queue to be delivered.
     *
     * @returns number of available messages.
     */
    readMessageCount(): Promise<number>;
    protected toMessage(msg: amqplib.Message): MessageEnvelope;
    /**
     * Sends a message into the queue.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param message           a message envelop to be sent.
     */
    send(context: IContext, message: MessageEnvelope): Promise<void>;
    /**
     * Peeks a single incoming message from the queue without removing it.
     * If there are no messages available in the queue it returns null.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @returns a peeked message.
     */
    peek(context: IContext): Promise<MessageEnvelope>;
    /**
     * Peeks multiple incoming messages from the queue without removing them.
     * If there are no messages available in the queue it returns an empty list.
     *
     * Important: This method is not supported by RabbitMQ.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param messageCount      a maximum number of messages to peek.
     * @returns a list with peeked messages.
     */
    peekBatch(context: IContext, messageCount: number): Promise<MessageEnvelope[]>;
    /**
     * Receives an incoming message and removes it from the queue.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param waitTimeout       a timeout in milliseconds to wait for a message to come.
     * @returns a received message.
     */
    receive(context: IContext, waitTimeout: number): Promise<MessageEnvelope>;
    /**
     * Renews a lock on a message that makes it invisible from other receivers in the queue.
     * This method is usually used to extend the message processing time.
     *
     * Important: This method is not supported by RabbitMQ.
     *
     * @param message       a message to extend its lock.
     * @param lockTimeout   a locking timeout in milliseconds.
     */
    renewLock(message: MessageEnvelope, lockTimeout: number): Promise<void>;
    /**
    * Returnes message into the queue and makes it available for all subscribers to receive it again.
    * This method is usually used to return a message which could not be processed at the moment
    * to repeat the attempt. Messages that cause unrecoverable errors shall be removed permanently
    * or/and send to dead letter queue.
    *
    * Important: This method is not supported by RabbitMQ.
    *
    * @param message   a message to return.
    */
    abandon(message: MessageEnvelope): Promise<void>;
    /**
     * Permanently removes a message from the queue.
     * This method is usually used to remove the message after successful processing.
     *
     * Important: This method is not supported by RabbitMQ.
     *
     * @param message   a message to remove.
     */
    complete(message: MessageEnvelope): Promise<void>;
    /**
     * Permanently removes a message from the queue and sends it to dead letter queue.
     *
     * Important: This method is not supported by RabbitMQ.
     *
     * @param message   a message to be removed.
     */
    moveToDeadLetter(message: MessageEnvelope): Promise<void>;
    /**
    * Listens for incoming messages and blocks the current thread until queue is closed.
    *
    * @param context     (optional) a context to trace execution through call chain.
    * @param receiver          a receiver to receive incoming messages.
    *
    * @see [[IMessageReceiver]]
    * @see [[receive]]
    */
    listen(context: IContext, receiver: IMessageReceiver): void;
    /**
     * Ends listening for incoming messages.
     * When this method is call [[listen]] unblocks the thread and execution continues.
     *
     * @param context     (optional) a context to trace execution through call chain.
     */
    endListen(context: IContext): void;
    /**
     * Clear method are clears component state.
     * @param context (optional) transaction id to trace execution through call chain.
     */
    clear(context: IContext): Promise<void>;
}
