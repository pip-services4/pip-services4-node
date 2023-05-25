/** @module persistence */
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IOpenable } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { ConnectionException } from 'pip-services4-commons-node';
import { CompositeLogger } from 'pip-services4-components-node';

import { PostgresConnectionResolver } from './PostgresConnectionResolver';

/**
 * PostgreSQL connection using plain driver.
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
export class PostgresConnection implements IReferenceable, IConfigurable, IOpenable {

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
    protected _connectionResolver: PostgresConnectionResolver = new PostgresConnectionResolver();
    /**
     * The configuration options.
     */
    protected _options: ConfigParams = new ConfigParams();

    /**
     * The PostgreSQL connection pool object.
     */
    protected _connection: any;
    /**
     * The PostgreSQL database name.
     */
    protected _databaseName: string;

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

    private composeSettings(): any {
        let maxPoolSize = this._options.getAsNullableInteger("max_pool_size");
        let connectTimeoutMS = this._options.getAsNullableInteger("connect_timeout");
        let idleTimeoutMS = this._options.getAsNullableInteger("idle_timeout");

        let settings: any = {
            max: maxPoolSize,
            connectionTimeoutMillis: connectTimeoutMS,
            idleTimeoutMillis: idleTimeoutMS
        };

        return settings;
    }

    /**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        let config = await this._connectionResolver.resolve(context);

        this._logger.debug(context, "Connecting to postgres");

        try {
            let settings = this.composeSettings();
            let options = Object.assign(settings, config);

            const { Pool } = require('pg');

            let pool = new Pool(options);

            // Try to connect
            return new Promise((resolve, reject) => {
                pool.connect((err, client, release) => {
                    if (err != null || client == null) {
                        err = new ConnectionException(
                            context,
                            "CONNECT_FAILED",
                            "Connection to postgres failed"
                        ).withCause(err);

                        reject(err);
                        return;
                    }

                    this._connection = pool;                        
                    this._databaseName = config.database;
                    release();

                    resolve();
                });
            });
        } catch (ex) {
            throw new ConnectionException(
                context,
                "CONNECT_FAILED",
                "Connection to postgres failed"
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

        return new Promise((resolve, reject) => {
            this._connection.end((err) => {
                if (err) {
                    err = new ConnectionException(
                        context,
                        'DISCONNECT_FAILED',
                        'Disconnect from postgres failed: '
                    ) .withCause(err);
                    
                    reject(err);
                    return;
                }

                this._logger.debug(context, "Disconnected from postgres database %s", this._databaseName);

                this._connection = null;
                this._databaseName = null;
        
                resolve();
            });
        });
    }

    public getConnection(): any {
        return this._connection;
    }

    public getDatabaseName(): string {
        return this._databaseName;
    }

}
