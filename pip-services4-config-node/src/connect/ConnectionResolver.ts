/** @module connect */

import { IContext } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { ReferenceException } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-components-node';

import { ConnectionParams } from './ConnectionParams';
import { IDiscovery } from './IDiscovery';

/**
 * Helper class to retrieve component connections.
 * 
 * If connections are configured to be retrieved from [[IDiscovery]],
 * it automatically locates [[IDiscovery]] in component references
 * and retrieve connections from there using discovery_key parameter.
 * 
 * ### Configuration parameters ###
 * 
 * - __connection:__  
 *     - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-config-node/interfaces/connect.idiscovery.html IDiscovery]]
 *     - ...                          other connection parameters
 * 
 * - __connections:__                  alternative to connection
 *     - [connection params 1]:       first connection parameters
 *         - ...                      connection parameters for key 1
 *     - [connection params N]:       Nth connection parameters
 *         - ...                      connection parameters for key N
 * 
 * ### References ###
 * 
 * - <code>\*:discovery:\*:\*:1.0</code>    (optional) [[https://pip-services4-node.github.io/pip-services4-config-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connections
 * 
 * @see [[ConnectionParams]]
 * @see [[IDiscovery]]
 * 
 * ### Example ###
 * 
 *     let config = ConfigParams.fromTuples(
 *         "connection.host", "10.1.1.100",
 *         "connection.port", 8080
 *     );
 *     
 *     let connectionResolver = new ConnectionResolver();
 *     connectionResolver.configure(config);
 *     connectionResolver.setReferences(references);
 *     
 *     let connection = await connectionResolver.resolve("123");
 *     // Now use connection...
 *     
 */
export class ConnectionResolver {
    private readonly _connections: ConnectionParams[] = [];
    private _references: IReferences = null;

    /**
     * Creates a new instance of connection resolver.
     * 
     * @param config        (optional) component configuration parameters
     * @param references    (optional) component references
     */
    public constructor(config: ConfigParams = null, references: IReferences = null) {
        if (config != null) {
            this.configure(config);
        }
        if (references != null) {
            this.setReferences(references);
        }
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        let connections: ConnectionParams[] = ConnectionParams.manyFromConfig(config);
        this._connections.push(...connections);
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._references = references;
    }

    /**
     * Gets all connections configured in component configuration.
     * 
     * Redirect to Discovery services is not done at this point.
     * If you need fully fleshed connection use [[resolve]] method instead.
     * 
     * @returns a list with connection parameters
     */
    public getAll(): ConnectionParams[] {
        return this._connections;
    }

    /**
     * Adds a new connection to component connections
     * 
     * @param connection    new connection parameters to be added
     */
    public add(connection: ConnectionParams): void {
        this._connections.push(connection);
    }

    private async resolveInDiscovery(context: IContext, connection: ConnectionParams): Promise<ConnectionParams> {
        if (!connection.useDiscovery()) {
            return null;
        }

        let key: string = connection.getDiscoveryKey();
        if (this._references == null) {
            return null;
        }

        let discoveryDescriptor = new Descriptor("*", "discovery", "*", "*", "*")
        let discoveries: any[] = this._references.getOptional<any>(discoveryDescriptor)
        if (discoveries.length == 0) {
            throw new ReferenceException(context, discoveryDescriptor);
        }

        for (let discovery of discoveries) {
            let discoveryTyped: IDiscovery = discovery;
            let result = await discoveryTyped.resolveOne(context, key);
            if (result != null) {
                return result;
            }
        }

        return null
    }

    /**
     * Resolves a single component connection. If connections are configured to be retrieved
     * from Discovery service it finds a [[IDiscovery]] and resolves the connection there.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @returns                 a found connection parameters or <code>null</code> otherwise
     * 
     * @see [[IDiscovery]]
     */
    public async resolve(context: IContext): Promise<ConnectionParams> {
        if (this._connections.length == 0) {
            return null;
        }

        let connections: ConnectionParams[] = [];

        for (let connection of this._connections) {
            if (!connection.useDiscovery()) {
                return connection;  //If a connection is not configured for discovery use - return it.
            } else {
                connections.push(connection);  //Otherwise, add it to the list of connections to resolve.
            }
        }

        if (connections.length == 0) {
            return null;
        }

        let resolved: ConnectionParams = null;
        for (let connection of connections) {
            let result = await this.resolveInDiscovery(context, connection);
            if (result != null) {
                resolved = new ConnectionParams(ConfigParams.mergeConfigs(connection, result));
            }
        }
        return resolved;
    }

    private async resolveAllInDiscovery(context: IContext, connection: ConnectionParams): Promise<ConnectionParams[]> {
        let resolved: ConnectionParams[] = [];
        let key: string = connection.getDiscoveryKey();

        if (!connection.useDiscovery()) {
            return [];
        }

        if (this._references == null) {
            return [];
        }

        let discoveryDescriptor = new Descriptor("*", "discovery", "*", "*", "*")
        let discoveries: any[] = this._references.getOptional<any>(discoveryDescriptor)
        if (discoveries.length == 0) {
            throw new ReferenceException(context, discoveryDescriptor);
        }

        for (let discovery of discoveries) {
            let discoveryTyped: IDiscovery = discovery;
            let result = await discoveryTyped.resolveAll(context, key);
            if (result != null) {
                resolved = resolved.concat(result);
            }
        }

        return resolved;
    }

    /**
     * Resolves all component connection. If connections are configured to be retrieved
     * from Discovery service it finds a [[IDiscovery]] and resolves the connection there.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @returns                 all found connection parameters
     * 
     * @see [[IDiscovery]]
     */
    public async resolveAll(context: IContext): Promise<ConnectionParams[]> {
        let resolved: ConnectionParams[] = [];
        let toResolve: ConnectionParams[] = [];

        for (let connection of this._connections) {
            if (connection.useDiscovery())
                toResolve.push(connection);
            else
                resolved.push(connection);
        }

        if (toResolve.length <= 0) {
            return resolved;
        }

        for (let connection of toResolve) {
            let result = await this.resolveAllInDiscovery(context, connection);
            if (result != null) {
                for (let index = 0; index < result.length; index++) {
                    let localResolvedConnection: ConnectionParams = new ConnectionParams(ConfigParams.mergeConfigs(connection, result[index]));
                    resolved.push(localResolvedConnection);
                }
            }
        }

        return resolved;
    }

    private async registerInDiscovery(context: IContext, connection: ConnectionParams): Promise<boolean> {
        if (!connection.useDiscovery()) {
            return false;
        }

        let key = connection.getDiscoveryKey();
        if (this._references == null) {
            return false;
        }

        let discoveries = this._references.getOptional<IDiscovery>(new Descriptor("*", "discovery", "*", "*", "*"));
        if (discoveries == null) {
            return false;
        }

        for (let discovery of discoveries) {
            await discovery.register(context, key, connection);
        }

        return true;
    }

    /**
     * Registers the given connection in all referenced discovery services.
     * This method can be used for dynamic service discovery.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param connection        a connection to register.
     * @returns 			    the registered connection parameters.
     * 
     * @see [[IDiscovery]]
     */
    public async register(context: IContext, connection: ConnectionParams): Promise<void> {
        let ok = await this.registerInDiscovery(context, connection);
        if (ok) {
            this._connections.push(connection);
        }
    }

}