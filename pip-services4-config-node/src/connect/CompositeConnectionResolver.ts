/** @module connect */

import { ContextResolver, IContext } from 'pip-services4-components-node';
import { IReferenceable } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { IConfigurable } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';

import { CredentialParams } from '../auth/CredentialParams';
import { CredentialResolver } from '../auth/CredentialResolver';
import { ConnectionParams } from './ConnectionParams';
import { ConnectionResolver } from './ConnectionResolver';
import { ConfigException } from 'pip-services4-commons-node';

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
export class CompositeConnectionResolver implements IReferenceable, IConfigurable {
    /**
     * The connection options
     */
    protected _options: ConfigParams;

    /** 
     * The connections resolver.
     */
    protected _connectionResolver: ConnectionResolver = new ConnectionResolver();

    /** 
     * The credentials resolver.
     */
    protected _credentialResolver: CredentialResolver = new CredentialResolver();

    /**
     * The cluster support (multiple connections)
     */
    protected _clusterSupported = true;

    /**
     * The default protocol
     */
    protected _defaultProtocol: string = null;

    /**
     * The default port number
     */
    protected _defaultPort = 0;

    /**
     * The list of supported protocols
     */
    protected _supportedProtocols: string[] = null;

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._connectionResolver.configure(config);
        this._credentialResolver.configure(config);
        this._options = config.getSection("options");
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
     * Resolves connection options from connection and credential parameters.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @returns resolved options.
     */
     public async resolve(context: IContext): Promise<ConfigParams> {
        // Todo: Why Promise.all returns promises instead of resolved values??
        // let [connections, credential] = await Promise.all([
        //     async () => {
                let connections = await this._connectionResolver.resolveAll(context);
                connections = connections || [];

                // Validate if cluster (multiple connections) is supported
                if (connections.length > 0 && !this._clusterSupported) {
                    throw new ConfigException(
                        context != null ? ContextResolver.getTraceId(context) : null, 
                        "MULTIPLE_CONNECTIONS_NOT_SUPPORTED",
                        "Multiple (cluster) connections are not supported"
                    );
                }

                for (const connection of connections) {
                    this.validateConnection(context, connection);
                }

            //     return connections;
            // },
            // async () => {
                let credential = await this._credentialResolver.lookup(context);
                credential = credential || new CredentialParams();

                // Validate credential
                this.validateCredential(context, credential);

        //         return credential;
        //     }
        // ]);

        return this.composeOptions(connections, credential, this._options);
    }

    /**
     * Composes Composite connection options from connection and credential parameters.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param connections        connection parameters
     * @param credential        credential parameters
     * @param parameters        optional parameters
     * @returns 			    resolved options.
     */
    public compose(context: IContext, connections: ConnectionParams[], credential: CredentialParams,
        parameters: ConfigParams): ConfigParams {

        // Validate connection parameters
        for (const connection of connections) {
            this.validateConnection(context, connection);
        }

        // Validate credential parameters
        this.validateCredential(context, credential);

        // Compose final options
        return this.composeOptions(connections, credential, parameters);
    }

    /**
     * Validates connection parameters and throws an exception on error.
     * This method can be overriden in child classes.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param connection connection parameters to be validated
     */
    protected validateConnection(context: IContext, connection: ConnectionParams): void {
        if (connection == null) {
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "NO_CONNECTION",
                "Connection parameters are not set is not set"
            );
        }

        // URI usually contains all information
        const uri = connection.getUri();
        if (uri != null) {
            return;
        }

        const protocol = connection.getProtocolWithDefault(this._defaultProtocol);
        if (protocol == null) {
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "NO_PROTOCOL",
                "Connection protocol is not set"
            );
        }
        if (this._supportedProtocols != null && this._supportedProtocols.indexOf(protocol) < 0) {
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "UNSUPPORTED_PROTOCOL",
                "The protocol "+protocol+" is not supported"
            );
        }

        const host = connection.getHost();
        if (host == null) {
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "NO_HOST",
                "Connection host is not set"
            );
        }

        const port = connection.getPortWithDefault(this._defaultPort);
        if (port == 0) {
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "NO_PORT",
                "Connection port is not set"
            );
        }
    }

    /**
     * Validates credential parameters and throws an exception on error.
     * This method can be overriden in child classes.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param credential  credential parameters to be validated
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected validateCredential(context: IContext, credential: CredentialParams): void {
        // By default the rules are open
    }

    /**
     * Composes connection and credential parameters into connection options.
     * This method can be overriden in child classes.
     * 
     * @param connections a list of connection parameters
     * @param credential credential parameters
     * @param parameters optional parameters
     * @returns a composed connection options.
     */
    protected composeOptions(connections: ConnectionParams[], credential: CredentialParams,
        parameters: ConfigParams): ConfigParams {
        
        // Connection options
        let options = new ConfigParams();

        // Merge connection parameters
        for (const connection of connections) {
            options = this.mergeConnection(options, connection);
        }

        // Merge credential parameters
        options = this.mergeCredential(options, credential);

        // Merge optional parameters
        options = this.mergeOptional(options, parameters);

        // Perform final processing
        options = this.finalizeOptions(options)

        return options
    }

    /**
     * Merges connection options with connection parameters
     * This method can be overriden in child classes.
     * 
     * @param options connection options
     * @param connection connection parameters to be merged
     * @returns merged connection options.
     */
    protected mergeConnection(options: ConfigParams, connection: ConnectionParams): ConfigParams {
        const mergedOptions = options.setDefaults(connection);
        return mergedOptions;
    }

    /**
     * Merges connection options with credential parameters
     * This method can be overriden in child classes.
     * 
     * @param options connection options
     * @param credential credential parameters to be merged
     * @returns merged connection options.
     */
    protected mergeCredential(options: ConfigParams, credential: CredentialParams): ConfigParams {
        const mergedOptions = options.override(credential);
        return mergedOptions;
    }

    /**
     * Merges connection options with optional parameters
     * This method can be overriden in child classes.
     * 
     * @param options connection options
     * @param parameters optional parameters to be merged
     * @returns merged connection options.
     */
     protected mergeOptional(options: ConfigParams, parameters: ConfigParams): ConfigParams {
        const mergedOptions = options.setDefaults(parameters);
        return mergedOptions;
    }

    /**
     * Finalize merged options
     * This method can be overriden in child classes.
     * 
     * @param options connection options
     * @returns finalized connection options
     */
    protected finalizeOptions(options: ConfigParams): ConfigParams {
        return options;
    }

}
