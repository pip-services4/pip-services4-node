/** @module connect */
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { ConnectionResolver } from 'pip-services4-components-node';
import { CredentialResolver } from 'pip-services4-components-node';
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
export declare class CouchbaseConnectionResolver implements IReferenceable, IConfigurable {
    /**
     * The connections resolver.
     */
    protected _connectionResolver: ConnectionResolver;
    /**
     * The credentials resolver.
     */
    protected _credentialResolver: CredentialResolver;
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
    private validateConnection;
    private validateConnections;
    private composeConnection;
    /**
     * Resolves Couchbase connection URI from connection and credential parameters.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @returns			        a resolved URI.
     */
    resolve(context: IContext): Promise<CouchbaseConnectionParams>;
}
