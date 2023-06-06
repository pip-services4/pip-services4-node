/** @module queues */
import { IMessageReceiver } from 'pip-services4-messaging-node';
import { MessageEnvelope } from 'pip-services4-messaging-node';
import { MessagingCapabilities } from 'pip-services4-messaging-node';

import { NatsAbstractMessageQueue } from './NatsAbstractMessageQueue';
import { ConfigParams, Context, IContext } from 'pip-services4-components-node';

/**
 * Message queue that sends and receives messages via NATS message broker.
 *  
 * ### Configuration parameters ###
 * 
 * - subject:                       name of NATS topic (subject) to subscribe
 * - queue_group:                   name of NATS queue group
 * - connection(s):
 *   - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - host:                        host name or IP address
 *   - port:                        port number
 *   - uri:                         resource URI or connection string with all parameters in it
 * - credential(s):
 *   - store_key:                   (optional) a key to retrieve the credentials from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/auth.icredentialstore.html ICredentialStore]]
 *   - username:                    user name
 *   - password:                    user password
 * - options:
 *   - serialize_message:    (optional) true to serialize entire message as JSON, false to send only message payload (default: true)
 *   - autosubscribe:        (optional) true to automatically subscribe on option (default: false)
 *   - retry_connect:        (optional) turns on/off automated reconnect when connection is log (default: true)
 *   - max_reconnect:        (optional) maximum reconnection attempts (default: 3)
 *   - reconnect_timeout:    (optional) number of milliseconds to wait on each reconnection attempt (default: 3000)
 *   - flush_timeout:        (optional) number of milliseconds to wait on flushing messages (default: 3000)
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connections
 * - <code>\*:credential-store:\*:\*:1.0</code>   (optional) Credential stores to resolve credentials
 * - <code>\*:connection:nats:\*:1.0</code>       (optional) Shared connection to NATS service
 * 
 * @see [[MessageQueue]]
 * @see [[MessagingCapabilities]]
 * 
 * ### Example ###
 * 
 *     let queue = new NatsMessageQueue("myqueue");
 *     queue.configure(ConfigParams.fromTuples(
 *       "topic", "mytopic",
 *       "connection.protocol", "nats"
 *       "connection.host", "localhost"
 *       "connection.port", 1883
 *     ));
 * 
 *     queue.open("123", (err) => {
 *         ...
 *     });
 * 
 *     queue.send("123", new MessageEnvelope(null, "mymessage", "ABC"));
 * 
 *     queue.receive("123", (err, message) => {
 *         if (message != null) {
 *            ...
 *            queue.complete("123", message);
 *         }
 *     });
 */
export class NatsMessageQueue extends NatsAbstractMessageQueue {
    protected _autoSubscribe: boolean;
    protected _subscribed: boolean;
    protected _messages: MessageEnvelope[] = [];
    protected _receiver: IMessageReceiver;

