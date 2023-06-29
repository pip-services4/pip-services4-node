/** @module queues */
import { Options } from 'amqplib';
import amqplib = require('amqplib');

import { ConfigException } from 'pip-services4-commons-node';
import { InvalidStateException } from 'pip-services4-commons-node';
import { IMessageReceiver } from 'pip-services4-messaging-node';
import { MessageQueue } from 'pip-services4-messaging-node';
import { MessagingCapabilities } from 'pip-services4-messaging-node';
import { MessageEnvelope } from 'pip-services4-messaging-node';
import { RabbitMQConnectionResolver } from '../connect';
import { IConfigurable, IOpenable, ICleanable, ConfigParams, IContext, Context, ContextResolver } from 'pip-services4-components-node';

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
export class RabbitMQMessageQueue extends MessageQueue
    implements IConfigurable, IOpenable, ICleanable {
    
    /**
     * The RabbitMQ connection component.
     */
    protected _connection: amqplib.Connection;
    protected _mqChanel: amqplib.Channel;

    private interval = 10000;

    private _queue = "";
    private _exchange = "";
    private _exchangeType: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' | string = "fanout";
    private _routingKey = "";
    private _persistent = false;
    private _exclusive = false;
    private _autoCreate = false;
    private _autoDelete = false;
    private _noQueue = false;

    private _optionsResolver: RabbitMQConnectionResolver = new RabbitMQConnectionResolver();
    private _listen = false;

    /**
     * Creates a new instance of the persistence component.
     * 
     * @param name    (optional) a queue name.
     * @param config (optional) configuration parameters.
     */
    public constructor(name?: string, config?: ConfigParams) {
        super(name, new MessagingCapabilities(false, true, true, true, true, false, false, false, true));

        if (config != null) this.configure(config);
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        super.configure(config);

        this.interval = config.getAsLongWithDefault("interval", this.interval);

        this._queue = config.getAsStringWithDefault("queue", this._queue ?? this._name);
        this._exchange = config.getAsStringWithDefault("exchange", this._exchange);

        this._exchangeType = config.getAsStringWithDefault("options.exchange_type", this._exchangeType);
        this._routingKey = config.getAsStringWithDefault("options.routing_key", this._routingKey);
        this._persistent = config.getAsBooleanWithDefault("options.persistent", this._persistent);
        this._exclusive = config.getAsBooleanWithDefault("options.exclusive", this._exclusive);
        this._autoCreate = config.getAsBooleanWithDefault("options.auto_create", this._autoCreate);
        this._autoDelete = config.getAsBooleanWithDefault("options.auto_delete", this._autoDelete);
        this._noQueue = config.getAsBooleanWithDefault("options.no_queue", this._noQueue);     
    }

    private checkOpened(context: IContext): void {
        if (this._mqChanel == null)
            throw new InvalidStateException(context != null ? ContextResolver.getTraceId(context) : null, "NOT_OPENED", "The queue is not opened");
    }

    /**
	 * Checks if the component is opened.
	 * 
	 * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._connection != null && this._mqChanel != null;
    }

    /**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        const connection = await this._connectionResolver.resolve(context);
        const credential = await this._credentialResolver.lookup(context);

        const options = await this._optionsResolver.compose(context, connection, credential)

        if (this._queue == "" && this._exchange == "") {
            throw new ConfigException(context != null ? ContextResolver.getTraceId(context) : null,
                "NO_QUEUE",
                "Queue or exchange are not defined in connection parameters");
        }

        this._connection = await amqplib.connect(options.getAsString("uri"));
        this._mqChanel = await this._connection.createChannel();

        // Automatically create queue, exchange and binding
        if (this._autoCreate) {
            if (this._exchange != "") {
                await this._mqChanel.assertExchange(
                    this._exchange,
                    this._exchangeType,
                    {
                        durable: this._persistent,
                        internal: false,
                        autoDelete: this._autoDelete,
                    }
                )
            }

            if (!this._noQueue) {
                if (this._queue == "") {
                    const res = await this._mqChanel.assertQueue(
                        "",
                        {
                            exclusive: true,
                            durable: this._persistent,
                            autoDelete: true
                        }
                    );

                    this._queue = res.queue;
                } else {
                    await this._mqChanel.assertQueue(
                        this._queue,
                        {
                            exclusive: this._exclusive,
                            durable: this._persistent,
                            autoDelete: this._autoDelete
                        }
                    );
                }

                if (this._routingKey == '') this._routingKey = this._queue;
                await this._mqChanel.bindQueue(this._queue, this._routingKey, this._exchange);
            }
        }
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async close(context: IContext): Promise<void> {
        if (this._mqChanel != null) {
            await this._mqChanel.close();
        }

        if (this._connection != null) {
            await this._connection.close();
        }

        this._mqChanel = null;
        this._connection = null;

        this._logger.trace(context, "Closed queue %s", this._queue);
    }

    /**
     * Reads the current number of messages in the queue to be delivered.
     * 
     * @returns number of available messages.
     */
    public async readMessageCount(): Promise<number> {
        this.checkOpened(null);

        if (this._queue == "") {
            return 0;
        }

        const queueInfo = await this._mqChanel.checkQueue(this._queue);

        return queueInfo.messageCount;
    }

    protected toMessage(msg: amqplib.Message): MessageEnvelope {
        if (msg == null) return null;

        const message = new MessageEnvelope(Context.fromTraceId(msg.properties.correlationId), msg.properties.type, msg.content.toString());
        message.message_type = msg.properties.type;
        message.sent_time = new Date();
        message.setReference(msg);

        return message;
    }

    /**
     * Sends a message into the queue.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param message           a message envelop to be sent.
     */
    public async send(context: IContext, message: MessageEnvelope): Promise<void> {
        this.checkOpen(context);

        const options: Options.Publish = {
            contentType: "text/plain"
        };

        this._mqChanel.publish

        if (message.trace_id)
            options.correlationId = message.trace_id;

        if (message.message_id)
            options.messageId = message.message_id;

        if (message.message_type)
            options.type = message.message_type;

        const buf = message.message;

        const ok = this._mqChanel.publish(this._exchange, this._routingKey, buf, options);

        if (ok) {
            this._counters.incrementOne("queue." + this._name + ".sent_messages");
            this._logger.debug(Context.fromTraceId(message.trace_id), "Sent message %s via %s", message, this._name);
        } else {
            this._logger.debug(Context.fromTraceId(message.trace_id), "Message %s was not sent to %s", message, this._name);
        }
    }

    /**
     * Peeks a single incoming message from the queue without removing it.
     * If there are no messages available in the queue it returns null.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @returns a peeked message.
     */
     public async peek(context: IContext): Promise<MessageEnvelope> {
        this.checkOpen(context);

        const envelope = await this._mqChanel.get(this._queue, { noAck: false})

        if (!envelope) return null;

        const message = this.toMessage(envelope);

        if (message != null) {
            this._logger.trace(Context.fromTraceId(message.trace_id), "Peeked message %s on %s", message, this._name)
        }

        return message;
    }

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
    public async peekBatch(context: IContext, messageCount: number): Promise<MessageEnvelope[]> {
        this.checkOpen(context);

        const messages: MessageEnvelope[] = [];

        for (; messageCount > 0;) {
            const envelope = await this._mqChanel.get(this._queue, {noAck: false});
            if (!envelope) break;

            const message = this.toMessage(envelope);
            messages.push(message);
            messageCount--;
        }

        this._logger.trace(context, "Peeked %s messages on %s", messages.length, this._name);
        return messages;
    }

    /**
     * Receives an incoming message and removes it from the queue.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param waitTimeout       a timeout in milliseconds to wait for a message to come.
     * @returns a received message.
     */
    public async receive(context: IContext, waitTimeout: number): Promise<MessageEnvelope> {
        this.checkOpen(context);

        let message: MessageEnvelope;
        let timeout = waitTimeout;
        
        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (timeout <= 0) break;

            // Read the message and exit if received
            const env = await this._mqChanel.get(this._queue, {noAck: false});
            if (env) {
                message = this.toMessage(env);
                break;
            }
            timeout = timeout - this.interval;
        }

        if (message != null) {
            this._counters.incrementOne("queue." + this._name + ".received_messages");
            this._logger.debug(Context.fromTraceId(message.trace_id), "Received message %s via %s", message, this._name);
        }

        return message;
    }

    /**
     * Renews a lock on a message that makes it invisible from other receivers in the queue.
     * This method is usually used to extend the message processing time.
     * 
     * Important: This method is not supported by RabbitMQ.
     * 
     * @param message       a message to extend its lock.
     * @param lockTimeout   a locking timeout in milliseconds.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async renewLock(message: MessageEnvelope, lockTimeout: number): Promise<void> {
        // Not supported
    }

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
    public async abandon(message: MessageEnvelope): Promise<void> {
        this.checkOpened(null);

        // Make the message immediately visible
        const envelope = message.getReference() as amqplib.GetMessage;
        if (envelope != null) {
            this._mqChanel.nack(envelope, false, true);

            message.setReference(null);
            this._logger.trace(Context.fromTraceId(message.trace_id), "Abandoned message %s at %c", message, this._name);
        }
    }

    /**
     * Permanently removes a message from the queue.
     * This method is usually used to remove the message after successful processing.
     * 
     * Important: This method is not supported by RabbitMQ.
     * 
     * @param message   a message to remove.
     */
    public async complete(message: MessageEnvelope): Promise<void> {
        this.checkOpened(null);

        // Make the message immediately visible
        const envelope = message.getReference() as amqplib.GetMessage;
        if (envelope != null) {
            this._mqChanel.ack(envelope, false);

            message.setReference(null);
            this._logger.trace(Context.fromTraceId(message.trace_id), "Completed message %s at %s", message, this._name);
        }
    }

    /**
     * Permanently removes a message from the queue and sends it to dead letter queue.
     * 
     * Important: This method is not supported by RabbitMQ.
     * 
     * @param message   a message to be removed.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async moveToDeadLetter(message: MessageEnvelope): Promise<void> {
        // Not supported
    }

     /**
     * Listens for incoming messages and blocks the current thread until queue is closed.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param receiver          a receiver to receive incoming messages.
     * 
     * @see [[IMessageReceiver]]
     * @see [[receive]]
     */
      public listen(context: IContext, receiver: IMessageReceiver): void {
        this.checkOpen(context);

        this._logger.debug(context, "Started listening messages at %s", this._name);
        
        const options = {
            noLocal: false,
            noAck: false,
            exclusive: false
        }

        this._listen = true;
        
        this._mqChanel.consume(
            this._queue,
            async (msg) => {
                if (!this._listen) {
                    await this._mqChanel.cancel(msg.fields.consumerTag);
                } else {
                    if (msg != null) {
                        const message = this.toMessage(msg);
                        this._counters.incrementOne("queue." + this._name + ".received_messages");
                        this._logger.debug(Context.fromTraceId(message.trace_id), "Received message %s via %s", message, this._name);
                        await receiver.receiveMessage(message, this);
                        this._mqChanel.ack(msg, false);
                    }
                }
            },
            options
        );
    }

    /**
     * Ends listening for incoming messages.
     * When this method is call [[listen]] unblocks the thread and execution continues.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public endListen(context: IContext): void {
        this._listen = false;
    }   

    /**
     * Clear method are clears component state.
     * @param context (optional) transaction id to trace execution through call chain.
     */
    public async clear(context: IContext): Promise<void> {
        this.checkOpened(context);

        let count = 0;
        if (this._queue != "") {
            const res = await this._mqChanel.purgeQueue(this._queue);
            count = res.messageCount;
        }

        this._logger.trace(context, "Cleared  %s messages in queue %s", count, this._name);
    }
}