/** @module connect */
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { ConfigException } from 'pip-services4-commons-node';
import { ConnectionResolver } from 'pip-services4-components-node';
import { CredentialResolver } from 'pip-services4-components-node';
import { ConnectionParams } from 'pip-services4-components-node';
import { CredentialParams } from 'pip-services4-components-node';

/**
 * Helper class that resolves SQLite connection and credential parameters,
 * validates them and generates a connection URI.
 * 
 * It is able to process multiple connections to SQLite cluster nodes.
 * 
 *  ### Configuration parameters ###
 * 
 * - connection(s):    
 *   - discovery_key:             (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - database:                  database file path
 *   - uri:                       resource URI with file:// protocol
 * 
 * ### References ###
 * 
 * - <code>\*:discovery:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code>      (optional) Credential stores to resolve credentials
 */
export class SqliteConnectionResolver implements IReferenceable, IConfigurable {
    /** 
     * The connections resolver.
     */
    protected _connectionResolver: ConnectionResolver = new ConnectionResolver();
    /** 
     * The credentials resolver.
     */
    protected _credentialResolver: CredentialResolver = new CredentialResolver();

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._connectionResolver.configure(config);
        this._credentialResolver.configure(config);
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._connectionResolver.setReferences(references);
        this._credentialResolver.setReferences(references);
    }
    
    private validateConnection(context: IContext, connection: ConnectionParams): void {
        let uri = connection.getUri();
        if (uri != null) {
            if (!uri.startsWith("file://")) {
                throw new ConfigException(
                    context,
                    "WRONG_PROTOCOL",
                    "Connection protocol must be file://"
                );
            }
            return;
        }

        // let host = connection.getHost();
        // if (host == null) {
        //     throw new ConfigException(
        //         context,
        //         "NO_HOST",
        //         "Connection host is not set"
        //     );
        // }

        // let port = connection.getPort();
        // if (port == 0) {
        //     throw new ConfigException(
        //         context,
        //         "NO_PORT",
        //         "Connection port is not set"
        //     );
        // }

        let database = connection.getAsNullableString("database");
        if (database == null) {
            throw new ConfigException(
                context,
                "NO_DATABASE",
                "Connection database is not set"
            );
        }

        return null;
    }

    private validateConnections(context: IContext, connections: ConnectionParams[]): void {
        if (connections == null || connections.length == 0) {
            throw new ConfigException(
                context,
                "NO_CONNECTION",
                "Database connection is not set"
            );
        }

        for (let connection of connections) {
            this.validateConnection(context, connection);
        }
    }

    private composeConfig(connections: ConnectionParams[], credential: CredentialParams): any {
        let config: any = {};

        // Define connection part
        for (let connection of connections) {
            let uri = connection.getUri();
            if (uri) {
                // Removing file://
                config.database = uri.substring(7);
            }

            // let host = connection.getHost();
            // if (host) config.host = host;

            // let port = connection.getPort();
            // if (port) config.port = port;

            let database = connection.getAsNullableString("database");
            if (database) config.database = database;
        }

        // Define authentication part
        // if (credential) {
        //     let username = credential.getUsername();
        //     if (username) config.user = username;

        //     let password = credential.getPassword();
        //     if (password) config.password = password;
        // }

        return config;
    }

    /**
     * Resolves SQLite connection URI from connection and credential parameters.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @returns 			    a resolved config.
     */
    public async resolve(context: IContext): Promise<any> {
        let connections = await this._connectionResolver.resolveAll(context);
        // Validate connections
        this.validateConnections(context, connections);

        let credential = await this._credentialResolver.lookup(context);
        // Credentials are not validated right now

        let config = this.composeConfig(connections, credential);
        return config;
    }
}