    /**
     * Creates a new instance of the message queue.
     * 
     * @param name  (optional) a queue name.
     */
    public constructor(name?: string) {
        super(name, new MessagingCapabilities(false, true, true, true, true, false, false, false, true));
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
     public configure(config: ConfigParams): void {
         super.configure(config);

        this._autoSubscribe = config.getAsBooleanWithDefault("options.autosubscribe", this._autoSubscribe);
    }

    /**
     * Opens the component.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        if (this.isOpen()) {
            return;
        }

        try {
            await super.open(context);

            // Subscribe right away
            if (this._autoSubscribe) {
                await this.subscribe(context);
            }
        } catch (ex) {
            await this.close(context);
            throw ex;
        }
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async close(context: IContext): Promise<void> {
        if (!this.isOpen()) {
            return;
        }

        // Unsubscribe from the topic
        if (this._subscribed) {
            const subject = this.getSubject();
            await this._connection.unsubscribe(subject, this);
            this._subscribed = false;
        }
    
        await super.close(context);

        this._messages = [];
        this._receiver = null;
    }

    /**
	 * Clears component state.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async clear(context: IContext): Promise<void> {
        this._messages = [];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async subscribe(context: IContext): Promise<void> {
        if (this._subscribed) {
            return;
        }

        // Subscribe right away
        const subject = this.getSubject();
        await this._connection.subscribe(
            subject,
            { group: this._queueGroup },
            this
        );

        this._subscribed = true;
    }

    /**
     * Reads the current number of messages in the queue to be delivered.
     * 
     * @returns a number of messages in the queue.
     */
     public async readMessageCount(): Promise<number> {
        return this._messages.length;
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

        // Subscribe to topic if needed
        await this.subscribe(context);

        // Peek a message from the top
        let message: MessageEnvelope = null;
        if (this._messages.length > 0) {
            message = this._messages[0];
        }

        if (message != null) {
            this._logger.trace(Context.fromTraceId(message.trace_id), "Peeked message %s on %s", message, this.getName());
        }
    
        return message;
    }

    /**
     * Peeks multiple incoming messages from the queue without removing them.
     * If there are no messages available in the queue it returns an empty list.
     * 
     * Important: This method is not supported by NATS.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param messageCount      a maximum number of messages to peek.
     * @returns a list with peeked messages.
     */
    public async peekBatch(context: IContext, messageCount: number): Promise<MessageEnvelope[]> {
        this.checkOpen(context);

        // Subscribe to topic if needed
        await this.subscribe(context);

        // Peek a batch of messages
        const messages = this._messages.slice(0, messageCount);

        this._logger.trace(context, "Peeked %d messages on %s", messages.length, this.getName());

        return messages;
    }

    /**
     * Receives an incoming message and removes it from the queue.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param waitTimeout       a timeout in milliseconds to wait for a message to come.
     * @returns a received message or <code>null</code> if nothing was received.
     */
    public async receive(context: IContext, waitTimeout: number): Promise<MessageEnvelope> {
        this.checkOpen(context);

        // Subscribe to topic if needed
        this.subscribe(context);

        let message: MessageEnvelope = null;

        // Return message immediately if it exist
        if (this._messages.length > 0) {
            message = this._messages.shift();
            return message;
        }

        // Otherwise wait and return
        const checkInterval = 100;
        let elapsedTime = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const test = this.isOpen() && elapsedTime < waitTimeout && message == null;
            if (!test) break;
            
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            message = await new Promise<MessageEnvelope>((resolve, reject) => {
                setTimeout(() => {
                    const message = this._messages.shift();
                    resolve(message);
                }, checkInterval);
            });

            elapsedTime += checkInterval;
        }

        return message;
    }

    public onMessage(err: any, msg: any): void {
        if (err != null || msg == null) {
            this._logger.error(null, err, "Failed to receive a message");
            return;
        } 

        // Deserialize message
        const message = this.toMessage(msg)
        if (message == null) {
            this._logger.error(null, null, "Failed to read received message");
            return;
        }

        this._counters.incrementOne("queue." + this.getName() + ".received_messages");
        this._logger.debug(Context.fromTraceId(message.trace_id), "Received message %s via %s", message, this.getName());

        // Send message to receiver if its set or put it into the queue
        if (this._receiver != null) {
            this.sendMessageToReceiver(this._receiver, message);
        } else {
            this._messages.push(message);
        }
    }

    private sendMessageToReceiver(receiver: IMessageReceiver, message: MessageEnvelope): void {
        const context = message != null ? Context.fromTraceId(message.trace_id) : new Context();
        if (message == null || receiver == null) {
            this._logger.warn(context, "NATS message was skipped.");
            return;
        }

        this._receiver.receiveMessage(message, this)
        .catch((err) => {
            this._logger.error(context, err, "Failed to process the message");
        });
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

        // Subscribe to topic if needed
        this.subscribe(context)
        .then(() => {
            this._logger.trace(null, "Started listening messages at %s", this.getName());

            // Resend collected messages to receiver
            while (this.isOpen() && this._messages.length > 0) {
                const message = this._messages.shift();
                if (message != null) {
                    this.sendMessageToReceiver(receiver, message);
                }
            }

            // Set the receiver
            if (this.isOpen()) {
                this._receiver = receiver;
            }
        });
    }

    /**
     * Ends listening for incoming messages.
     * When this method is call [[listen]] unblocks the thread and execution continues.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public endListen(context: IContext): void {
        this._receiver = null;
    }

}