/// <reference types="node" />
import { IMessageQueueConnection } from 'pip-services4-messaging-node';
import { MqttConnectionResolver } from '../connect/MqttConnectionResolver';
import { IMqttMessageListener } from './IMqttMessageListener';
import { MqttSubscription } from './MqttSubscription';
import { IReferenceable, IConfigurable, IOpenable, ConfigParams, IReferences, IContext } from 'pip-services4-components-node';
import { CompositeLogger } from 'pip-services4-observability-node';
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
export declare class MqttConnection implements IMessageQueueConnection, IReferenceable, IConfigurable, IOpenable {
    private _defaultConfig;
    /**
     * The logger.
     */
    protected _logger: CompositeLogger;
    /**
     * The connection resolver.
     */
    protected _connectionResolver: MqttConnectionResolver;
    /**
     * The configuration options.
     */
    protected _options: ConfigParams;
    /**
     * The NATS connection pool object.
     */
    protected _connection: any;
    /**
     * Topic subscriptions
     */
    protected _subscriptions: MqttSubscription[];
    protected _clientId: string;
    protected _retryConnect: boolean;
    protected _connectTimeout: number;
    protected _keepAliveTimeout: number;
    protected _reconnectTimeout: number;
    /**
     * Creates a new instance of the connection component.
     */
    constructor();
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Sets references to dependent components.
     *
     * @param references     references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen(): boolean;
    /**
     * Opens the component.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    open(context: IContext): Promise<void>;
    /**
     * Closes component and frees used resources.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    close(context: IContext): Promise<void>;
    getConnection(): any;
    /**
     * Reads a list of registered queue names.
     * If connection doesn't support this function returnes an empty list.
     * @returns a list with registered queue names.
     */
    readQueueNames(): Promise<string[]>;
    /**
     * Creates a message queue.
     * If connection doesn't support this function it exists without error.
     * @param name the name of the queue to be created.
     */
    createQueue(name: string): Promise<void>;
    /**
     * Deletes a message queue.
     * If connection doesn't support this function it exists without error.
     * @param name the name of the queue to be deleted.
     */
    deleteQueue(name: string): Promise<void>;
    /**
     * Checks if connection is open
     */
    protected checkOpen(): void;
    /**
     * Publish a message to a specified topic
     * @param topic a topic name
     * @param data a message to be published
     * @param options publishing options
     */
    publish(topic: string, data: Buffer, options: any): Promise<void>;
    /**
     * Subscribe to a topic
     * @param topic a topic name
     * @param options subscription options
     * @param listener a message listener
     */
    subscribe(topic: string, options: any, listener: IMqttMessageListener): Promise<void>;
    /**
     * Unsubscribe from a previously subscribed topic
     * @param topic a topic name
     * @param listener a message listener
     */
    unsubscribe(topic: string, listener: IMqttMessageListener): Promise<void>;
}
