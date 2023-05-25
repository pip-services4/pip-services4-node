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

import { CouchbaseConnectionParams } from './CouchbaseConnectionParams';

/**
 * Helper class that resolves Couchbase connection and credential parameters,
 * validates them and generates a connection URI.
 * 
 * It is able to process multiple connections to Couchbase cluster nodes.
 * 
 *  ### Configuration parameters ###
 * 
 * - connection(s):
 *   - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - host:                        host name or IP address
 *   - port:                        port number (default: 27017)
 *   - database:                    database (bucket) name
 *   - uri:                         resource URI or connection string with all parameters in it
 * - credential(s):
 *   - store_key:                   (optional) a key to retrieve the credentials from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/auth.icredentialstore.html ICredentialStore]]
 *   - username:                    user name
 *   - password:                    user password
 * 
 * ### References ###
 * 
 * - <code>\*:discovery:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code>      (optional) Credential stores to resolve credentials
 */
export class CouchbaseConnectionResolver implements IReferenceable, IConfigurable {
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
        if (uri != null) return;

        let host = connection.getHost();
        if (host == null) {
            throw new ConfigException(
                context,
                "NO_HOST",
                "Connection host is not set"
            );
        }

        let port = connection.getPort();
        if (port == 0) {
            throw new ConfigException(
                context,
                "NO_PORT",
                "Connection port is not set"
            );
        }

        // let database = connection.getAsNullableString("database");
        // if (database == null) {
        //     throw new ConfigException(
        //         context,
        //         "NO_DATABASE",
        //         "Connection database is not set"
        //     );
        // }
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

    private composeConnection(connections: ConnectionParams[], credential: CredentialParams): CouchbaseConnectionParams {
        let result = new CouchbaseConnectionParams();

        if (credential != null) {
            result.username = credential.getUsername();
            if (result.username) {
                result.password = credential.getPassword();
            }
        }

        // If there is a uri then return it immediately
        for (let connection of connections) {
            result.uri = connection.getUri();
            if (result.uri) {
                result.uri = result.uri.replace(/[\\]/g, '');
                return result;
            }
        }

        // Define hosts
        let hosts = '';
        for (let connection of connections) {
            let host = connection.getHost();
            let port = connection.getPort();

            if (hosts.length > 0) {
                hosts += ',';
            }
            hosts += host + (port == null ? '' : ':' + port);
        }

        // Define database
        let database = '';
        for (let connection of connections) {
            database = database || connection.getAsNullableString("database");
        }
        database = database || '';
        if (database.length > 0) {
            database = '/' + database;
        }

        // Define additional parameters parameters
        let options = ConfigParams.mergeConfigs(...connections).override(credential);
        options.remove('uri');
        options.remove('host');
        options.remove('port');
        options.remove('database');
        options.remove('username');
        options.remove('password');

        let params = '';
        let keys = options.getKeys();
        for (let key of keys) {
            if (params.length > 0) {
                params += '&';
            }

            params += key;

            let value = options.getAsString(key);
            if (value != null) {
                params += '=' + value;
            }
        }
        if (params.length > 0) {
            params = '?' + params;
        }

        // Compose uri
        result.uri = "couchbase://" + hosts + database + params;

        return result;
    }

    /**
     * Resolves Couchbase connection URI from connection and credential parameters.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @returns			        a resolved URI.
     */
    public async resolve(context: IContext): Promise<CouchbaseConnectionParams> {
        let connections = await this._connectionResolver.resolveAll(context);
        // Validate connections
        this.validateConnections(context, connections);

        let credential = await this._credentialResolver.lookup(context);
        // Credentials are not validated right now

        let connection = this.composeConnection(connections, credential);
        return connection;
    }

}
