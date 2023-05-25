/** @module connect */
/** @hidden */
const kafka = require('kafkajs');
/** @hidden */
const os = require('os');

import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IOpenable } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { ConnectionException } from 'pip-services4-commons-node';
import { InvalidStateException } from 'pip-services4-commons-node';
import { CompositeLogger } from 'pip-services4-components-node';
import { IMessageQueueConnection } from 'pip-services4-messaging-node';

import { KafkaConnectionResolver } from './KafkaConnectionResolver';
import { IKafkaMessageListener } from './IKafkaMessageListener';
import { KafkaSubscription } from './KafkaSubscription';

/**
 * Kafka connection using plain driver.
 * 
 * By defining a connection and sharing it through multiple message queues
 * you can reduce number of used database connections.
 * 
 * ### Configuration parameters ###
 * 
 * - client_id:               (optional) name of the client id
 * - connection(s):    
 *   - discovery_key:             (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - host:                      host name or IP address
 *   - port:                      port number (default: 27017)
 *   - uri:                       resource URI or connection string with all parameters in it
 * - credential(s):    
 *   - store_key:                 (optional) a key to retrieve the credentials from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/auth.icredentialstore.html ICredentialStore]]
 *   - username:                  user name
 *   - password:                  user password
 * - options:
 *   - acks                  (optional) control the number of required acks: -1 - all, 0 - none, 1 - only leader (default: -1)
 *   - num_partitions:       (optional) number of partitions of the created topic (default: 1)
 *   - replication_factor:   (optional) kafka replication factor of the topic (default: 1)
 *   - log_level:            (optional) log level 0 - None, 1 - Error, 2 - Warn, 3 - Info, 4 - Debug (default: 1)
 *   - connect_timeout:      (optional) number of milliseconds to connect to broker (default: 1000)
 *   - max_retries:          (optional) maximum retry attempts (default: 5)
 *   - retry_timeout:        (optional) number of milliseconds to wait on each reconnection attempt (default: 30000)
 *   - request_timeout:      (optional) number of milliseconds to wait on flushing messages (default: 30000)
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credentials
 * 
 */
export class KafkaConnection implements IMessageQueueConnection, IReferenceable, IConfigurable, IOpenable {

    private _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        // connections.*
        // credential.*

