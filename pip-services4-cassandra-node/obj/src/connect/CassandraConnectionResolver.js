"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraConnectionResolver = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
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
class CassandraConnectionResolver extends pip_services4_components_node_1.CompositeConnectionResolver {
    /**
     * Creates instance of this class.
     */
    constructor() {
        super();
        this._supportedProtocols = ["cassandra"];
        this._defaultProtocol = "cassandra";
        this._defaultPort = 9042;
    }
    /**
     * Merges connection options with connection parameters
     * This method can be overriden in child classes.
     *
     * @param options connection options
     * @param connection connection parameters to be merged
     * @returns merged connection options.
     */
    mergeConnection(options, connection) {
        let originalOptions = connection;
        // Process uri if it is set.
        let uri = connection.getUri();
        if (uri != null && uri != "") {
            originalOptions = pip_services4_components_node_2.ConnectionUtils.parseUri(uri, this._defaultProtocol, this._defaultPort);
            originalOptions = pip_services4_components_node_2.ConnectionUtils.rename(originalOptions, "path", "datacenter");
        }
        // Rename common parameters
        originalOptions = pip_services4_components_node_2.ConnectionUtils.rename(originalOptions, "database", "datacenter");
        let mergedOptions = pip_services4_components_node_2.ConnectionUtils.concat(options, originalOptions, "host", "port");
        return mergedOptions;
    }
}
exports.CassandraConnectionResolver = CassandraConnectionResolver;
//# sourceMappingURL=CassandraConnectionResolver.js.map