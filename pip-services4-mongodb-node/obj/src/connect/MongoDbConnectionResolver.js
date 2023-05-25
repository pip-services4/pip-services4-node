"use strict";
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
exports.MongoDbConnectionResolver = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_components_node_2 = require("pip-services4-components-node");
/**
 * Helper class that resolves MongoDB connection and credential parameters,
 * validates them and generates a connection URI.
 *
 * It is able to process multiple connections to MongoDB cluster nodes.
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
class MongoDbConnectionResolver {
    constructor() {
        /**
         * The connections resolver.
         */
        this._connectionResolver = new pip_services3_components_node_1.ConnectionResolver();
        /**
         * The credentials resolver.
         */
        this._credentialResolver = new pip_services3_components_node_2.CredentialResolver();
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
        let uri = connection.getUri();
        if (uri != null)
            return null;
        let host = connection.getHost();
        if (host == null) {
            throw new pip_services3_commons_node_2.ConfigException(context, "NO_HOST", "Connection host is not set");
        }
        let port = connection.getPort();
        if (port == 0) {
            throw new pip_services3_commons_node_2.ConfigException(context, "NO_PORT", "Connection port is not set");
        }
        let database = connection.getAsNullableString("database");
        if (database == null) {
            throw new pip_services3_commons_node_2.ConfigException(context, "NO_DATABASE", "Connection database is not set");
        }
        return null;
    }
    validateConnections(context, connections) {
        if (connections == null || connections.length == 0) {
            throw new pip_services3_commons_node_2.ConfigException(context, "NO_CONNECTION", "Database connection is not set");
        }
        for (let connection of connections) {
            this.validateConnection(context, connection);
        }
    }
    composeUri(connections, credential) {
        // If there is a uri then return it immediately
        for (let connection of connections) {
            let uri = connection.getUri();
            if (uri)
                return uri;
        }
        // Define hosts
        let hosts = '';
        for (let connection of connections) {
            let host = connection.getHost();
            let port = connection.getPort();
            if (hosts.length > 0)
                hosts += ',';
            hosts += host + (port == null ? '' : ':' + port);
        }
        // Define database
        let database = '';
        for (let connection of connections) {
            database = database || connection.getAsNullableString("database");
        }
        if (database.length > 0) {
            database = '/' + database;
        }
        // Define authentication part
        let auth = '';
        if (credential) {
            let username = credential.getUsername();
            if (username) {
                let password = credential.getPassword();
                if (password) {
                    auth = encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@';
                }
                else {
                    auth = encodeURIComponent(username) + '@';
                }
            }
        }
        // Define additional parameters parameters
        let options = pip_services3_commons_node_1.ConfigParams.mergeConfigs(...connections).override(credential);
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
            params += encodeURIComponent(key);
            let value = options.getAsString(key);
            if (value != null) {
                params += '=' + encodeURIComponent(value);
            }
        }
        if (params.length > 0) {
            params = '?' + params;
        }
        // Compose uri
        let uri = "mongodb://" + auth + hosts + database + params;
        return uri;
    }
    /**
     * Resolves MongoDB connection URI from connection and credential parameters.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @returns			        a resolved URI.
     */
    resolve(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let connections = yield this._connectionResolver.resolveAll(context);
            this.validateConnections(context, connections);
            let credential = yield this._credentialResolver.lookup(context);
            // Credentials are not validated right now
            return this.composeUri(connections, credential);
        });
    }
}
exports.MongoDbConnectionResolver = MongoDbConnectionResolver;
//# sourceMappingURL=MongoDbConnectionResolver.js.map