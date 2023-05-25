/** @module queues */
/** @hidden */
const mqtt = require('mqtt');
/** @hidden */
const os = require('os');

import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IOpenable } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { CompositeLogger } from 'pip-services4-components-node';
import { IMessageQueueConnection } from 'pip-services4-messaging-node';
import { ConnectionException } from 'pip-services4-commons-node';
import { InvalidStateException } from 'pip-services4-commons-node';

import { MqttConnectionResolver } from '../connect/MqttConnectionResolver';
import { IMqttMessageListener } from './IMqttMessageListener';
import { MqttSubscription } from './MqttSubscription';

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
export class MqttConnection implements IMessageQueueConnection, IReferenceable, IConfigurable, IOpenable {

    private _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        // connections.*
        // credential.*

        "client_id", null,
        "options.retry_connect", true,
        "options.connect_timeout", 30000,
        "options.reconnect_timeout", 1000,
        "options.keepalive_timeout", 60000
    );

    /** 
     * The logger.
     */
    protected _logger: CompositeLogger = new CompositeLogger();
    /**
     * The connection resolver.
     */
    protected _connectionResolver: MqttConnectionResolver = new MqttConnectionResolver();
    /**
     * The configuration options.
     */
    protected _options: ConfigParams = new ConfigParams();

    /**
     * The NATS connection pool object.
     */
    protected _connection: any;

    /**
     * Topic subscriptions
     */
    protected _subscriptions: MqttSubscription[] = [];

    protected _clientId: string = os.hostname();
    protected _retryConnect: boolean = true;
    protected _connectTimeout: number = 30000;
    protected _keepAliveTimeout: number = 60000;
    protected _reconnectTimeout: number = 1000;

    /**
     * Creates a new instance of the connection component.
     */
    public constructor() {}

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
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
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._connectionResolver.setReferences(references);
    }

    /**
	 * Checks if the component is opened.
	 * 
	 * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._connection != null;
    }

    /**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        if (this._connection != null) {
            return;
        }

        let options = await this._connectionResolver.resolve(context);

        options.clientId = this._clientId;
        options.keepalive = this._keepAliveTimeout / 1000;
        options.connectTimeout = this._connectTimeout;
        options.reconnectPeriod = this._reconnectTimeout;
        options.resubscribe = this._retryConnect;

        await new Promise<void>((resolve, reject) => {
            let client = mqtt.connect(options.uri, options);

            client.on('message', (topic, data, packet) => {
                for (let subscription of this._subscriptions) {
                    // Todo: Implement proper filtering by wildcards?
                    if (subscription.filter && topic != subscription.topic) {
                        continue;
                    }
    
                    subscription.listener.onMessage(topic, data, packet);
                }
            });
    
            client.on('connect', () => {
                this._connection = client;
                this._logger.debug(context, "Connected to MQTT broker at "+options.uri);

                resolve();
            });
            
            client.on('error', (err) => {
                this._logger.error(context, err, "Failed to connect to MQTT broker at "+options.uri);
                err = new ConnectionException(context, "CONNECT_FAILED", "Connection to MQTT broker failed").withCause(err);
                reject(err);
            });
        });
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async close(context: IContext): Promise<void> {
        if (this._connection == null) {
            return;
        }

        this._connection.end();
        this._connection = null;
        this._subscriptions = [];
        this._logger.debug(context, "Disconnected from MQTT broker");
    }

    public getConnection(): any {
        return this._connection;
    }

    /**
     * Reads a list of registered queue names.
     * If connection doesn't support this function returnes an empty list.
     * @returns a list with registered queue names.
     */
    public async readQueueNames(): Promise<string[]> {
        // Not supported
        return [];
    }

    /**
     * Creates a message queue.
     * If connection doesn't support this function it exists without error.
     * @param name the name of the queue to be created.
     */
    public async createQueue(name: string): Promise<void> {
        // Not supported
    }

     /**
      * Deletes a message queue.
      * If connection doesn't support this function it exists without error.
      * @param name the name of the queue to be deleted.
      */
    public async deleteQueue(name: string): Promise<void> {
        // Not supported
    }

    /**
     * Checks if connection is open
     */
    protected checkOpen(): void {
        if (this.isOpen()) return;

        throw new InvalidStateException(
            null,
            "NOT_OPEN",
            "Connection was not opened"
        );
    }

    /**
     * Publish a message to a specified topic
     * @param topic a topic name
     * @param data a message to be published
     * @param options publishing options
     */
    public async publish(topic: string, data: Buffer, options: any): Promise<void> {
        // Check for open connection
        this.checkOpen();

        await new Promise<void>((resolve, reject) => {
            this._connection.publish(topic, data, options, (err) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    /**
     * Subscribe to a topic
     * @param topic a topic name
     * @param options subscription options
     * @param listener a message listener
     */
    public async subscribe(topic: string, options: any, listener: IMqttMessageListener): Promise<void> {
        // Check for open connection
        this.checkOpen();

        // Subscribe to topic
        await new Promise<void>((resolve, reject) => {
            this._connection.subscribe(topic, options, (err) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });

        // Determine if messages shall be filtered (topic without wildcarts)
        let filter = topic.indexOf("*") < 0;

        // Add the subscription
        let subscription = <MqttSubscription>{
            topic: topic,
            options: options,
            filter: filter,
            listener: listener
        };
        this._subscriptions.push(subscription);
    }

    /**
     * Unsubscribe from a previously subscribed topic
     * @param topic a topic name
     * @param listener a message listener
     */
    public async unsubscribe(topic: string, listener: IMqttMessageListener): Promise<void> {
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
            await new Promise<void>((resolve, reject) => {
                this._connection.unsubscribe(topic, (err) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        }
    }
}