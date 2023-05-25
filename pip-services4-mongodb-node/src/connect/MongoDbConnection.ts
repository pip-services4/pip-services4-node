/** @module connect */
import { Db, MongoClient, MongoClientOptions } from 'mongodb';

import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IOpenable } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { ConnectionException } from 'pip-services4-commons-node';
import { CompositeLogger } from 'pip-services4-components-node';

import { MongoDbConnectionResolver } from './MongoDbConnectionResolver';


/**
 * MongoDB connection using plain driver.
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
 *   - username:                  (optional) user name
 *   - password:                  (optional) user password
 * - options:
 *   - max_pool_size:             (optional) maximum connection pool size (default: 2)
 *   - keep_alive:                (optional) enable connection keep alive (default: true)
 *   - connect_timeout:           (optional) connection timeout in milliseconds (default: 5000)
 *   - socket_timeout:            (optional) socket timeout in milliseconds (default: 360000)
 *   - auto_reconnect:            (optional) enable auto reconnection (default: true)
 *   - reconnect_interval:        (optional) reconnection interval in milliseconds (default: 1000)
 *   - max_page_size:             (optional) maximum page size (default: 100)
 *   - replica_set:               (optional) name of replica set
 *   - ssl:                       (optional) enable SSL connection (default: false)
 *   - auth_source:               (optional) authentication source
 *   - debug:                     (optional) enable debug output (default: false).
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credentials
 * 
 */
export class MongoDbConnection implements IReferenceable, IConfigurable, IOpenable {

    private _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        // connections.*
        // credential.*

        "options.max_pool_size", 2,
        "options.keep_alive", 1,
        "options.connect_timeout", 5000,
        "options.auto_reconnect", true,
        "options.max_page_size", 100,
        "options.debug", true
    );

    /** 
     * The logger.
     */
    protected _logger: CompositeLogger = new CompositeLogger();
    /**
     * The connection resolver.
     */
    protected _connectionResolver: MongoDbConnectionResolver = new MongoDbConnectionResolver();
    /**
     * The configuration options.
     */
    protected _options: ConfigParams = new ConfigParams();

    /**
     * The MongoDB connection object.
     */
    protected _connection: MongoClient;
    /**
     * The MongoDB database name.
     */
    protected _databaseName: string;
    /**
     * The MongoDb database object.
     */
    protected _db: Db;

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

    private composeSettings(): MongoClientOptions {
        let maxPoolSize = this._options.getAsNullableInteger("max_pool_size");
        let keepAlive = this._options.getAsNullableInteger("keep_alive");
        let connectTimeoutMS = this._options.getAsNullableInteger("connect_timeout");
        let socketTimeoutMS = this._options.getAsNullableInteger("socket_timeout");
        let autoReconnect = this._options.getAsNullableBoolean("auto_reconnect");
        let reconnectInterval = this._options.getAsNullableInteger("reconnect_interval");
        let debug = this._options.getAsNullableBoolean("debug");

        let ssl = this._options.getAsNullableBoolean("ssl");
        let replicaSet = this._options.getAsNullableString("replica_set");
        let authSource = this._options.getAsNullableString("auth_source");
        let authUser = this._options.getAsNullableString("auth_user");
        let authPassword = this._options.getAsNullableString("auth_password");

        let settings: MongoClientOptions = {
            maxPoolSize: maxPoolSize,
            keepAliveInitialDelay: keepAlive,
            //autoReconnect: autoReconnect,
            // reconnectInterval: reconnectInterval,
            connectTimeoutMS: connectTimeoutMS,
            socketTimeoutMS: socketTimeoutMS,
            // ssl: ssl,
            // replicaSet: replicaSet,
            // authSource: authSource,
            // 'auth.user': authUser,
            // 'auth.password': authPassword
            // authSource: this._databaseName
        };

        if (ssl != null)
            settings.ssl = ssl;
        if (replicaSet != null)
            settings.replicaSet = replicaSet;
        if (authSource != null)
            settings.authSource = authSource;
        if (authUser != null)
            settings['auth.user'] = authUser;
        if (authPassword != null)
            settings['auth.password'] = authPassword;

        return settings;
    }

    /**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        let uri = await this._connectionResolver.resolve(context);

        this._logger.debug(context, "Connecting to mongodb");

        try {
            let settings: MongoClientOptions = this.composeSettings();

            

            let client = await new MongoClient(uri, settings).connect();

            this._connection = client;                
            this._db = client.db();
            this._databaseName = this._db.databaseName;
        } catch (ex) {
            throw new ConnectionException(
                context,
                "CONNECT_FAILED",
                "Connection to mongodb failed"
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

        await this._connection.close();

        this._connection = null;
        this._db = null;
        this._databaseName = null;

        this._logger.debug(context, "Disconnected from mongodb database %s", this._databaseName);
    }

    public getConnection(): MongoClient {
        return this._connection;
    }

    public getDatabase(): Db {
        return this._db;
    }

    public getDatabaseName(): string {
        return this._databaseName;
    }

}
