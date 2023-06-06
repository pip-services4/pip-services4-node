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
exports.SqliteConnectionResolver = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_config_node_1 = require("pip-services4-config-node");
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
class SqliteConnectionResolver {
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
        if (uri != null) {
            if (!uri.startsWith("file://")) {
                throw new pip_services4_commons_node_1.ConfigException(context != null ? context.getTraceId() : null, "WRONG_PROTOCOL", "Connection protocol must be file://");
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
        const database = connection.getAsNullableString("database");
        if (database == null) {
            throw new pip_services4_commons_node_1.ConfigException(context != null ? context.getTraceId() : null, "NO_DATABASE", "Connection database is not set");
        }
        return null;
    }
    validateConnections(context, connections) {
        if (connections == null || connections.length == 0) {
            throw new pip_services4_commons_node_1.ConfigException(context != null ? context.getTraceId() : null, "NO_CONNECTION", "Database connection is not set");
        }
        for (const connection of connections) {
            this.validateConnection(context, connection);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    composeConfig(connections, credential) {
        const config = {};
        // Define connection part
        for (const connection of connections) {
            const uri = connection.getUri();
            if (uri) {
                // Removing file://
                config.database = uri.substring(7);
            }
            // let host = connection.getHost();
            // if (host) config.host = host;
            // let port = connection.getPort();
            // if (port) config.port = port;
            const database = connection.getAsNullableString("database");
            if (database)
                config.database = database;
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
exports.SqliteConnectionResolver = SqliteConnectionResolver;
//# sourceMappingURL=SqliteConnectionResolver.js.map