        "client_id", null,
        "options.log_level", 1,
        "options.connect_timeout", 1000,
        "options.retry_timeout", 30000,
        "options.max_retries", 5,
        "options.request_timeout", 30000
    );

    /** 
     * The logger.
     */
    protected _logger: CompositeLogger = new CompositeLogger();
    /**
     * The connection resolver.
     */
    protected _connectionResolver: KafkaConnectionResolver = new KafkaConnectionResolver();
    /**
     * The configuration options.
     */
    protected _options: ConfigParams = new ConfigParams();

    /**
     * The Kafka connection pool object.
     */
    protected _connection: any;
    /**
     * Kafka connection properties
     */
    protected _clientConfig: any;
    /**
     * The Kafka message producer object;
     */
    protected _producer: any;
    /**
     * The Kafka admin client object;
     */
    protected _adminClient: any;

    /**
     * Topic subscriptions
     */
    protected _subscriptions: KafkaSubscription[] = [];

    protected _clientId: string = os.hostname();
    protected _logLevel: number = 1;
    protected _acks: number = -1;
    protected _connectTimeout: number = 1000;
    protected _maxRetries: number = 5;
    protected _retryTimeout: number = 30000;
    protected _requestTimeout: number = 30000;
    protected _numPartitions: number = 1
    protected _replicationFactor: number = 1    

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
        this._logLevel = config.getAsIntegerWithDefault("options.log_level", this._logLevel);
        this._connectTimeout = config.getAsIntegerWithDefault("options.connect_timeout", this._connectTimeout);
        this._maxRetries = config.getAsIntegerWithDefault("options.max_retries", this._maxRetries);
        this._retryTimeout = config.getAsIntegerWithDefault("options.retry_timeout", this._retryTimeout);
        this._requestTimeout = config.getAsIntegerWithDefault("options.request_timeout", this._requestTimeout);
        this._acks = config.getAsIntegerWithDefault("options.acks", this._acks);
        
        this._numPartitions = config.getAsIntegerWithDefault('options.num_partitions', this._numPartitions)
        this._replicationFactor = config.getAsIntegerWithDefault('options.replication_factor',
            this._replicationFactor)
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

        let config = await this._connectionResolver.resolve(context);
        try {                
            let options: any = {
                clientId: this._clientId,
                retry: {
                    maxRetryType: this._requestTimeout,
                    retries: this._maxRetries
                },
                requestTimeout: this._requestTimeout,
                connectionTimeout: this._connectTimeout,
                logLevel: this._logLevel
            };

            let brokers = config.getAsString("brokers");
            options.brokers = brokers.split(",");

            options.ssl = config.getAsBoolean("ssl");

            let username = config.getAsString("username");
            let password = config.getAsString("password");
            let mechanism = config.getAsStringWithDefault("mechanism", "plain");
            if (username != null) {
                options.sasl = {
                    mechanism: mechanism,
                    username: username,
                    password: password,
                }
            }

            this._clientConfig = options;

            let connection = new kafka.Kafka(options);
            let producer = connection.producer();
            await producer.connect();
            this._connection = connection;
            this._producer = producer;

            this._logger.debug(context, "Connected to Kafka broker at "+brokers);
        } catch (ex) {
            this._logger.error(context, ex, "Failed to connect to Kafka server");
            throw new ConnectionException(
                context,
                "CONNECT_FAILED",
                "Connection to Kafka service failed"
            ).withCause(ex);
        }
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

        // Disconnect producer
        this._producer.disconnect();
        this._producer = null;

        // Disconnect admin client
        if (this._adminClient != null) {
            this._adminClient.disconnect();
            this._adminClient = null;
        }

        // Disconnect consumers
        for (let subscription of this._subscriptions) {
            if (subscription.handler) {
                subscription.handler.disconnect();
            }
        }
        this._subscriptions = [];

        this._connection = null;
        this._logger.debug(context, "Disconnected from Kafka server");
    }

    public getConnection(): any {
        return this._connection;
    }

    public getProducer(): any {
        return this._producer;
    }

    /**
     * Checks if connection is open
     * @returns an error is connection is closed or <code>null<code> otherwise.
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
     * Connect admin client on demand.
     */
    protected async connectToAdmin(): Promise<void> {
        this.checkOpen();

        if (this._adminClient != null) {
            return;
        }

        let adminClient = this._connection.admin();
        await adminClient.connect();
        this._adminClient = adminClient;
    }

    /**
     * Reads a list of registered queue names.
     * If connection doesn't support this function returnes an empty list.
     * @returns queue names.
     */
    public async readQueueNames(): Promise<string[]> {
        await this.connectToAdmin();
        return await this._adminClient.listTopics();
    }

    /**
     * Creates a message queue.
     * If connection doesn't support this function it exists without error.
     * @param name the name of the queue to be created.
     */
    public async createQueue(name: string): Promise<void> {
        this.checkOpen();
        this.connectToAdmin();

        await this._adminClient.createTopics({ topics: [{ 
            topic: name, 
            numPartitions: this._numPartitions, 
            replicationFactor: this._replicationFactor
        }]});
    }

    /**
     * Deletes a message queue.
     * If connection doesn't support this function it exists without error.
     * @param name the name of the queue to be deleted.
     */
    public async deleteQueue(name: string): Promise<void> {
        this.checkOpen();
        this.connectToAdmin();

        await this._adminClient.deleteTopics({
            topics: [name]
        })
    }
     
    /**
     * Publish a message to a specified topic
     * @param topic a topic where the message will be placed
     * @param messages a list of messages to be published
     * @param options publishing options
     */
     public async publish(topic: string, messages: any[]): Promise<void> {
        // Check for open connection
        this.checkOpen();

        await this._producer.send({
            topic: topic,
            messages: messages,
            acks: this._acks,
            timeout: this._connectTimeout
        });
    }

    /**
     * Subscribe to a topic
     * @param subject a subject(topic) name
     * @param groupId (optional) a consumer group id
     * @param options subscription options
     * @param listener a message listener
     */
     public async subscribe(topic: string, groupId: string, options: any, listener: IKafkaMessageListener): Promise<void> {
        // Check for open connection
        this.checkOpen();
        
        options = options || {};

        // Subscribe to topic
        let consumer = this._connection.consumer({
            groupId: groupId || "default",
            sessionTimeout: options.sessionTimeout,
            heartbeatInterval: options.heartbeatInterval,
            rebalanceTimeout: options.rebalanceTimeout,
            allowAutoTopicCreation: true
        });

        try {
            await consumer.connect();

            await consumer.subscribe({ 
                topic: topic,
                fromBeginning: options.fromBeginning,
            });

            await consumer.run({
                partitionsConsumedConcurrently: options.partitionsConsumedConcurrently,
                autoCommit: options.autoCommit,
                autoCommitInterval: options.autoCommitInterval,
                autoCommitThreshold: options.autoCommitThreshold,
                eachMessage: async ({ topic, partition, message }) => { 
                    listener.onMessage(topic, partition, message);
                }
            });

            // Add the subscription
            let subscription = <KafkaSubscription>{
                topic: topic,
                groupId: groupId,
                options: options,
                handler: consumer,
                listener: listener
            };
            this._subscriptions.push(subscription);

            // listen consumer crashes
            const { CRASH } = consumer.events;
            // const { REQUEST_TIMEOUT } = consumer.events;

            consumer.on(CRASH, async (event) => {
                await restartConsumer(event);
            })

            // consumer.on(REQUEST_TIMEOUT, async (event) => {
            //     await restartConsumer(event);
            // })

            let isReady = true;
            const restartConsumer = async (event) => {
                new Promise(async resolve => {
                    while (true) {
                        if (!isReady) continue;
                        isReady = false;

                        let err = event != null && event.payload != null ? event.payload.error : new Error("Consummer disconnected");
                        this._logger.error(null, err, "Consummer crashed, try restart");

                        try {
                            // try reopen connection
                            this._logger.trace(null, "Connection crashed");
                            await this.close(null);
                            await this.open(null);

                            this._logger.trace(null, "Try restart consummer");
                            // restart consumer
                            await consumer.connect();
                            await consumer.subscribe({
                                topic: topic,
                                fromBeginning: options.fromBeginning,
                            });
                            await consumer.run({
                                maxBytes: 3145728, // 3MB
                                partitionsConsumedConcurrently: options.partitionsConsumedConcurrently,
                                autoCommit: options.autoCommit,
                                autoCommitInterval: options.autoCommitInterval,
                                autoCommitThreshold: options.autoCommitThreshold,
                                eachMessage: async ({ topic, partition, message }) => {
                                    listener.onMessage(topic, partition, message);
                                }
                            });

                            this._logger.trace(null, "Consummer restarted");
                            break;
                        }
                        catch {
                            // do nothing...
                        } finally {
                            isReady = true;
                        }
                    }
                });
            }
        } catch(ex) {
            this._logger.error(null, ex, "Failed to connect Kafka consumer.");
            throw ex;
        }
    }

    /**
     * Unsubscribe from a previously subscribed topic
     * @param topic a topic name
     * @param groupId (optional) a consumer group id
     * @param listener a message listener
     */
    public async unsubscribe(topic: string, groupId: string, listener: IKafkaMessageListener): Promise<void> {
        // Find the subscription index
        let index = this._subscriptions.findIndex((s) => s.topic == topic && s.groupId == groupId && s.listener == listener);
        if (index < 0) {
            return;
        }
        
        // Remove the subscription
        let subscription = this._subscriptions.splice(index, 1)[0];

        // Unsubscribe from the topic
        if (this.isOpen() && subscription.handler != null) {
            await subscription.handler.disconnect();
        }
    }    

    /**
     * Commit a message offset.
     * @param topic a topic name
     * @param groupId (optional) a consumer group id
     * @param partition a partition number
     * @param offset a message offset
     * @param listener a message listener
     */
     public async commit(topic: string, groupId: string, partition: number, offset: number, listener: IKafkaMessageListener): Promise<void> {
        // Check for open connection
        this.checkOpen();

        // Find the subscription index
        let subscription = this._subscriptions.find((s) => s.topic == topic && s.groupId == groupId && s.listener == listener);
        if (subscription == null || subscription.options.autoCommit) {
            return;
        }
        
        // Commit the offset
        await subscription.handler.commitOffsets([
            { topic: topic, partition: partition, offset: offset }
        ]);
    }        

    /**
     * Seek a message offset.
     * @param topic a topic name
     * @param groupId (optional) a consumer group id
     * @param partition a partition number
     * @param offset a message offset
     * @param listener a message listener
     */
     public async seek(topic: string, groupId: string, partition: number, offset: number, listener: IKafkaMessageListener): Promise<void> {
        // Check for open connection
        this.checkOpen();

        // Find the subscription index
        let subscription = this._subscriptions.find((s) => s.topic == topic && s.groupId == groupId && s.listener == listener);
        if (subscription == null || subscription.options.autoCommit) {
            return;
        }
        
        // Seek the offset
        await subscription.handler.seek([
            { topic: topic, partition: partition, offset: offset }
        ]);
    }          
}