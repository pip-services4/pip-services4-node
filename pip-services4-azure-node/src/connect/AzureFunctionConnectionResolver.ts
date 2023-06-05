/** @module connect */
import url = require('url');


import { AzureFunctionConnectionParams } from './AzureFunctionConnectionParams';
import { IConfigurable, IReferenceable, ConfigParams, IReferences, IContext } from 'pip-services4-components-node';
import { ConnectionResolver, CredentialResolver } from 'pip-services4-config-node';

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
export class AzureFunctionConnectionResolver implements IConfigurable, IReferenceable {
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
     * AzureConnectionParams value.
     * 
     * @param context             (optional) transaction id to trace execution through call chain.
     *
     * @return {AzureFunctionConnectionParams} 	AzureConnectionParams value or error.
     * 
     * @see [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] (in the Pip.Services components package)
     */
    public async resolve(context: IContext): Promise<AzureFunctionConnectionParams> {
        let connection = new AzureFunctionConnectionParams();

        const connectionParams = await this._connectionResolver.resolve(context);
        connection.append(connectionParams);

        const credentialParams = await this._credentialResolver.lookup(context);
        connection.append(credentialParams);

        // Perform validation
        connection.validate(context);

        connection = this.composeConnection(connection);

        return connection;
    }

    private composeConnection(connection: AzureFunctionConnectionParams): AzureFunctionConnectionParams {
        connection = AzureFunctionConnectionParams.mergeConfigs(connection);

        let uri = connection.getFunctionUri();

        if (uri == null || uri == "") {
            const protocol = connection.getProtocol();
            const appName = connection.getAppName();
            const functionName = connection.getFunctionName();
            // http://myapp.azurewebsites.net/api/myfunction
            uri = `${protocol}://${appName}.azurewebsites.net/api/${functionName}`;

            connection.setFunctionUri(uri);
        } else {
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