/** @module connect */
import { IContext } from 'pip-services4-components-node';
import { IReferenceable } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { IConfigurable } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { CredentialParams } from '../auth/CredentialParams';
import { CredentialResolver } from '../auth/CredentialResolver';
import { ConnectionParams } from './ConnectionParams';
import { ConnectionResolver } from './ConnectionResolver';
/**
 * Helper class that resolves connection and credential parameters,
 * validates them and generates connection options.
 *
 *  ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-config-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:                    communication protocol
 *   - host:                        host name or IP address
 *   - port:                        port number
 *   - uri:                         resource URI or connection string with all parameters in it
 * - credential(s):
 *   - store_key:                   (optional) a key to retrieve the credentials from [[https://pip-services4-node.github.io/pip-services4-config-node/interfaces/auth.icredentialstore.html ICredentialStore]]
 *   - username:                    user name
 *   - password:                    user password
 *
 * ### References ###
 *
 * - <code>\*:discovery:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-config-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connections
 * - <code>\*:credential-store:\*:\*:1.0</code>   (optional) Credential stores to resolve credentials
 */
export declare class CompositeConnectionResolver implements IReferenceable, IConfigurable {
    /**
     * The connection options
     */
    protected _options: ConfigParams;
    /**
     * The connections resolver.
     */
    protected _connectionResolver: ConnectionResolver;
    /**
     * The credentials resolver.
     */
    protected _credentialResolver: CredentialResolver;
    /**
     * The cluster support (multiple connections)
     */
    protected _clusterSupported: boolean;
    /**
     * The default protocol
     */
    protected _defaultProtocol: string;
    /**
     * The default port number
     */
    protected _defaultPort: number;
    /**
     * The list of supported protocols
     */
    protected _supportedProtocols: string[];
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Resolves connection options from connection and credential parameters.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @returns resolved options.
     */
    resolve(context: IContext): Promise<ConfigParams>;
    /**
     * Composes Composite connection options from connection and credential parameters.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param connections        connection parameters
     * @param credential        credential parameters
     * @param parameters        optional parameters
     * @returns 			    resolved options.
     */
    compose(context: IContext, connections: ConnectionParams[], credential: CredentialParams, parameters: ConfigParams): ConfigParams;
    /**
     * Validates connection parameters and throws an exception on error.
     * This method can be overriden in child classes.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param connection connection parameters to be validated
     */
    protected validateConnection(context: IContext, connection: ConnectionParams): void;
    /**
     * Validates credential parameters and throws an exception on error.
     * This method can be overriden in child classes.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param credential  credential parameters to be validated
     */
    protected validateCredential(context: IContext, credential: CredentialParams): void;
    /**
     * Composes connection and credential parameters into connection options.
     * This method can be overriden in child classes.
     *
     * @param connections a list of connection parameters
     * @param credential credential parameters
     * @param parameters optional parameters
     * @returns a composed connection options.
     */
    protected composeOptions(connections: ConnectionParams[], credential: CredentialParams, parameters: ConfigParams): ConfigParams;
    /**
     * Merges connection options with connection parameters
     * This method can be overriden in child classes.
     *
     * @param options connection options
     * @param connection connection parameters to be merged
     * @returns merged connection options.
     */
    protected mergeConnection(options: ConfigParams, connection: ConnectionParams): ConfigParams;
    /**
     * Merges connection options with credential parameters
     * This method can be overriden in child classes.
     *
     * @param options connection options
     * @param credential credential parameters to be merged
     * @returns merged connection options.
     */
    protected mergeCredential(options: ConfigParams, credential: CredentialParams): ConfigParams;
    /**
     * Merges connection options with optional parameters
     * This method can be overriden in child classes.
     *
     * @param options connection options
     * @param parameters optional parameters to be merged
     * @returns merged connection options.
     */
    protected mergeOptional(options: ConfigParams, parameters: ConfigParams): ConfigParams;
    /**
     * Finalize merged options
     * This method can be overriden in child classes.
     *
     * @param options connection options
     * @returns finalized connection options
     */
    protected finalizeOptions(options: ConfigParams): ConfigParams;
}
