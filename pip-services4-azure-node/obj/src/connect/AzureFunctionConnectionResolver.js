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
exports.AzureFunctionConnectionResolver = void 0;
/** @module connect */
const url = require("url");
const AzureFunctionConnectionParams_1 = require("./AzureFunctionConnectionParams");
const pip_services4_config_node_1 = require("pip-services4-config-node");
/**
 * Helper class to retrieve Azure connection and credential parameters,
 * validate them and compose a [[AzureConnectionParams]] value.
 *
 * ### Configuration parameters ###
 *
 * - connections:
 *      - uri:           full connection uri with specific app and function name
 *      - protocol:      connection protocol
 *      - app_name:      alternative app name
 *      - function_name: application function name
 * - credentials:
 *      - auth_code:     authorization code or null if using custom auth
 *
 * ### References ###
 *
 * - <code>\*:discovery:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connections
 * - <code>\*:credential-store:\*:\*:1.0</code>  (optional) Credential stores to resolve credentials
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/connect.connectionparams.html ConnectionParams]] (in the Pip.Services components package)
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] (in the Pip.Services components package)
 *
 * ### Example ###
 *
 *     let config = ConfigParams.fromTuples(
 *         "connection.uri", "http://myapp.azurewebsites.net/api/myfunction",
 *         "connection.app_name", "myapp",
 *         "connection.function_name", "myfunction",
 *         "credential.auth_code", "XXXXXXXXXX",
 *     );
 *
 *     let connectionResolver = new AzureConnectionResolver();
 *     connectionResolver.configure(config);
 *     connectionResolver.setReferences(references);
 *
 *     const connectionParams = await connectionResolver.resolve("123");
 */
class AzureFunctionConnectionResolver {
    constructor() {
        /**
         * The connection resolver.
         */
        this._connectionResolver = new pip_services4_config_node_1.ConnectionResolver();
        /**
         * The credential resolver.
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
    /**
     * Resolves connection and credential parameters and generates a single
     * AzureConnectionParams value.
     *
     * @param context             (optional) transaction id to trace execution through call chain.
     *
     * @return {AzureFunctionConnectionParams} 	AzureConnectionParams value or error.
     *
     * @see [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] (in the Pip.Services components package)
     */
    resolve(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = new AzureFunctionConnectionParams_1.AzureFunctionConnectionParams();
            const connectionParams = yield this._connectionResolver.resolve(context);
            connection.append(connectionParams);
            const credentialParams = yield this._credentialResolver.lookup(context);
            connection.append(credentialParams);
            // Perform validation
            connection.validate(context);
            connection = this.composeConnection(connection);
            return connection;
        });
    }
    composeConnection(connection) {
        connection = AzureFunctionConnectionParams_1.AzureFunctionConnectionParams.mergeConfigs(connection);
        let uri = connection.getFunctionUri();
        if (uri == null || uri == "") {
            const protocol = connection.getProtocol();
            const appName = connection.getAppName();
            const functionName = connection.getFunctionName();
            // http://myapp.azurewebsites.net/api/myfunction
            uri = `${protocol}://${appName}.azurewebsites.net/api/${functionName}`;
            connection.setFunctionUri(uri);
        }
        else {
            const address = url.parse(uri);
            const protocol = ("" + address.protocol).replace(':', '');
            const appName = address.host.replace('.azurewebsites.net', '');
            const functionName = address.path.replace('/api/', '');
            connection.setProtocol(protocol);
            connection.setAppName(appName);
            connection.setFunctionName(functionName);
        }
        return connection;
    }
}
exports.AzureFunctionConnectionResolver = AzureFunctionConnectionResolver;
//# sourceMappingURL=AzureFunctionConnectionResolver.js.map