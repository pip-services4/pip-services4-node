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
exports.MqttConnection = void 0;
/** @module queues */
/** @hidden */
const mqtt = require("mqtt");
/** @hidden */
const os = require("os");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_commons_node_2 = require("pip-services4-commons-node");
const MqttConnectionResolver_1 = require("../connect/MqttConnectionResolver");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
/**
 * Connection to MQTT message broker.
 *
 * MQTT is a popular light-weight protocol to communicate IoT devices.
 *
 * ### Configuration parameters ###
 *
 * - client_id:               (optional) name of the client id
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
 *
 * @see [[MessageQueue]]
 * @see [[MessagingCapabilities]]
 */
class MqttConnection {
    /**
     * Creates a new instance of the connection component.
     */
    constructor() {
        this._defaultConfig = pip_services4_components_node_1.ConfigParams.fromTuples(
        // connections.*
        // credential.*
        "client_id", null, "options.retry_connect", true, "options.connect_timeout", 30000, "options.reconnect_timeout", 1000, "options.keepalive_timeout", 60000);
        /**
         * The logger.
         */
        this._logger = new pip_services4_observability_node_1.CompositeLogger();
        /**
         * The connection resolver.
         */
        this._connectionResolver = new MqttConnectionResolver_1.MqttConnectionResolver();
        /**
         * The configuration options.
         */
        this._options = new pip_services4_components_node_1.ConfigParams();
        /**
         * Topic subscriptions
         */
        this._subscriptions = [];
        this._clientId = os.hostname();
        this._retryConnect = true;
        this._connectTimeout = 30000;
        this._keepAliveTimeout = 60000;
        this._reconnectTimeout = 1000;
        //
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        config = config.setDefaults(this._defaultConfig);
        this._connectionResolver.configure(config);
        this._options = this._options.override(config.getSection("options"));
        this._clientId = config.getAsStringWithDefault("client_id", this._clientId);
        this._retryConnect = config.getAsBooleanWithDefault("options.retry_connect", this._retryConnect);
        this._connectTimeout = config.getAsIntegerWithDefault("options.max_reconnect", this._connectTimeout);
        this._reconnectTimeout = config.getAsIntegerWithDefault("options.reconnect_timeout", this._reconnectTimeout);
        this._keepAliveTimeout = config.getAsIntegerWithDefault("options.keepalive_timeout", this._keepAliveTimeout);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references     references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
        this._connectionResolver.setReferences(references);
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._connection != null;
    }
    /**
     * Opens the component.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._connection != null) {
                return;
            }
            const options = yield this._connectionResolver.resolve(context);
            options.clientId = this._clientId;
            options.keepalive = this._keepAliveTimeout / 1000;
            options.connectTimeout = this._connectTimeout;
            options.reconnectPeriod = this._reconnectTimeout;
            options.resubscribe = this._retryConnect;
            yield new Promise((resolve, reject) => {
                const client = mqtt.connect(options.uri, options);
                client.on('message', (topic, data, packet) => {
                    for (const subscription of this._subscriptions) {
                        // Todo: Implement proper filtering by wildcards?
                        if (subscription.filter && topic != subscription.topic) {
                            continue;
                        }
                        subscription.listener.onMessage(topic, data, packet);
                    }
                });
                client.on('connect', () => {
                    this._connection = client;
                    this._logger.debug(context, "Connected to MQTT broker at " + options.uri);
                    resolve();
                });
                client.on('error', (err) => {
                    this._logger.error(context, err, "Failed to connect to MQTT broker at " + options.uri);
                    err = new pip_services4_commons_node_1.ConnectionException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, "CONNECT_FAILED", "Connection to MQTT broker failed").withCause(err);
                    reject(err);
                });
            });
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    close(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._connection == null) {
                return;
            }
            this._connection.end();
            this._connection = null;
            this._subscriptions = [];
            this._logger.debug(context, "Disconnected from MQTT broker");
        });
    }
    getConnection() {
        return this._connection;
    }
    /**
     * Reads a list of registered queue names.
     * If connection doesn't support this function returnes an empty list.
     * @returns a list with registered queue names.
     */
    readQueueNames() {
        return __awaiter(this, void 0, void 0, function* () {
            // Not supported
            return [];
        });
    }
    /**
     * Creates a message queue.
     * If connection doesn't support this function it exists without error.
     * @param name the name of the queue to be created.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createQueue(name) {
        return __awaiter(this, void 0, void 0, function* () {
            // Not supported
        });
    }
    /**
     * Deletes a message queue.
     * If connection doesn't support this function it exists without error.
     * @param name the name of the queue to be deleted.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteQueue(name) {
        return __awaiter(this, void 0, void 0, function* () {
            // Not supported
        });
    }
    /**
     * Checks if connection is open
     */
    checkOpen() {
        if (this.isOpen())
            return;
        throw new pip_services4_commons_node_2.InvalidStateException(null, "NOT_OPEN", "Connection was not opened");
    }
    /**
     * Publish a message to a specified topic
     * @param topic a topic name
     * @param data a message to be published
     * @param options publishing options
     */
    publish(topic, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for open connection
            this.checkOpen();
            yield new Promise((resolve, reject) => {
                this._connection.publish(topic, data, options, (err) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }
    /**
     * Subscribe to a topic
     * @param topic a topic name
     * @param options subscription options
     * @param listener a message listener
     */
    subscribe(topic, options, listener) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for open connection
            this.checkOpen();
            // Subscribe to topic
            yield new Promise((resolve, reject) => {
                this._connection.subscribe(topic, options, (err) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
            // Determine if messages shall be filtered (topic without wildcarts)
            const filter = topic.indexOf("*") < 0;
            // Add the subscription
            const subscription = {
                topic: topic,
                options: options,
                filter: filter,
                listener: listener
            };
            this._subscriptions.push(subscription);
        });
    }
    /**
     * Unsubscribe from a previously subscribed topic
     * @param topic a topic name
     * @param listener a message listener
     */
    unsubscribe(topic, listener) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the subscription index
            let index = this._subscriptions.findIndex((s) => s.topic == topic && s.listener == listener);
            if (index < 0) {
                return;
            }
            // Remove the subscription
            this._subscriptions.splice(index, 1);
            // Check if there other subscriptions to the same topic
            index = this._subscriptions.findIndex((s) => s.topic == topic);
            // Unsubscribe from topic if connection is still open
            if (this._connection != null && index < 0) {
                yield new Promise((resolve, reject) => {
                    this._connection.unsubscribe(topic, (err) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                });
            }
        });
    }
}
exports.MqttConnection = MqttConnection;
//# sourceMappingURL=MqttConnection.js.map