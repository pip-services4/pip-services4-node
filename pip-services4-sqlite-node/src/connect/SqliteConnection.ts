/** @module persistence */

import { ConnectionException } from 'pip-services4-commons-node';
import { IReferenceable, IConfigurable, IOpenable, ConfigParams, IReferences, IContext } from 'pip-services4-components-node';
import { SqliteConnectionResolver } from './SqliteConnectionResolver';
import { CompositeLogger } from 'pip-services4-observability-node';

/**
 * SQLite connection using plain driver.
 * 
 * By defining a connection and sharing it through multiple persistence components
 * you can reduce number of used database connections.
 * 
 * ### Configuration parameters ###
 * 
 * - connection(s):    
 *   - discovery_key:             (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - database:                  database file path
 *   - uri:                       resource URI with file:// protocol
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credentials
 * 
 */
export class SqliteConnection implements IReferenceable, IConfigurable, IOpenable {

    private _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        // connections.*
        // credential.*
    );

    /** 
     * The logger.
     */
    protected _logger: CompositeLogger = new CompositeLogger();
    /**
     * The connection resolver.
     */
    protected _connectionResolver: SqliteConnectionResolver = new SqliteConnectionResolver();
    /**
     * The configuration options.
     */
    protected _options: ConfigParams = new ConfigParams();

    /**
     * The SQLite connection pool object.
     */
    protected _connection: any;
    /**
     * The SQLite database name.
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

    /**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        const config = await this._connectionResolver.resolve(context);

        this._logger.debug(context, "Connecting to sqlite");

        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const sqlite = require('sqlite3');

            const db = await new Promise<any>((resolve, reject) => {
                const db = new sqlite.Database(config.database, /*sqlite.OPEN_CREATE,*/ (err) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve(db);
                });
            });
        
            this._connection = db;                        
            this._databaseName = config.database;
        } catch (ex) {
            throw new ConnectionException(
                context != null ? context.getTraceId() : null,
                "CONNECT_FAILED",
                "Connection to sqlite failed"
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
                this._connection.close((err) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });

            this._logger.debug(context, "Disconnected from sqlite database %s", this._databaseName);

            this._connection = null;
            this._databaseName = null;
        } catch (ex) {
            throw new ConnectionException(
                context != null ? context.getTraceId() : null,
                'DISCONNECT_FAILED',
                'Disconnect from sqlite failed: '
            ).withCause(ex);
        }
    }

    public getConnection(): any {
        return this._connection;
    }

    public getDatabaseName(): string {
        return this._databaseName;
    }

}
