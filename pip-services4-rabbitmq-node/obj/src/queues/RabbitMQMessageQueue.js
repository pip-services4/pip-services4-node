"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQMessageQueue = void 0;
const amqplib = require("amqplib");
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const pip_services3_messaging_node_1 = require("pip-services4-messaging-node");
const pip_services3_messaging_node_2 = require("pip-services4-messaging-node");
const pip_services3_messaging_node_3 = require("pip-services4-messaging-node");
const connect_1 = require("../connect");
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
class RabbitMQMessageQueue extends pip_services3_messaging_node_1.MessageQueue {
    /**
     * Creates a new instance of the persistence component.
     *
     * @param name    (optional) a queue name.
     * @param config (optional) configuration parameters.
     */
    constructor(name, config) {
        super(name, new pip_services3_messaging_node_2.MessagingCapabilities(false, true, true, true, true, false, false, false, true));
        this.interval = 10000;
        this._queue = "";
        this._exchange = "";
        this._exchangeType = "fanout";
        this._routingKey = "";
        this._persistent = false;
        this._exclusive = false;
        this._autoCreate = false;
        this._autoDelete = false;
        this._noQueue = false;
        this._optionsResolver = new connect_1.RabbitMQConnectionResolver();
        this._listen = false;
        if (config != null)
            this.configure(config);
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        var _a;
        super.configure(config);
        this.interval = config.getAsLongWithDefault("interval", this.interval);
        this._queue = config.getAsStringWithDefault("queue", (_a = this._queue) !== null && _a !== void 0 ? _a : this._name);
        this._exchange = config.getAsStringWithDefault("exchange", this._exchange);
        this._exchangeType = config.getAsStringWithDefault("options.exchange_type", this._exchangeType);
        this._routingKey = config.getAsStringWithDefault("options.routing_key", this._routingKey);
        this._persistent = config.getAsBooleanWithDefault("options.persistent", this._persistent);
        this._exclusive = config.getAsBooleanWithDefault("options.exclusive", this._exclusive);
        this._autoCreate = config.getAsBooleanWithDefault("options.auto_create", this._autoCreate);
        this._autoDelete = config.getAsBooleanWithDefault("options.auto_delete", this._autoDelete);
        this._noQueue = config.getAsBooleanWithDefault("options.no_queue", this._noQueue);
    }
    checkOpened(context) {
        if (this._mqChanel == null)
            throw new pip_services3_commons_node_2.InvalidStateException(context, "NOT_OPENED", "The queue is not opened");
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._connection != null && this._mqChanel != null;
    }
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this._connectionResolver.resolve(context);
            let credential = yield this._credentialResolver.lookup(context);
            let options = yield this._optionsResolver.compose(context, connection, credential);
            if (this._queue == "" && this._exchange == "") {
                throw new pip_services3_commons_node_1.ConfigException(context, "NO_QUEUE", "Queue or exchange are not defined in connection parameters");
            }
            this._connection = yield amqplib.connect(options.getAsString("uri"));
            this._mqChanel = yield this._connection.createChannel();
            // Automatically create queue, exchange and binding
            if (this._autoCreate) {
                if (this._exchange != "") {
                    yield this._mqChanel.assertExchange(this._exchange, this._exchangeType, {
                        durable: this._persistent,
                        internal: false,
                        autoDelete: this._autoDelete,
                    });
                }
                if (!this._noQueue) {
                    if (this._queue == "") {
                        let res = yield this._mqChanel.assertQueue("", {
                            exclusive: true,
                            durable: this._persistent,
                            autoDelete: true
                        });
                        this._queue = res.queue;
                    }
                    else {
                        yield this._mqChanel.assertQueue(this._queue, {
                            exclusive: this._exclusive,
                            durable: this._persistent,
                            autoDelete: this._autoDelete
                        });
                    }
                    if (this._routingKey == '')
                        this._routingKey = this._queue;
                    yield this._mqChanel.bindQueue(this._queue, this._routingKey, this._exchange);
                }
            }
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    close(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._mqChanel != null) {
                yield this._mqChanel.close();
            }
            if (this._connection != null) {
                yield this._connection.close();
            }
            this._mqChanel = null;
            this._connection = null;
            this._logger.trace(context, "Closed queue %s", this._queue);
        });
    }
    /**
     * Reads the current number of messages in the queue to be delivered.
     *
     * @returns number of available messages.
     */
    readMessageCount() {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkOpened("");
            if (this._queue == "") {
                return 0;
            }
            let queueInfo = yield this._mqChanel.checkQueue(this._queue);
            return queueInfo.messageCount;
        });
    }
    toMessage(msg) {
        if (msg == null)
            return null;
        let message = new pip_services3_messaging_node_3.MessageEnvelope(msg.properties.context, msg.properties.type, msg.content.toString());
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
    send(context, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkOpen(context);
            let options = {
                contentType: "text/plain"
            };
            this._mqChanel.publish;
            if (message.trace_id)
                options.context = message.trace_id;
            if (message.message_id)
                options.messageId = message.message_id;
            if (message.message_type)
                options.type = message.message_type;
            let buf = message.message;
            let ok = this._mqChanel.publish(this._exchange, this._routingKey, buf, options);
            if (ok) {
                this._counters.incrementOne("queue." + this._name + ".sent_messages");
                this._logger.debug(message.trace_id, "Sent message %s via %s", message, this._name);
            }
            else {
                this._logger.debug(message.trace_id, "Message %s was not sent to %s", message, this._name);
            }
        });
    }
    /**
     * Peeks a single incoming message from the queue without removing it.
     * If there are no messages available in the queue it returns null.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @returns a peeked message.
     */
    peek(context) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkOpen(context);
            let envelope = yield this._mqChanel.get(this._queue, { noAck: false });
            if (!envelope)
                return null;
            let message = this.toMessage(envelope);
            if (message != null) {
                this._logger.trace(message.trace_id, "Peeked message %s on %s", message, this._name);
            }
            return message;
        });
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
    peekBatch(context, messageCount) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkOpen(context);
            let messages = [];
            for (; messageCount > 0;) {
                let envelope = yield this._mqChanel.get(this._queue, { noAck: false });
                if (!envelope)
                    break;
                let message = this.toMessage(envelope);
                messages.push(message);
                messageCount--;
            }
            this._logger.trace(context, "Peeked %s messages on %s", messages.length, this._name);
            return messages;
        });
    }
    /**
     * Receives an incoming message and removes it from the queue.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param waitTimeout       a timeout in milliseconds to wait for a message to come.
     * @returns a received message.
     */
    receive(context, waitTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkOpen(context);
            let message;
            let timeout = waitTimeout;
            while (true) {
                if (timeout <= 0)
                    break;
                // Read the message and exit if received
                let env = yield this._mqChanel.get(this._queue, { noAck: false });
                if (env) {
                    message = this.toMessage(env);
                    break;
                }
                timeout = timeout - this.interval;
            }
            if (message != null) {
                this._counters.incrementOne("queue." + this._name + ".received_messages");
                this._logger.debug(message.trace_id, "Received message %s via %s", message, this._name);
            }
            return message;
        });
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
    renewLock(message, lockTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            // Not supported
        });
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
    abandon(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkOpened("");
            // Make the message immediately visible
            let envelope = message.getReference();
            if (envelope != null) {
                this._mqChanel.nack(envelope, false, true);
                message.setReference(null);
                this._logger.trace(message.trace_id, "Abandoned message %s at %c", message, this._name);
            }
        });
    }
    /**
     * Permanently removes a message from the queue.
     * This method is usually used to remove the message after successful processing.
     *
     * Important: This method is not supported by RabbitMQ.
     *
     * @param message   a message to remove.
     */
    complete(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkOpened("");
            // Make the message immediately visible
            let envelope = message.getReference();
            if (envelope != null) {
                this._mqChanel.ack(envelope, false);
                message.setReference(null);
                this._logger.trace(message.trace_id, "Completed message %s at %s", message, this._name);
            }
        });
    }
    /**
     * Permanently removes a message from the queue and sends it to dead letter queue.
     *
     * Important: This method is not supported by RabbitMQ.
     *
     * @param message   a message to be removed.
     */
    moveToDeadLetter(message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Not supported
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
    listen(context, receiver) {
        this.checkOpen(context);
        this._logger.debug(context, "Started listening messages at %s", this._name);
        let options = {
            noLocal: false,
            noAck: false,
            exclusive: false
        };
        this._listen = true;
        this._mqChanel.consume(this._queue, (msg) => __awaiter(this, void 0, void 0, function* () {
            if (!this._listen) {
                yield this._mqChanel.cancel(msg.fields.consumerTag);
            }
            else {
                if (msg != null) {
                    let message = this.toMessage(msg);
                    this._counters.incrementOne("queue." + this._name + ".received_messages");
                    this._logger.debug(message.trace_id, "Received message %s via %s", message, this._name);
                    yield receiver.receiveMessage(message, this);
                    this._mqChanel.ack(msg, false);
                }
            }
        }), options);
    }
    /**
     * Ends listening for incoming messages.
     * When this method is call [[listen]] unblocks the thread and execution continues.
     *
     * @param context     (optional) a context to trace execution through call chain.
     */
    endListen(context) {
        this._listen = false;
    }
    /**
     * Clear method are clears component state.
     * @param context (optional) transaction id to trace execution through call chain.
     */
    clear(context) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkOpened(context);
            let count = 0;
            if (this._queue != "") {
                let res = yield this._mqChanel.purgeQueue(this._queue);
                count = res.messageCount;
            }
            this._logger.trace(context, "Cleared  %s messages in queue %s", count, this._name);
        });
    }
}
exports.RabbitMQMessageQueue = RabbitMQMessageQueue;
//# sourceMappingURL=RabbitMQMessageQueue.js.map