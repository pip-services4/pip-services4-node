"use strict";
/** @module connect */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresConnectionResolver = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_config_node_1 = require("pip-services4-config-node");
/**
 * Helper class that resolves PostgreSQL connection and credential parameters,
 * validates them and generates a connection URI.
 *
 * It is able to process multiple connections to PostgreSQL cluster nodes.
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
class PostgresConnectionResolver {
    constructor() {
        /**
         * The connections resolver.
         */
        this._connectionResolver = new pip_services4_config_node_1.ConnectionResolver();
        /**
         * The credentials resolver.
         */
        this._credentialResolver = new pip_services4_config_node_1.CredentialResolver();
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._connectionResolver.configure(config);
        this._credentialResolver.configure(config);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._connectionResolver.setReferences(references);
        this._credentialResolver.setReferences(references);
    }
    validateConnection(context, connection) {
        const uri = connection.getUri();
        if (uri != null)
            return null;
        const traceId = context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null;
        const host = connection.getHost();
        if (host == null) {
            throw new pip_services4_commons_node_1.ConfigException(traceId, "NO_HOST", "Connection host is not set");
        }
        const port = connection.getPort();
        if (port == 0) {
            throw new pip_services4_commons_node_1.ConfigException(traceId, "NO_PORT", "Connection port is not set");
        }
        const database = connection.getAsNullableString("database");
        if (database == null) {
            throw new pip_services4_commons_node_1.ConfigException(traceId, "NO_DATABASE", "Connection database is not set");
        }
    }
    validateConnections(context, connections) {
        if (connections == null || connections.length == 0) {
            throw new pip_services4_commons_node_1.ConfigException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, "NO_CONNECTION", "Database connection is not set");
        }
        for (const connection of connections) {
            this.validateConnection(context, connection);
        }
    }
    composeConfig(connections, credential) {
        const config = {};
        // Define connection part
        for (const connection of connections) {
            const uri = connection.getUri();
            if (uri)
                config.connectionString = uri;
            const host = connection.getHost();
            if (host)
                config.host = host;
            const port = connection.getPort();
            if (port)
                config.port = port;
            const database = connection.getAsNullableString("database");
            if (database)
                config.database = database;
        }
        // Define authentication part
        if (credential) {
            const username = credential.getUsername();
            if (username)
                config.user = username;
            const password = credential.getPassword();
            if (password)
                config.password = password;
        }
        return config;
    }
    /**
     * Resolves PostgreSQL config from connection and credential parameters.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @returns resolved connection config.
     */
    resolve(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const connections = yield this._connectionResolver.resolveAll(context);
            // Validate connections
            this.validateConnections(context, connections);
            const credential = yield this._credentialResolver.lookup(context);
            // Credentials are not validated right now
            const config = this.composeConfig(connections, credential);
            return config;
        });
    }
}
exports.PostgresConnectionResolver = PostgresConnectionResolver;
//# sourceMappingURL=PostgresConnectionResolver.js.map