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
exports.GcpConnectionResolver = void 0;
/** @module connect */
const url = require('url');
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_components_node_2 = require("pip-services4-components-node");
const GcpConnectionParams_1 = require("./GcpConnectionParams");
/**
 * Helper class to retrieve Google connection and credential parameters,
 * validate them and compose a [[GcpConnectionParams]] value.
 *
 * ### Configuration parameters ###
 *
 * - connections:
 *      - uri:           full connection uri with specific app and function name
 *      - protocol:      connection protocol
 *      - project_id:    is your Google Cloud Platform project ID
 *      - region:        is the region where your function is deployed
 *      - function:      is the name of the HTTP function you deployed
 *      - org_id:        organization name
 *
 * - credentials:
 *     - account: the service account name
 *     - auth_token:    Google-generated ID token or null if using custom auth (IAM)
 *
 * ### References ###
 *
 * - <code>\*:credential-store:\*:\*:1.0</code>  (optional) Credential stores to resolve credentials
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/connect.connectionparams.html ConnectionParams]] (in the Pip.Services components package)
 *
 * ### Example ###
 *
 *     let config = ConfigParams.fromTuples(
 *         'connection.uri', 'http://east-my_test_project.cloudfunctions.net/myfunction',
 *         'connection.protocol', 'http',
 *         'connection.region', 'east',
 *         'connection.function', 'myfunction',
 *         'connection.project_id', 'my_test_project',
 *         'credential.auth_token', '1234',
 *     );
 *
 *     let connectionResolver = new GcpConnectionResolver();
 *     connectionResolver.configure(config);
 *     connectionResolver.setReferences(references);
 *
 *     const connectionParams = await connectionResolver.resolve("123");
 */
class GcpConnectionResolver {
    constructor() {
        /**
         * The connection resolver.
         */
        this._connectionResolver = new pip_services3_components_node_1.ConnectionResolver();
        /**
         * The credential resolver.
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
    /**
     * Resolves connection and credential parameters and generates a single
     * GcpConnectionParams value.
     *
     * @param context             (optional) transaction id to trace execution through call chain.
     *
     * @return {GcpConnectionParams} 	GcpConnectionParams value or error.
     *
     * @see [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] (in the Pip.Services components package)
     */
    resolve(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = new GcpConnectionParams_1.GcpConnectionParams();
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
        connection = GcpConnectionParams_1.GcpConnectionParams.mergeConfigs(connection);
        let uri = connection.getUri();
        if (uri == null || uri == "") {
            let protocol = connection.getProtocol();
            let functionName = connection.getFunction();
            let projectId = connection.getProjectId();
            let region = connection.getRegion();
            // https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/FUNCTION_NAME
            uri = `${protocol}://${region}-${projectId}.cloudfunctions.net` + (functionName != null ? `/${functionName}` : '');
            connection.setUri(uri);
        }
        else {
            let address = url.parse(uri);
            let protocol = ("" + address.protocol).replace(':', '');
            let functionName = address.path.replace('/', '');
            let region = uri.indexOf('-') != -1 ? uri.slice(uri.indexOf('//') + 2, uri.indexOf('-')) : '';
            let projectId = uri.indexOf('-') != -1 ? uri.slice(uri.indexOf('-') + 1, uri.indexOf('.')) : '';
            // let functionName = value.slice(-1) != '/' ? value.slice(value.lastIndexOf('/') + 1) : value.slice(value.slice(0, -1).lastIndexOf('/') + 1, -1);
            connection.setRegion(region);
            connection.setProjectId(projectId);
            connection.setFunction(functionName);
            connection.setProtocol(protocol);
        }
        return connection;
    }
}
exports.GcpConnectionResolver = GcpConnectionResolver;
//# sourceMappingURL=GcpConnectionResolver.js.map