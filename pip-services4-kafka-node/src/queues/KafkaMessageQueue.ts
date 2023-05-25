/** @module queues */
import { Descriptor, IReferenceable, Reference, References } from 'pip-services4-commons-node';
import { IUnreferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IOpenable } from 'pip-services4-commons-node';
import { ICleanable } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { ConnectionException } from 'pip-services4-commons-node';
import { InvalidStateException } from 'pip-services4-commons-node';
import { DependencyResolver } from 'pip-services4-commons-node';
import { CompositeLogger } from 'pip-services4-components-node';
import { IMessageReceiver } from 'pip-services4-messaging-node';
import { MessageQueue } from 'pip-services4-messaging-node';
import { MessagingCapabilities } from 'pip-services4-messaging-node';
import { MessageEnvelope } from 'pip-services4-messaging-node';

import { KafkaConnection } from '../connect/KafkaConnection';

/**
 * Message queue that sends and receives messages via Kafka message broker.
 *  
 * Kafka is a popular light-weight protocol to communicate IoT devices.
 * 
 * ### Configuration parameters ###
 * 
 * - topic:                         name of Kafka topic to subscribe
 * - group_id:                      (optional) consumer group id (default: default)
 * - from_beginning:                (optional) restarts receiving messages from the beginning (default: false)
 * - read_partitions:               (optional) number of partitions to be consumed concurrently (default: 1)
 * - autocommit:                    (optional) turns on/off autocommit (default: true)
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
 *   - read_partitions:      (optional) list of partition indexes to be read (default: all)
 *   - write_partition:      (optional) write partition index (default: uses the configured built-in partitioner)
 *   - autosubscribe:        (optional) true to automatically subscribe on option (default: false)
 *   - log_level:            (optional) log level 0 - None, 1 - Error, 2 - Warn, 3 - Info, 4 - Debug (default: 1)
 *   - connect_timeout:      (optional) number of milliseconds to connect to broker (default: 1000)
 *   - max_retries:          (optional) maximum retry attempts (default: 5)
 *   - retry_timeout:        (optional) number of milliseconds to wait on each reconnection attempt (default: 30000)
 *   - request_timeout:      (optional) number of milliseconds to wait on flushing messages (default: 30000)
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connections
 * - <code>\*:credential-store:\*:\*:1.0</code>   (optional) Credential stores to resolve credentials
 * - <code>\*:connection:kafka:\*:1.0</code>       (optional) Shared connection to Kafka service
 * 
 * @see [[MessageQueue]]
 * @see [[MessagingCapabilities]]
 * 
 * ### Example ###
 * 
 *     let queue = new KafkaMessageQueue("myqueue");
 *     queue.configure(ConfigParams.fromTuples(
 *       "topic", "mytopic",
 *       "connection.protocol", "tcp"
 *       "connection.host", "localhost"
 *       "connection.port", 9092
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
export class KafkaMessageQueue extends MessageQueue
    implements IReferenceable, IUnreferenceable, IConfigurable, IOpenable, ICleanable {

    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        "topic", null,
        "group_id", "default",
        "from_beginning", false,
        "read_partitions", 1,
        "autocommit", true,
        "options.autosubscribe", false,
        "options.acks", -1,
        "options.log_level", 1,
        "options.connect_timeout", 1000,
        "options.retry_timeout", 30000,
        "options.max_retries", 5,
        "options.request_timeout", 30000,
        "options.listen_connection", false,
    );

    private _config: ConfigParams;
    private _references: IReferences;
    private _opened: boolean;
    private _localConnection: boolean;

    /**
     * The dependency resolver.
     */
    protected _dependencyResolver: DependencyResolver = new DependencyResolver(KafkaMessageQueue._defaultConfig);
    /** 
     * The logger.
     */
    protected _logger: CompositeLogger = new CompositeLogger();
    
    /**
     * The Kafka connection component.
     */
    protected _connection: KafkaConnection;

    protected _topic: string;
    protected _groupId: string;
    protected _fromBeginning: boolean;
    protected _autoCommit: boolean = true;
    protected _autoSubscribe: boolean;
    protected _subscribed: boolean;
    protected _messages: MessageEnvelope[] = [];
    protected _receiver: IMessageReceiver;

    protected _writePartition: number;
    protected _readablePartitions: number[];
    

    /**
     * Creates a new instance of the persistence component.
     * 
     * @param name    (optional) a queue name.
     */
    public constructor(name?: string) {
        super(name, new MessagingCapabilities(false, true, true, true, true, false, true, false, true));
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        config = config.setDefaults(KafkaMessageQueue._defaultConfig);
        this._config = config;

        this._dependencyResolver.configure(config);

        this._topic = config.getAsStringWithDefault("topic", this._topic);
        this._groupId = config.getAsStringWithDefault("group_id", this._groupId);
        this._fromBeginning = config.getAsBooleanWithDefault("from_beginning", this._fromBeginning);
        this._autoCommit = config.getAsBooleanWithDefault("autocommit", this._autoCommit);
        this._autoSubscribe = config.getAsBooleanWithDefault("options.autosubscribe", this._autoSubscribe);

        this._writePartition = config.getAsIntegerWithDefault('options.write_partition', this._writePartition);

        let partitions: any = config.getAsNullableString('options.read_partitions');
        partitions = partitions != null ? partitions.split(';') : [];
        for (let index = 0; index < partitions.length; index++)
            partitions[index] = parseInt(partitions[index]);

        this._readablePartitions = partitions.length > 0 ? partitions : this._readablePartitions;
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

    private createConnection(): KafkaConnection {
        let connection = new KafkaConnection();
        let reference = new Reference(new Descriptor("pip-services", "connection", "kafka", "*", "1.0"), connection);

        if (this._config) {
            connection.configure(this._config);
        }
        
        if (this._references) {
            connection.setReferences(this._references);
            this._references.put(reference.getLocator(), reference.getComponent())
        } else {
            this._references = References.fromTuples(reference.getLocator(), reference.getComponent());
        }

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
                context,
                "CONNECT_FAILED",
                "Kafka connection is not opened"
            );
        }

        // create topic if it does not exist
        let topics = await this._connection.readQueueNames();
        if (topics.indexOf(this.getTopic()) ==  -1 )
            await this._connection.createQueue(this.getTopic());

        // Subscribe right away
        if (this._autoSubscribe) {
            await this.subscribe(context);
        }            

        this._opened = true;        
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
                context,
                'NO_CONNECTION',
                'Kafka connection is missing'
            );
        }

        if (this._localConnection) {
            await this._connection.close(context);
        }
        
        // Unsubscribe from the topic
        if (this._subscribed) {
            let topic = this.getTopic();
            this._connection.unsubscribe(topic, this._groupId, this);
        }

        this._subscribed = false;
        this._messages = [];
        this._opened = false;
        this._receiver = null;
    }

    protected getTopic(): string {
        return this._topic != null && this._topic != "" ? this._topic : this.getName();
    }

    protected async subscribe(context: IContext): Promise<void> {
        if (this._subscribed) {
            return;
        }

        // Subscribe to the topic
        let topic = this.getTopic();
        let options = {
            fromBeginning: this._fromBeginning,
            autoCommit: this._autoCommit
        };

        await this._connection.subscribe(topic, this._groupId, options, this);

        this._subscribed = true;
    }
    
    protected fromMessage(message: MessageEnvelope): any {
        if (message == null) return null;

        let headers: any = {};
        if (message.message_type != null) {
            headers.message_type = Buffer.from(message.message_type);
        }
        if (message.trace_id != null) {
            headers.trace_id = Buffer.from(message.trace_id);
        }

        let msg = {
            key: Buffer.from(message.message_id),
            value: message.message,
            headers: headers,
            timestamp: new Date().getTime()
        };

        return msg;
    }

    protected toMessage(msg: any): MessageEnvelope {
        if (msg == null) return null;

        let messageType = this.getHeaderByKey(msg.headers, "message_type");
        let context = this.getHeaderByKey(msg.headers, "trace_id");

        let message = new MessageEnvelope(context, messageType, null);
        message.message_id = msg.key.toString();
        message.sent_time = new Date(msg.timestamp);
        message.message = msg.value;
        message.setReference(msg);

        return message;
    }

    private getHeaderByKey(headers: any, key: string): string {
        if (headers == null) return null;

        let value = headers[key];
        if (value != null) {
            return value.toString();
        }
        return null;
    }

    public async onMessage(topic: string, partition: number, msg: any): Promise<void> {
        // Skip if it came from a wrong topic
        // let expectedTopic = this.getTopic();
        // if (expectedTopic.indexOf("*") < 0 && expectedTopic != topic) {
        //     return;
        // }

        if (this._readablePartitions == null || this._readablePartitions.length == 0 || this._readablePartitions.includes(partition)) {
            // Deserialize message
            let message = this.toMessage(msg);
            if (message == null) {
                this._logger.error(null, null, "Failed to read received message");
                return;
            }

            this._counters.incrementOne("queue." + this.getName() + ".received_messages");
            this._logger.debug(message.trace_id, "Received message %s via %s", message, this.getName());

            // Send message to receiver if its set or put it into the queue
            if (this._receiver != null) {
                this.sendMessageToReceiver(this._receiver, message);
            } else {
                this._messages.push(message);
            }     
        }   
    }

    /**
	 * Clears component state.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
     public async clear(context: IContext): Promise<void> {
        this._messages = [];
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
     * @param context     (optional) transaction id to trace execution through call chain.
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
            this._logger.trace(message.trace_id, "Peeked message %s on %s", message, this.getName());
        }
    
        return message;
    }

    /**
     * Peeks multiple incoming messages from the queue without removing them.
     * If there are no messages available in the queue it returns an empty list.
     * 
     * Important: This method is not supported by MQTT.
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param messageCount      a maximum number of messages to peek.
     * @returns a list with peeked messages.
     */
     public async peekBatch(context: IContext, messageCount: number): Promise<MessageEnvelope[]> {
        this.checkOpen(context);

        // Subscribe to topic if needed
        await this.subscribe(context);

        // Peek a batch of messages
        let messages = this._messages.slice(0, messageCount);

        this._logger.trace(context, "Peeked %d messages on %s", messages.length, this.getName());
    
        return messages;
    }

    /**
     * Receives an incoming message and removes it from the queue.
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param waitTimeout       a timeout in milliseconds to wait for a message to come.
     * @returns a received message.
     */
    public async receive(context: IContext, waitTimeout: number): Promise<MessageEnvelope> {
        this.checkOpen(context);

        // Subscribe to topic if needed
        await this.subscribe(context);

        let message: MessageEnvelope = null;

        // Return message immediately if it exist
        if (this._messages.length > 0) {
            message = this._messages.shift();
            return message;
        }

        // Otherwise wait and return
        let checkInterval = 100;
        let elapsedTime = 0;
        while (true) {
            let test = this.isOpen() && elapsedTime < waitTimeout && message == null;
            if (!test) break;
            
            message = await new Promise<MessageEnvelope>((resolve, reject) => {
                setTimeout(() => {
                    let message = this._messages.shift();
                    resolve(message);
                }, checkInterval);
            });

            elapsedTime += checkInterval;
        }

        return message;
    }

    /**
     * Sends a message into the queue.
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param message           a message envelop to be sent.
     */
    public async send(context: IContext, message: MessageEnvelope): Promise<void> {
        this.checkOpen(context);

        this._counters.incrementOne("queue." + this.getName() + ".sent_messages");
        this._logger.debug(message.trace_id, "Sent message %s via %s", message.toString(), this.toString());

        let msg = this.fromMessage(message);
        let topic = this.getName() || this._topic;

        msg.partition = this._writePartition;
        await this._connection.publish(topic, [msg]);
    }

    /**
     * Renews a lock on a message that makes it invisible from other receivers in the queue.
     * This method is usually used to extend the message processing time.
     * 
     * Important: This method is not supported by Kafka.
     * 
     * @param message       a message to extend its lock.
     * @param lockTimeout   a locking timeout in milliseconds.
     */
     public async renewLock(message: MessageEnvelope, lockTimeout: number): Promise<void> {
        // Not supported
    }

    /**
     * Permanently removes a message from the queue.
     * This method is usually used to remove the message after successful processing.
     * 
     * Important: This method is not supported by Kafka.
     * 
     * @param message   a message to remove.
     */
    public async complete(message: MessageEnvelope): Promise<void> {
        // Check open status
        this.checkOpen(null);

        // Incomplete message shall have a reference
        let msg = message.getReference();

        // Skip on autocommit
        if (this._autoCommit || msg == null || msg.partition == null || msg.offset == null) {
            return null;
        }

        // Commit the message offset so it won't come back
        let topic = this.getTopic();
        await this._connection.commit(topic, this._groupId, msg.partition, msg.offset, this);
    }

    /**
     * Returnes message into the queue and makes it available for all subscribers to receive it again.
     * This method is usually used to return a message which could not be processed at the moment
     * to repeat the attempt. Messages that cause unrecoverable errors shall be removed permanently
     * or/and send to dead letter queue.
     * 
     * Important: This method is not supported by Kafka.
     * 
     * @param message   a message to return.
     */
    public async abandon(message: MessageEnvelope): Promise<void> {
        // Check open status
        this.checkOpen(null);

        // Incomplete message shall have a reference
        let msg = message.getReference();

        // Skip on autocommit
        if (this._autoCommit || msg == null || msg.partition == null || msg.offset == null) {
            return null;
        }

        // Seek to the message offset so it will come back
        let topic = this.getTopic();
        await this._connection.seek(topic, this._groupId, msg.partition, msg.offset, this);
    }

    /**
     * Permanently removes a message from the queue and sends it to dead letter queue.
     * 
     * Important: This method is not supported by Kafka.
     * 
     * @param message   a message to be removed.
     */
    public async moveToDeadLetter(message: MessageEnvelope): Promise<void> {
        // Not supported
    }

    private sendMessageToReceiver(receiver: IMessageReceiver, message: MessageEnvelope): void {
        let context = message != null ? message.trace_id : null;
        if (message == null || receiver == null) {
            this._logger.warn(context, "Kafka message was skipped.");
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
     * @param context     (optional) transaction id to trace execution through call chain.
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
                let message = this._messages.shift();
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
     * @param context     (optional) transaction id to trace execution through call chain.
     */
    public endListen(context: IContext): void {
        this._receiver = null;
    }   
}