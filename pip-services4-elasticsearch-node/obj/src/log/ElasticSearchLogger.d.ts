import { IReferenceable, IOpenable, ConfigParams, IReferences, IContext } from 'pip-services4-components-node';
import { CachedLogger, LogMessage } from 'pip-services4-observability-node';
/**
 * Logger that dumps execution logs to ElasticSearch controller.
 *
 * ElasticSearch is a popular search index. It is often used
 * to store and index execution logs by itself or as a part of
 * ELK (ElasticSearch - Logstash - Kibana) stack.
 *
 * Authentication is not supported in this version.
 *
 * ### Configuration parameters ###
 *
 * - level:             maximum log level to capture
 * - source:            source (context) name
 * - connection(s):
 *     - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *     - protocol:              connection protocol: http or https
 *     - host:                  host name or IP address
 *     - port:                  port number
 *     - uri:                   resource URI or connection string with all parameters in it
 * - options:
 *     - interval:          interval in milliseconds to save log messages (default: 10 seconds)
 *     - max_cache_size:    maximum number of messages stored in this cache (default: 100)
 *     - index:             ElasticSearch index name (default: "log")
 *     - date_format        The date format to use when creating the index name. Eg. log-YYYYMMDD (default: "YYYYMMDD"). See [[https://momentjs.com/docs/#/displaying/format/ Moment.js]]
 *     - daily:             true to create a new index every day by adding date suffix to the index name (default: false)
 *     - reconnect:         reconnect timeout in milliseconds (default: 60 sec)
 *     - timeout:           invocation timeout in milliseconds (default: 30 sec)
 *     - max_retries:       maximum number of retries (default: 3)
 *     - index_message:     true to enable indexing for message object (default: false)
 *     - include_type_name: Will create using a "typed" index compatible with ElasticSearch 6.x (default: false)
 *
 * ### References ###
 *
 * - <code>\*:context-info:\*:\*:1.0</code>      (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/classes/info.contextinfo.html ContextInfo]] to detect the context id and specify counters source
 * - <code>\*:discovery:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 *
 * ### Example ###
 *
 *     let logger = new ElasticSearchLogger();
 *     logger.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 9200
 *     ));
 *
 *     await logger.open("123");
 *
 *     logger.error("123", ex, "Error occured: %s", ex.message);
 *     logger.debug("123", "Everything is OK.");
 */
export declare class ElasticSearchLogger extends CachedLogger implements IReferenceable, IOpenable {
    private _connectionResolver;
    private _timer;
    private _index;
    private _dateFormat;
    private _dailyIndex;
    private _currentIndex;
    private _reconnect;
    private _timeout;
    private _maxRetries;
    private _indexMessage;
    private _include_type_name;
    private _client;
    /**
     * Creates a new instance of the logger.
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
     * @param references 	references to locate the component dependencies.
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
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context: IContext): Promise<void>;
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    close(context: IContext): Promise<void>;
    private getCurrentIndex;
    private createIndexIfNeeded;
    /**
     * Returns the schema of the log message
     * @param include_type_name A flag that indicates whether the schema should follow the pre-ES 6.x convention
     */
    private getIndexSchema;
    /**
     * Saves log messages from the cache.
     *
     * @param messages  a list with log messages
     */
    protected save(messages: LogMessage[]): Promise<void>;
    protected getLogItem(): any;
}
