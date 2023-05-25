/** @module connect */
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { ConfigException } from 'pip-services4-commons-node';
import { ConnectionResolver } from 'pip-services4-components-node';
import { CredentialResolver } from 'pip-services4-components-node';
import { ConnectionParams } from 'pip-services4-components-node';
import { CredentialParams } from 'pip-services4-components-node';

/**
 * Helper class that resolves NATS connection and credential parameters,
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
export class NatsConnectionResolver implements IReferenceable, IConfigurable {
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
                context,
                "NO_CONNECTION",
                "NATS connection is not set"
            );
        }

        let uri = connection.getUri();
        if (uri != null) return;

        let protocol = connection.getAsStringWithDefault("protocol", "nats");
        if (protocol == null) {
            throw new ConfigException(
                context,
                "NO_PROTOCOL",
                "Connection protocol is not set"
            );
        }
        if (protocol != "nats") {
            throw new ConfigException(
                context,
                "UNSUPPORTED_PROTOCOL",
                "The protocol "+protocol+" is not supported"
            );
        }

        let host = connection.getHost();
        if (host == null) {
            throw new ConfigException(
                context,
                "NO_HOST",
                "Connection host is not set"
            );
        }

        let port = connection.getAsIntegerWithDefault("protocol", 4222);
        if (port == 0) {
            throw new ConfigException(
                context,
                "NO_PORT",
                "Connection port is not set"
            );
        }
    }

    private parseUri(value: string, options: ConfigParams): void {
        if (value == null) return null;

        let servers = "";
        let uris = value.split(",");
        for (let uri of uris) {
            uri = uri.trim();
            
            let pos = uri.indexOf("?");
            uri = pos >= 0 ? uri.substring(0, pos) : uri;

            pos = uri.indexOf("://");
            uri = pos >= 0 ? uri.substring(pos + 3) : uri;

            pos = uri.indexOf("@");

            let server = pos > 0 ? uri.substring(pos + 1) : uri;
            if (servers != "") {
                servers += ",";
            }
            servers += server;

            if (pos > 0) {
                let namePass = uri.substring(0, pos);
                pos = namePass.indexOf(":");
                let name = pos > 0 ? namePass.substring(0, pos) : namePass;
                let pass = pos > 0 ? namePass.substring(pos + 1) : "";
                options.setAsObject("username", name);
                options.setAsObject("password", pass);
            }
        }

        options.setAsObject("servers", servers);
    }

    private composeOptions(connections: ConnectionParams[], credential: CredentialParams): any {
        // Define additional parameters parameters
        if (credential == null) {
            credential = new CredentialParams();
        }

        // Contruct options and copy over credentials
        let options = new ConfigParams();
        options = options.setDefaults(credential);

        let globalUri = "";
        let servers = "";

        // Process connections, find or constract uri
        for (let connection of connections) {
            if (globalUri != "") {
                continue;
            }

            let uri = connection.getUri()
            if (uri != null) {
                globalUri = uri;
                continue;
            }

            if (servers != "") {
                servers += ",";
            }

            let host = connection.getHost();
            servers += host;

            let port = connection.getAsIntegerWithDefault("port", 4222);
            servers += ":" + port;
        }

        // Set connection uri
        if (globalUri != "") {
            this.parseUri(globalUri, options);
        } else {
            options.setAsObject("servers", servers);
        }

        return options
    }

    /**
     * Resolves NATS connection options from connection and credential parameters.
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @returns resolved NATS connection options.
     */
    public async resolve(context: IContext): Promise<any> {
        let connections = await this._connectionResolver.resolveAll(context);
        // Validate connections
        for (let connection of connections) {
            this.validateConnection(context, connection);
        }

        let credential = await this._credentialResolver.lookup(context);
        // Credentials are not validated right now

        let options = this.composeOptions(connections, credential);
        return options;
    }

    /**
     * Composes NATS connection options from connection and credential parameters.
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param connections        connection parameters
     * @param credential        credential parameters
     * @returns resolved NATS connection options.
     */
    public async compose(context: IContext, connections: ConnectionParams[], credential: CredentialParams): Promise<any> {
        // Validate connections
        for (let connection of connections) {
            this.validateConnection(context, connection);
        }

        let options = this.composeOptions(connections, credential);
        return options;
    }
}
