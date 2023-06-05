/** @module connect */
import { ConfigParams } from 'pip-services4-components-node';
import { CompositeConnectionResolver, ConnectionParams } from 'pip-services4-config-node';
/**
 * Helper class that resolves Cassandra connection and credential parameters,
 * validates them and generates a connection URI.
 *
 * It is able to process multiple connections to Cassandra cluster nodes.
 *
 *  ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - host:                        host name or IP address
 *   - port:                        port number (default: 27017)
 *   - database:                    database name
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
export declare class CassandraConnectionResolver extends CompositeConnectionResolver {
    /**
     * Creates instance of this class.
     */
    constructor();
    /**
     * Merges connection options with connection parameters
     * This method can be overriden in child classes.
     *
     * @param options connection options
     * @param connection connection parameters to be merged
     * @returns merged connection options.
     */
    protected mergeConnection(options: ConfigParams, connection: ConnectionParams): ConfigParams;
}
