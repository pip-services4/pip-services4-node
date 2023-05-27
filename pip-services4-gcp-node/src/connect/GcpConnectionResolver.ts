/** @module connect */
const url = require('url');

import { IContext } from 'pip-services4-components-node';
import { IConfigurable } from 'pip-services4-components-node';
import { IReferenceable } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { ConnectionResolver } from 'pip-services4-config-node';
import { CredentialResolver } from 'pip-services4-config-node';

import { GcpConnectionParams } from './GcpConnectionParams';

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
 *     - account: the controller account name 
 *     - auth_token:    Google-generated ID token or null if using custom auth (IAM)
 * 
 * ### References ###
 * 
 * - <code>\*:credential-store:\*:\*:1.0</code>  (optional) Credential stores to resolve credentials
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/connect.connectionparams.html ConnectionParams]] (in the Pip.Controllers components package)
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
export class GcpConnectionResolver implements IConfigurable, IReferenceable {
    /**
     * The connection resolver.
     */
    protected _connectionResolver: ConnectionResolver = new ConnectionResolver();
    /**
     * The credential resolver.
     */
    protected _credentialResolver: CredentialResolver = new CredentialResolver();

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._connectionResolver.configure(config);
        this._credentialResolver.configure(config);
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
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
     * @see [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] (in the Pip.Controllers components package)
     */
    public async resolve(context: IContext): Promise<GcpConnectionParams> {
        let connection = new GcpConnectionParams();

        const connectionParams = await this._connectionResolver.resolve(context);
        connection.append(connectionParams);

        const credentialParams = await this._credentialResolver.lookup(context);
        connection.append(credentialParams);

        // Perform validation
        connection.validate(context);

        connection = this.composeConnection(connection);

        return connection;
    }

    private composeConnection(connection: GcpConnectionParams): GcpConnectionParams {
        connection = GcpConnectionParams.mergeConfigs(connection);

        let uri = connection.getUri();

        if (uri == null || uri == "") {
            let protocol = connection.getProtocol();
            let functionName = connection.getFunction();
            let projectId = connection.getProjectId();
            let region = connection.getRegion();
            // https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/FUNCTION_NAME
            uri = `${protocol}://${region}-${projectId}.cloudfunctions.net` + (functionName != null ? `/${functionName}` : '');

            connection.setUri(uri);
        } else {
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