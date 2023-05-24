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
exports.MqttMessageQueue = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const pip_services3_commons_node_3 = require("pip-services4-commons-node");
const pip_services3_commons_node_4 = require("pip-services4-commons-node");
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_messaging_node_1 = require("pip-services4-messaging-node");
const pip_services3_messaging_node_2 = require("pip-services4-messaging-node");
const pip_services3_messaging_node_3 = require("pip-services4-messaging-node");
const MqttConnection_1 = require("../connect/MqttConnection");
/**
 * Message queue that sends and receives messages via MQTT message broker.
 *
 * MQTT is a popular light-weight protocol to communicate IoT devices.
 *
 * ### Configuration parameters ###
 *
 * - topic:                         name of MQTT topic to subscribe
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
 *   - serialize_envelope:    (optional) true to serialize entire message as JSON, false to send only message payload (default: true)
 *   - autosubscribe:        (optional) true to automatically subscribe on option (default: false)
 *   - qos:                  (optional) quality of service level aka QOS (default: 0)
 *   - retain:               (optional) retention flag for published messages (default: false)
 *   - retry_connect:        (optional) turns on/off automated reconnect when connection is log (default: true)
 *   - connect_timeout:      (optional) number of milliseconds to wait for connection (default: 30000)
 *   - reconnect_timeout:    (optional) number of milliseconds to wait on each reconnection attempt (default: 1000)
 *   - keepalive_timeout:    (optional) number of milliseconds to ping broker while inactive (default: 3000)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connections
 * - <code>\*:credential-store:\*:\*:1.0</code>   (optional) Credential stores to resolve credentials
 * - <code>\*:connection:mqtt:\*:1.0</code>       (optional) Shared connection to MQTT service
 *
 * @see [[MessageQueue]]
 * @see [[MessagingCapabilities]]
 *
 * ### Example ###
 *
 *     let queue = new MqttMessageQueue("myqueue");
 *     queue.configure(ConfigParams.fromTuples(
 *       "topic", "mytopic",
 *       "connection.protocol", "mqtt"
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
class MqttMessageQueue extends pip_services3_messaging_node_1.MessageQueue {
    /**
     * Creates a new instance of the persistence component.
     *
     * @param name    (optional) a queue name.
     */
    constructor(name) {
        super(name, new pip_services3_messaging_node_2.MessagingCapabilities(false, true, true, true, true, false, false, false, true));
        /**
         * The dependency resolver.
         */
        this._dependencyResolver = new pip_services3_commons_node_4.DependencyResolver(MqttMessageQueue._defaultConfig);
        /**
         * The logger.
         */
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._messages = [];
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        config = config.setDefaults(MqttMessageQueue._defaultConfig);
        this._config = config;
        this._dependencyResolver.configure(config);
        this._topic = config.getAsStringWithDefault("topic", this._topic);
        this._autoSubscribe = config.getAsBooleanWithDefault("options.autosubscribe", this._autoSubscribe);
        this._serializeEnvelope = config.getAsBooleanWithDefault("options.serialize_envelope", this._serializeEnvelope);
        this._qos = config.getAsIntegerWithDefault("options.qos", this._qos);
        this._retain = config.getAsBooleanWithDefault("options.retain", this._retain);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._references = references;
        this._logger.setReferences(references);
        // Get connection
        this._dependencyResolver.setReferences(references);
        this._connection = this._dependencyResolver.getOneOptional('connection');
        // Or create a local one
        if (this._connection == null) {
            this._connection = this.createConnection();
            this._localConnection = true;
        }
        else {
            this._localConnection = false;
        }
    }
    /**
     * Unsets (clears) previously set references to dependent components.
     */
    unsetReferences() {
        this._connection = null;
    }
    createConnection() {
        let connection = new MqttConnection_1.MqttConnection();
        if (this._config) {
            connection.configure(this._config);
        }
        if (this._references) {
            connection.setReferences(this._references);
        }
        return connection;
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._opened;
    }
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    open(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._opened) {
                return;
            }
            if (this._connection == null) {
                this._connection = this.createConnection();
                this._localConnection = true;
            }
            if (this._localConnection != null) {
                yield this._connection.open(correlationId);
            }
            if (!this._connection.isOpen()) {
                throw new pip_services3_commons_node_2.ConnectionException(correlationId, "CONNECT_FAILED", "MQTT connection is not opened");
            }
            // Subscribe right away
            if (this._autoSubscribe) {
                yield this.subscribe(correlationId);
            }
            this._opened = true;
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    close(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._opened) {
                return;
            }
            if (this._connection == null) {
                throw new pip_services3_commons_node_3.InvalidStateException(correlationId, 'NO_CONNECTION', 'MQTT connection is missing');
            }
            if (this._localConnection) {
                yield this._connection.close(correlationId);
            }
            if (this._subscribed) {
                // Unsubscribe from the topic
                let topic = this.getTopic();
                this._connection.unsubscribe(topic, this);
            }
            this._messages = [];
            this._opened = false;
            this._receiver = null;
        });
    }
    getTopic() {
        return this._topic != null && this._topic != "" ? this._topic : this.getName();
    }
    subscribe(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._subscribed) {
                return;
            }
            // Subscribe right away
            let topic = this.getTopic();
            yield this._connection.subscribe(topic, { qos: this._qos }, this);
        });
    }
    fromMessage(message) {
        if (message == null)
            return null;
        let data = message.message;
        if (this._serializeEnvelope) {
            message.sent_time = new Date();
            let json = JSON.stringify(message);
            data = Buffer.from(json, 'utf-8');
        }
        return {
            topic: this.getName() || this._topic,
            data: data
        };
    }
    toMessage(topic, data, packet) {
        if (data == null)
            return null;
        let message;
        if (this._serializeEnvelope) {
            let json = Buffer.from(data).toString('utf-8');
            message = pip_services3_messaging_node_3.MessageEnvelope.fromJSON(json);
        }
        else {
            message = new pip_services3_messaging_node_3.MessageEnvelope(null, topic, data);
            message.message_id = packet.messageId;
            // message.message_type = topic;
            // message.message = Buffer.from(data);
        }
        return message;
    }
    onMessage(topic, data, packet) {
        // Skip if it came from a wrong topic
        let expectedTopic = this.getTopic();
        if (expectedTopic.indexOf("*") < 0 && expectedTopic != topic) {
            return;
        }
        // Deserialize message
        let message = this.toMessage(topic, data, packet);
        if (message == null) {
            this._logger.error(null, null, "Failed to read received message");
            return;
        }
        this._counters.incrementOne("queue." + this.getName() + ".received_messages");
        this._logger.debug(message.correlation_id, "Received message %s via %s", message, this.getName());
        // Send message to receiver if its set or put it into the queue
        if (this._receiver != null) {
            this.sendMessageToReceiver(this._receiver, message);
        }
        else {
            this._messages.push(message);
        }
    }
    /**
     * Clears component state.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    clear(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._messages = [];
        });
    }
    /**
     * Reads the current number of messages in the queue to be delivered.
     *
     * @returns number of available messages.
     */
    readMessageCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._messages.length;
        });
    }
    /**
     * Peeks a single incoming message from the queue without removing it.
     * If there are no messages available in the queue it returns null.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @returns a peeked message.
     */
    peek(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkOpen(correlationId);
            // Subscribe to topic if needed
            yield this.subscribe(correlationId);
            // Peek a message from the top
            let message = null;
            if (this._messages.length > 0) {
                message = this._messages[0];
            }
            if (message != null) {
                this._logger.trace(message.correlation_id, "Peeked message %s on %s", message, this.getName());
            }
            return message;
        });
    }
    /**
     * Peeks multiple incoming messages from the queue without removing them.
     * If there are no messages available in the queue it returns an empty list.
     *
     * Important: This method is not supported by MQTT.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param messageCount      a maximum number of messages to peek.
     * @returns a list with peeked messages.
     */
    peekBatch(correlationId, messageCount) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkOpen(correlationId);
            // Subscribe to topic if needed
            yield this.subscribe(correlationId);
            // Peek a batch of messages
            let messages = this._messages.slice(0, messageCount);
            this._logger.trace(correlationId, "Peeked %d messages on %s", messages.length, this.getName());
            return messages;
        });
    }
    /**
     * Receives an incoming message and removes it from the queue.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param waitTimeout       a timeout in milliseconds to wait for a message to come.
     * @returns a received message.
     */
    receive(correlationId, waitTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkOpen(correlationId);
            // Subscribe to topic if needed
            yield this.subscribe(correlationId);
            let message = null;
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
                if (!test)
                    break;
                message = yield new Promise((resolve, reject) => {
                    setTimeout(() => {
                        let message = this._messages.shift();
                        resolve(message);
                    }, checkInterval);
                });
                elapsedTime += checkInterval;
            }
            return message;
        });
    }
    /**
     * Sends a message into the queue.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param message           a message envelop to be sent.
     */
    send(correlationId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkOpen(correlationId);
            this._counters.incrementOne("queue." + this.getName() + ".sent_messages");
            this._logger.debug(message.correlation_id, "Sent message %s via %s", message.toString(), this.toString());
            let msg = this.fromMessage(message);
            let options = { qos: this._qos, retain: this._retain };
            yield this._connection.publish(msg.topic, msg.data, options);
        });
    }
    /**
     * Renews a lock on a message that makes it invisible from other receivers in the queue.
     * This method is usually used to extend the message processing time.
     *
     * Important: This method is not supported by MQTT.
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
     * Permanently removes a message from the queue.
     * This method is usually used to remove the message after successful processing.
     *
     * Important: This method is not supported by MQTT.
     *
     * @param message   a message to remove.
     */
    complete(message) {
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
     * Important: This method is not supported by MQTT.
     *
     * @param message   a message to return.
     */
    abandon(message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Not supported
        });
    }
    /**
     * Permanently removes a message from the queue and sends it to dead letter queue.
     *
     * Important: This method is not supported by MQTT.
     *
     * @param message   a message to be removed.
     */
    moveToDeadLetter(message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Not supported
        });
    }
    sendMessageToReceiver(receiver, message) {
        let correlationId = message != null ? message.correlation_id : null;
        if (message == null || receiver == null) {
            this._logger.warn(correlationId, "MQTT message was skipped.");
            return;
        }
        this._receiver.receiveMessage(message, this)
            .catch((err) => {
            this._logger.error(correlationId, err, "Failed to process the message");
        });
    }
    /**
    * Listens for incoming messages and blocks the current thread until queue is closed.
    *
    * @param correlationId     (optional) transaction id to trace execution through call chain.
    * @param receiver          a receiver to receive incoming messages.
    *
    * @see [[IMessageReceiver]]
    * @see [[receive]]
    */
    listen(correlationId, receiver) {
        this.checkOpen(correlationId);
        // Subscribe to topic if needed
        this.subscribe(correlationId)
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
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     */
    endListen(correlationId) {
        this._receiver = null;
    }
}
exports.MqttMessageQueue = MqttMessageQueue;
MqttMessageQueue._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples("topic", null, "options.serialize_envelope", false, "options.autosubscribe", false, "options.retry_connect", true, "options.connect_timeout", 30000, "options.reconnect_timeout", 1000, "options.keepalive_timeout", 60000, "options.qos", 0, "options.retain", false);
//# sourceMappingURL=MqttMessageQueue.js.map