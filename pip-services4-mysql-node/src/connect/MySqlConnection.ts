/** @module persistence */

import { ConnectionException } from 'pip-services4-commons-node';
import { IReferenceable, IConfigurable, IOpenable, ConfigParams, IReferences, IContext } from 'pip-services4-components-node';
import { MySqlConnectionResolver } from './MySqlConnectionResolver';
import { CompositeLogger } from 'pip-services4-observability-node';

/**
 * MySQL connection using plain driver.
 * 
 * By defining a connection and sharing it through multiple persistence components
 * you can reduce number of used database connections.
 * 
 * ### Configuration parameters ###
 * 
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
export class MySqlConnection implements IReferenceable, IConfigurable, IOpenable {

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
    protected _connectionResolver: MySqlConnectionResolver = new MySqlConnectionResolver();
    /**
     * The configuration options.
     */
    protected _options: ConfigParams = new ConfigParams();

    /**
     * The MySQL connection pool object.
     */
    protected _connection: any;
    /**
     * The MySQL database name.
     */
    protected _databaseName: string;

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

    private composeUriSettings(uri: string): string {
        const maxPoolSize = this._options.getAsNullableInteger("max_pool_size");
        const connectTimeoutMS = this._options.getAsNullableInteger("connect_timeout");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const idleTimeoutMS = this._options.getAsNullableInteger("idle_timeout");

        const settings: any = {
            multipleStatements: true,
            connectionLimit: maxPoolSize,
            connectTimeout: connectTimeoutMS,
            insecureAuth: true,
//            idleTimeoutMillis: idleTimeoutMS
        };

        let params = '';
        for (const key in settings) {
            if (params.length > 0) {
                params += '&';
            }

            params += key;

            const value = settings[key];
            if (value != null) {
                params += '=' + value;
            }
        }
        if (uri.indexOf('?') < 0) {
            uri += '?' + params;
        } else {
            uri += '&' + params;
        }

        return uri;
    }

    /**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        let uri = await this._connectionResolver.resolve(context);

        this._logger.debug(context, "Connecting to MySQL...");

        try {
            uri = this.composeUriSettings(uri);

            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const mysql = require('mysql');
            const pool = mysql.createPool(uri);

            // Try to connect
            const connection = await new Promise<any>((resolve, reject) => {
                pool.getConnection((err, connection) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve(connection);
                });
            });

            this._connection = pool;                        
            this._databaseName = connection.config.database;

            connection.release();
        } catch (ex) {
            throw new ConnectionException(
                context != null ? context.getTraceId() : null,
                "CONNECT_FAILED",
                "Connection to MySQL failed"
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
            await new Promise<void>((resolve, reject) => {
                this._connection.end((err) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });

            this._logger.debug(context, "Disconnected from MySQL database %s", this._databaseName);

            this._connection = null;
            this._databaseName = null;    
        } catch(ex) {
            throw new ConnectionException(
                context != null ? context.getTraceId() : null,
                'DISCONNECT_FAILED',
                'Disconnect from MySQL failed: '
            ) .withCause(ex);
        }
    }

    public getConnection(): any {
        return this._connection;
    }

    public getDatabaseName(): string {
        return this._databaseName;
    }

}
