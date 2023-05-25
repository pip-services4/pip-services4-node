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
exports.HttpConnectionResolver = void 0;
/** @module connect */
/** @hidden */
const url = require("url");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const ConnectionResolver_1 = require("./ConnectionResolver");
const CredentialResolver_1 = require("../auth/CredentialResolver");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
/**
 * Helper class to retrieve connections for HTTP-based services abd clients.
 *
 * In addition to regular functions of ConnectionResolver is able to parse http:// URIs
 * and validate connection parameters before returning them.
 *
 * ### Configuration parameters ###
 *
 * - connection:
 *   - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - ...                          other connection parameters
 *
 * - connections:                   alternative to connection
 *   - [connection params 1]:       first connection parameters
 *   -  ...
 *   - [connection params N]:       Nth connection parameters
 *   -  ...
 *
 * ### References ###
 *
 * - <code>\*:discovery:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/connect.connectionparams.html ConnectionParams]]
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/connect.connectionresolver.html ConnectionResolver]]
 *
 * ### Example ###
 *
 *     let config = ConfigParams.fromTuples(
 *          "connection.host", "10.1.1.100",
 *          "connection.port", 8080
 *     );
 *
 *     let connectionResolver = new HttpConnectionResolver();
 *     connectionResolver.configure(config);
 *     connectionResolver.setReferences(references);
 *
 *     let connection = await connectionResolver.resolve("123");
 *     // Now use connection...
 */
class HttpConnectionResolver {
    constructor() {
        /**
         * The base connection resolver.
         */
        this._connectionResolver = new ConnectionResolver_1.ConnectionResolver();
        /**
         * The base credential resolver.
         */
        this._credentialResolver = new CredentialResolver_1.CredentialResolver();
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
    validateConnection(context, connection, credential) {
        if (connection == null) {
            throw new pip_services4_commons_node_1.ConfigException(context != null ? context.getTraceId() : null, "NO_CONNECTION", "HTTP connection is not set");
        }
        let uri = connection.getUri();
        if (uri != null)
            return;
        let protocol = connection.getProtocolWithDefault("http");
        if ("http" != protocol && "https" != protocol) {
            throw new pip_services4_commons_node_1.ConfigException(context != null ? context.getTraceId() : null, "WRONG_PROTOCOL", "Protocol is not supported by REST connection").withDetails("protocol", protocol);
        }
        let host = connection.getHost();
        if (host == null) {
            throw new pip_services4_commons_node_1.ConfigException(context != null ? context.getTraceId() : null, "NO_HOST", "Connection host is not set");
        }
        let port = connection.getPort();
        if (port == 0) {
            throw new pip_services4_commons_node_1.ConfigException(context != null ? context.getTraceId() : null, "NO_PORT", "Connection port is not set");
        }
        // Check HTTPS credentials
        if (protocol == "https") {
            // Check for credential
            if (credential == null) {
                throw new pip_services4_commons_node_1.ConfigException(context != null ? context.getTraceId() : null, "NO_CREDENTIAL", "SSL certificates are not configured for HTTPS protocol");
            }
            else {
                // Sometimes when we use https we are on an internal network and do not want to have to deal with security.
                // When we need a https connection and we don't want to pass credentials, flag is 'credential.internal_network',
                // this flag just has to be present and non null for this functionality to work.
                if (credential.getAsNullableString("internal_network") == null) {
                    if (credential.getAsNullableString('ssl_key_file') == null) {
                        throw new pip_services4_commons_node_1.ConfigException(context != null ? context.getTraceId() : null, "NO_SSL_KEY_FILE", "SSL key file is not configured in credentials");
                    }
                    else if (credential.getAsNullableString('ssl_crt_file') == null) {
                        throw new pip_services4_commons_node_1.ConfigException(context.getTraceId(), "NO_SSL_CRT_FILE", "SSL crt file is not configured in credentials");
                    }
                }
            }
        }
    }
    composeConnection(connections, credential) {
        let connection = pip_services4_components_node_1.ConfigParams.mergeConfigs(...connections);
        let uri = connection.getAsString("uri");
        if (uri == null || uri == "") {
            let protocol = connection.getAsStringWithDefault("protocol", "http");
            let host = connection.getAsString("host");
            let port = connection.getAsInteger("port");
            uri = protocol + "://" + host;
            if (port > 0) {
                uri += ":" + port;
            }
            connection.setAsObject("uri", uri);
        }
        else {
            let address = url.parse(uri);
            let protocol = ("" + address.protocol).replace(':', '');
            connection.setAsObject("protocol", protocol);
            connection.setAsObject("host", address.hostname);
            connection.setAsObject("port", address.port);
        }
        if (connection.getAsString("protocol") == "https" && credential != null) {
            if (credential.getAsNullableString("internal_network") == null) {
                connection = connection.override(credential);
            }
        }
        return connection;
    }
    /**
     * Resolves a single component connection. If connections are configured to be retrieved
     * from Discovery service it finds a IDiscovery and resolves the connection there.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @returns 			    a resolved connection options
     */
    resolve(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this._connectionResolver.resolve(context);
            let credential = yield this._credentialResolver.lookup(context);
            this.validateConnection(context, connection, credential);
            return this.composeConnection([connection], credential);
        });
    }
    /**
     * Resolves all component connection. If connections are configured to be retrieved
     * from Discovery service it finds a IDiscovery and resolves the connection there.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @returns 			    a resolved connection options
     */
    resolveAll(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let connections = yield this._connectionResolver.resolveAll(context);
            let credential = yield this._credentialResolver.lookup(context);
            connections = connections || [];
            for (let connection of connections) {
                this.validateConnection(context, connection, credential);
            }
            return this.composeConnection(connections, credential);
        });
    }
    /**
     * Registers the given connection in all referenced discovery services.
     * This method can be used for dynamic service discovery.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param connection        a connection to register.
     */
    register(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this._connectionResolver.resolve(context);
            let credential = yield this._credentialResolver.lookup(context);
            // Validate connection
            this.validateConnection(context, connection, credential);
            yield this._connectionResolver.register(context, connection);
        });
    }
}
exports.HttpConnectionResolver = HttpConnectionResolver;
//# sourceMappingURL=HttpConnectionResolver.js.map