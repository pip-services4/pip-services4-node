/** @module connect */
import { ConfigParams } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { ConnectionParams } from './ConnectionParams';
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
 *     - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
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
 * - <code>\*:discovery:\*:\*:1.0</code>    (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connections
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
export declare class ConnectionResolver {
    private readonly _connections;
    private _references;
    /**
     * Creates a new instance of connection resolver.
     *
     * @param config        (optional) component configuration parameters
     * @param references    (optional) component references
     */
    constructor(config?: ConfigParams, references?: IReferences);
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
     * Gets all connections configured in component configuration.
     *
     * Redirect to Discovery services is not done at this point.
     * If you need fully fleshed connection use [[resolve]] method instead.
     *
     * @returns a list with connection parameters
     */
    getAll(): ConnectionParams[];
    /**
     * Adds a new connection to component connections
     *
     * @param connection    new connection parameters to be added
     */
    add(connection: ConnectionParams): void;
    private resolveInDiscovery;
    /**
     * Resolves a single component connection. If connections are configured to be retrieved
     * from Discovery service it finds a [[IDiscovery]] and resolves the connection there.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @returns                 a found connection parameters or <code>null</code> otherwise
     *
     * @see [[IDiscovery]]
     */
    resolve(correlationId: string): Promise<ConnectionParams>;
    private resolveAllInDiscovery;
    /**
     * Resolves all component connection. If connections are configured to be retrieved
     * from Discovery service it finds a [[IDiscovery]] and resolves the connection there.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @returns                 all found connection parameters
     *
     * @see [[IDiscovery]]
     */
    resolveAll(correlationId: string): Promise<ConnectionParams[]>;
    private registerInDiscovery;
    /**
     * Registers the given connection in all referenced discovery services.
     * This method can be used for dynamic service discovery.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param connection        a connection to register.
     * @returns 			    the registered connection parameters.
     *
     * @see [[IDiscovery]]
     */
    register(correlationId: string, connection: ConnectionParams): Promise<void>;
}
