/** @module connect */

import { ConfigException } from "pip-services4-commons-node";
import { IReferenceable, IConfigurable, ConfigParams, IReferences, IContext, ContextResolver } from "pip-services4-components-node";
import { CredentialParams, CredentialResolver } from "pip-services4-config-node";
import { ConnectionResolver, ConnectionParams } from "pip-services4-config-node/obj/src/connect";

/**
 * Helper class that resolves RabbitMQ connection and credential parameters,
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
export class RabbitMQConnectionResolver implements IReferenceable, IConfigurable {
    /** 
     * The connections resolver.
     */
    protected _connectionResolver: ConnectionResolver = new ConnectionResolver();
    /** 
     * The credentials resolver.
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

    private validateConnection(context: IContext, connection: ConnectionParams): void {
        if (connection == null) {
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "NO_CONNECTION",
                "RabbitMQ connection is not set"
            );
        }

        const uri = connection.getUri();
        if (uri != null) {
            return null;
        }

        const protocol = connection.getAsStringWithDefault("protocol", "amqp");
        if (protocol == null) {
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "NO_PROTOCOL",
                "Connection protocol is not set"
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

        const port = connection.getAsInteger("port");
        if (port == 0) {
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "NO_PORT",
                "Connection port is not set"
            );
        }

        return;
    }

    private composeOptions(connection: ConnectionParams, credential: CredentialParams): ConfigParams {
        // Define additional parameters parameters
        const options = connection.override(credential);

        // Compose uri
        if (options.getAsString("uri") == null) {
            let credential = "";
            let uri = "";

            const username = options.getAsNullableString('username');
            const password = options.getAsNullableString('password');
            const protocol = connection.getAsStringWithDefault("protocol", 'amqp');
            const host = connection.getHost();
            const port = connection.getAsString("port");

            if (username != null && password != null) {
                credential = username + ":" + password;
            }
            
            if (credential == "") {
                uri = protocol + "://" + host + ":" + port;
            } else {
                uri = protocol + "://" + credential + "@" + host + ":" + port;
            }
            options.setAsObject("uri", uri);
        }

        return options;
    }

    /**
     * Resolves RabbitMQ connection options from connection and credential parameters.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @returns resolved RabbitMQ connection options.
     */
    public async resolve(context: IContext): Promise<any> {
        const connection = await this._connectionResolver.resolve(context);
        // Validate connections
        this.validateConnection(context, connection);

        const credential = await this._credentialResolver.lookup(context);
        // Credentials are not validated right now

        const options = this.composeOptions(connection, credential);
        return options;
    }

    /**
     * Composes RabbitMQ connection options from connection and credential parameters.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param connection        connection parameters
     * @param credential        credential parameters
     * @returns resolved RabbitMQ connection options.
     */
    public compose(context: IContext, connection: ConnectionParams, credential: CredentialParams): ConfigParams {
        // Validate connections
        this.validateConnection(context, connection);

        const options = this.composeOptions(connection, credential);
        return options;
    }
}
