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
exports.MqttConnectionResolver = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_config_node_1 = require("pip-services4-config-node");
/**
 * Helper class that resolves MQTT connection and credential parameters,
 * validates them and generates connection options.
 *
 *  ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - host:                        host name or IP address
 *   - port:                        port number
 *   - uri:                         resource URI or connection string with all parameters in it
 * - credential(s):
 *   - store_key:                   (optional) a key to retrieve the credentials from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/auth.icredentialstore.html ICredentialStore]]
 *   - username:                    user name
 *   - password:                    user password
 *
 * ### References ###
 *
 * - <code>\*:discovery:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connections
 * - <code>\*:credential-store:\*:\*:1.0</code>   (optional) Credential stores to resolve credentials
 */
class MqttConnectionResolver {
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
     * @param references     references to locate the component dependencies.
     */
    setReferences(references) {
        this._connectionResolver.setReferences(references);
        this._credentialResolver.setReferences(references);
    }
    validateConnection(context, connection) {
        if (connection == null) {
            throw new pip_services4_commons_node_1.ConfigException(context != null ? context.getTraceId() : null, "NO_CONNECTION", "MQTT connection is not set");
        }
        const uri = connection.getUri();
        if (uri != null) {
            return null;
        }
        const protocol = connection.getAsStringWithDefault("protocol", "mqtt");
        if (protocol == null) {
            throw new pip_services4_commons_node_1.ConfigException(context != null ? context.getTraceId() : null, "NO_PROTOCOL", "Connection protocol is not set");
        }
        const host = connection.getHost();
        if (host == null) {
            throw new pip_services4_commons_node_1.ConfigException(context != null ? context.getTraceId() : null, "NO_HOST", "Connection host is not set");
        }
        const port = connection.getAsIntegerWithDefault("port", 1883);
        if (port == 0) {
            throw new pip_services4_commons_node_1.ConfigException(context != null ? context.getTraceId() : null, "NO_PORT", "Connection port is not set");
        }
        return;
    }
    composeOptions(connection, credential) {
        // Define additional parameters parameters
        const options = connection.override(credential);
        // Compose uri
        if (options.getAsString("uri") == null) {
            const protocol = connection.getAsStringWithDefault("protocol", "mqtt");
            const host = connection.getHost();
            const port = connection.getAsIntegerWithDefault("port", 1883);
            const uri = protocol + "://" + host + ":" + port;
            options.setAsObject("uri", uri);
        }
        return options.getAsObject();
    }
    /**
     * Resolves MQTT connection options from connection and credential parameters.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @returns resolved MQTT connection options.
     */
    resolve(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this._connectionResolver.resolve(context);
            // Validate connections
            this.validateConnection(context, connection);
            const credential = yield this._credentialResolver.lookup(context);
            // Credentials are not validated right now
            const options = this.composeOptions(connection, credential);
            return options;
        });
    }
    /**
     * Composes MQTT connection options from connection and credential parameters.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param connection        connection parameters
     * @param credential        credential parameters
     * @returns resolved MQTT connection options.
     */
    compose(context, connection, credential) {
        // Validate connections
        this.validateConnection(context, connection);
        const options = this.composeOptions(connection, credential);
        return options;
    }
}
exports.MqttConnectionResolver = MqttConnectionResolver;
//# sourceMappingURL=MqttConnectionResolver.js.map