/** @module connect */


import { IConfigurable, IReferenceable, ConfigParams, IReferences, IContext } from 'pip-services4-components-node';
import { AwsConnectionParams } from './AwsConnectionParams';
import { CredentialResolver } from 'pip-services4-config-node';

/**
 * Helper class to retrieve AWS connection and credential parameters,
 * validate them and compose a [[AwsConnectionParams]] value.
 * 
 * ### Configuration parameters ###
 * 
 * - connections:                   
 *     - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *     - region:                      (optional) AWS region
 *     - partition:                   (optional) AWS partition
 *     - service:                     (optional) AWS service
 *     - resource_type:               (optional) AWS resource type
 *     - resource:                    (optional) AWS resource id
 *     - arn:                         (optional) AWS resource ARN
 * - credentials:    
 *     - store_key:                   (optional) a key to retrieve the credentials from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/auth.icredentialstore.html ICredentialStore]]
 *     - access_id:                   AWS access/client id
 *     - access_key:                  AWS access/client id
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
 *         "connection.region", "us-east1",
 *         "connection.service", "s3",
 *         "connection.bucket", "mybucket",
 *         "credential.access_id", "XXXXXXXXXX",
 *         "credential.access_key", "XXXXXXXXXX"
 *     );
 *     
 *     let connectionResolver = new AwsConnectionResolver();
 *     connectionResolver.configure(config);
 *     connectionResolver.setReferences(references);
 *     
 *     const connectionParams = await connectionResolver.resolve("123");
 */
export class AwsConnectionResolver implements IConfigurable, IReferenceable {
    /**
     * The connection resolver.
     */
    protected _connectionResolver: AwsConnectionResolver = new AwsConnectionResolver();
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
     * AWSConnectionParams value.
     * 
     * @param context             (optional) transaction id to trace execution through call chain.
     *
     * @return {AwsConnectionParams} 	callback function that receives AWSConnectionParams value or error.
     * 
     * @see [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] (in the Pip.Services components package)
     */
    public async resolve(context: IContext): Promise<AwsConnectionParams> {
        const connection = new AwsConnectionParams();

        const connectionParams = await this._connectionResolver.resolve(context);
        connection.append(connectionParams);

        const credentialParams = await this._credentialResolver.lookup(context);
        connection.append(credentialParams);

        // Force ARN parsing
        connection.setArn(connection.getArn());

        // Perform validation
        connection.validate(context);

        return connection;
    }

}