/** @module log */
import * as moment from 'moment';

import { IReferenceable, IOpenable, ConfigParams, IReferences, IContext, Context, ContextResolver } from 'pip-services4-components-node';
import { CachedLogger, LogMessage } from 'pip-services4-observability-node';
import { IdGenerator } from 'pip-services4-data-node';
import { HttpConnectionResolver } from 'pip-services4-config-node';
import { ConfigException } from 'pip-services4-commons-node';


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
export class ElasticSearchLogger extends CachedLogger implements IReferenceable, IOpenable {
    private _connectionResolver: HttpConnectionResolver = new HttpConnectionResolver();

    private _timer: any;
    private _index = "log";
    private _dateFormat = "YYYYMMDD";
    private _dailyIndex = false;
    private _currentIndex: string;
    private _reconnect = 60000;
    private _timeout = 30000;
    private _maxRetries = 3;
    private _indexMessage = false;
    private _include_type_name = false;
    private _client: any = null;

    /**
     * Creates a new instance of the logger.
     */
    public constructor() {
        super();
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        super.configure(config);

        this._connectionResolver.configure(config);

        this._index = config.getAsStringWithDefault('index', this._index);
        this._dateFormat = config.getAsStringWithDefault("date_format", this._dateFormat);
        this._dailyIndex = config.getAsBooleanWithDefault('daily', this._dailyIndex);
        this._reconnect = config.getAsIntegerWithDefault('options.reconnect', this._reconnect);
        this._timeout = config.getAsIntegerWithDefault('options.timeout', this._timeout);
        this._maxRetries = config.getAsIntegerWithDefault('options.max_retries', this._maxRetries);
        this._indexMessage = config.getAsBooleanWithDefault('options.index_message', this._indexMessage);
        this._include_type_name = config.getAsBooleanWithDefault('options.include_type_name', this._include_type_name);
    }

    /**
     * Sets references to dependent components.
     * 
     * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._connectionResolver.setReferences(references);
    }

    /**
     * Checks if the component is opened.
     * 
     * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._timer != null;
    }

    /**
     * Opens the component.
     * 
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        if (this.isOpen()) {
            return;
        }

        const connection = await this._connectionResolver.resolve(context);
        if (connection == null) {
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                'NO_CONNECTION',
                'Connection is not configured'
            );
        }

        const uri = connection.getAsString("uri");

        const options = {
            host: uri,
            requestTimeout: this._timeout,
            deadTimeout: this._reconnect,
            maxRetries: this._maxRetries
        };

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const elasticsearch = require('elasticsearch');
        this._client = new elasticsearch.Client(options);

        await this.createIndexIfNeeded(context, true);

        this._timer = setInterval(() => { this.dump() }, this._interval);
    }

    /**
     * Closes component and frees used resources.
     * 
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async close(context: IContext): Promise<void> {
        await this.save(this._cache);

        if (this._timer) {
            clearInterval(this._timer);
        }

        this._cache = [];
        this._timer = null;
        this._client = null;
    }

    private getCurrentIndex(): string {
        if (!this._dailyIndex) return this._index;

        const today = new Date().toUTCString();
        const datePattern = moment(today).format(this._dateFormat);

        return this._index + "-" + datePattern;
    }

    private async createIndexIfNeeded(context: IContext, force: boolean): Promise<void> {
        const newIndex = this.getCurrentIndex();
        if (!force && this._currentIndex == newIndex) {
            return;
        }

        this._currentIndex = newIndex;

        const exists = new Promise<boolean>((resolve, reject) => {
            this._client.indices.exists(
                { index: this._currentIndex },
                (err, exists) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve(exists);
                }
            );    
        });

        if (exists) {
            return;
        }

        await new Promise<void>((resolve, reject) => {
            this._client.indices.create(
                {
                    include_type_name: this._include_type_name,
                    index: this._currentIndex,
                    body: {
                        settings: {
                            number_of_shards: 1
                        },
                        mappings: this.getIndexSchema()
                    }
                },
                (err) => {
                    // Skip already exist errors
                    if (err != null && err.message.indexOf('resource_already_exists') >= 0) {
                        err = null;
                    }

                    if (err != null) {
                        reject(err);
                        return;
                    }

                    resolve();
                }
            );
        });
    }

    /**
     * Returns the schema of the log message
     * @param include_type_name A flag that indicates whether the schema should follow the pre-ES 6.x convention
     */
    private getIndexSchema(): any {

        const schema = {
            properties: {
                time: { type: "date", index: true },
                source: { type: "keyword", index: true },
                level: { type: "keyword", index: true },
                trace_id: { type: "text", index: true },
                error: {
                    type: "object",
                    properties: {
                        type: { type: "keyword", index: true },
                        category: { type: "keyword", index: true },
                        status: { type: "integer", index: false },
                        code: { type: "keyword", index: true },
                        message: { type: "text", index: false },
                        details: { type: "object" },
                        trace_id: { type: "text", index: false },
                        cause: { type: "text", index: false },
                        stack_trace: { type: "text", index: false }
                    }
                },
                message: { type: "text", index: this._indexMessage }
            }
        }

        if (this._include_type_name) {
            return {
                log_message: schema
            }
        } else return schema
    }

    /**
     * Saves log messages from the cache.
     * 
     * @param messages  a list with log messages
     */
    protected async save(messages: LogMessage[]): Promise<void> {
        if (!this.isOpen() || messages.length == 0) {
            return;
        }

        await this.createIndexIfNeeded(Context.fromTraceId('elasticsearch_logger'), false);

        const bulk = [];
        for (const message of messages) {
            bulk.push({ index: this.getLogItem()})
            bulk.push(message);
        }

        await new Promise<void>((resolve, reject) => {
            this._client.bulk({ body: bulk }, (err) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    protected getLogItem(): any {
        return this._include_type_name ?
            { _index: this._currentIndex, _type: "log_message", _id: IdGenerator.nextLong() } : // ElasticSearch 6.x
            { _index: this._currentIndex, _id: IdGenerator.nextLong() }                         // ElasticSearch 7.x
    }
}