/** @module persistence */

import { ConnectionException } from 'pip-services4-commons-node';
import { IReferenceable, IConfigurable, IOpenable, ConfigParams, IReferences, IContext, ContextResolver } from 'pip-services4-components-node';
import { CassandraConnectionResolver } from './CassandraConnectionResolver';
import { CompositeLogger } from 'pip-services4-observability-node';

/**
 * Cassandra connection using plain driver.
 * 
 * By defining a connection and sharing it through multiple persistence components
 * you can reduce number of used database connections.
 * 
 * ### Configuration parameters ###
 * 
 * - connection(s):    
 *   - discovery_key:             (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - host:                      host name or IP address
 *   - port:                      port number (default: 9042)
 *   - uri:                       resource URI or connection string with all parameters in it
 * - credential(s):    
 *   - store_key:                 (optional) a key to retrieve the credentials from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/auth.icredentialstore.html ICredentialStore]]
 *   - username:                  user name
 *   - password:                  user password
 * - options:
 *   - connect_timeout:      (optional) number of milliseconds to wait before timing out when connecting a new client (default: 0)
 *   - idle_timeout:         (optional) number of milliseconds a client must sit idle in the pool and not be checked out (default: 10000)
 *   - max_pool_size:        (optional) maximum number of clients the pool should contain (default: 10)
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credentials
 * 
 */
export class CassandraConnection implements IReferenceable, IConfigurable, IOpenable {

    private _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        // connections.*
        // credential.*

        "options.connect_timeout", 0,
        "options.idle_timeout", 10000,
        "options.max_pool_size", 3
    );

    /** 
     * The logger.
     */
    protected _logger: CompositeLogger = new CompositeLogger();
    /**
     * The connection resolver.
     */
    protected _connectionResolver: CassandraConnectionResolver = new CassandraConnectionResolver();
    /**
     * The configuration options.
     */
    protected _options: ConfigParams = new ConfigParams();

    /**
     * The Cassandra connection pool object.
     */
    protected _connection: any;
    /**
     * The Cassandra datacenter name.
     */
    protected _datacenter: string;
    /**
     * The Cassandra keyspace name.
     */
    protected _keyspace: string;

    /**
     * Creates a new instance of the connection component.
     */
    public constructor() {
        //
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        config = config.setDefaults(this._defaultConfig);

        this._connectionResolver.configure(config);

        this._options = this._options.override(config.getSection("options"));
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

    private composeOptions(config: ConfigParams): any {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const maxPoolSize = this._options.getAsNullableInteger("max_pool_size");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const connectTimeoutMS = this._options.getAsNullableInteger("connect_timeout");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const idleTimeoutMS = this._options.getAsNullableInteger("idle_timeout");

        const host = config.getAsStringWithDefault("host", "");
        const datacenter = config.getAsNullableString("datacenter");
        
        const options: any = {
            contactPoints: host.split(','),
            localDataCenter: datacenter
        };

        const keyspace = config.getAsNullableString("keyspace");
        if (keyspace != null) {
            options.keyspace = keyspace;
        }

        const username = config.getAsNullableString("username");
        const password = config.getAsNullableString("password");
        if (username != null) {
            options.credentials = {
                username: username,
                password: password
            };
        }

        const port = config.getAsIntegerWithDefault("port", 9042);
        options.protocolOptions = {
            port: port
        };

        return options;
    }

    /**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        const config = await this._connectionResolver.resolve(context);

        this._logger.debug(context, "Connecting to cassandra");

        try {
            const options = this.composeOptions(config);

            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const cassandra = require('cassandra-driver');

            const client = new cassandra.Client(options);

            // Try to connect
            await client.connect();

            this._connection = client;                        
            this._datacenter = options.localDataCenter;
            this._keyspace = options.keyspace;
        } catch (ex) {
            throw new ConnectionException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "CONNECT_FAILED",
                "Connection to Cassandra failed"
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

        try {
            await this._connection.shutdown();

            this._connection = null;
            this._datacenter = null;
        } catch (ex) {
            throw new ConnectionException(
                context != null ? ContextResolver.getTraceId(context) : null,
                'DISCONNECT_FAILED',
                'Disconnect from Cassandra failed: '
            ) .withCause(ex);
        }
    }

    public getConnection(): any {
        return this._connection;
    }

    public getDatacenter(): string {
        return this._datacenter;
    }

    public getKeyspace(): string {
        return this._keyspace;
    }
}
