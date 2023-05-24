/** @module connect */
import { ConfigParams } from 'pip-services4-commons-node';
import { IReconfigurable } from 'pip-services4-commons-node';
import { ConnectionParams } from './ConnectionParams';
import { IDiscovery } from './IDiscovery';
/**
 * Discovery service that keeps connections in memory.
 *
 * ### Configuration parameters ###
 *
 * - [connection key 1]:
 *     - ...                          connection parameters for key 1
 * - [connection key 2]:
 *     - ...                          connection parameters for key N
 *
 * @see [[IDiscovery]]
 * @see [[ConnectionParams]]
 *
 * ### Example ###
 *
 *     let config = ConfigParams.fromTuples(
 *         "key1.host", "10.1.1.100",
 *         "key1.port", "8080",
 *         "key2.host", "10.1.1.100",
 *         "key2.port", "8082"
 *     );
 *
 *     let discovery = new MemoryDiscovery();
 *     discovery.readConnections(config);
 *
 *     let connection = await discovery.resolve("123", "key1");
 *     // Result: host=10.1.1.100;port=8080
 *
 */
export declare class MemoryDiscovery implements IDiscovery, IReconfigurable {
    protected _items: Map<string, ConnectionParams[]>;
    /**
     * Creates a new instance of discovery service.
     *
     * @param config    (optional) configuration with connection parameters.
     */
    constructor(config?: ConfigParams);
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Reads connections from configuration parameters.
     * Each section represents an individual Connectionparams
     *
     * @param config   configuration parameters to be read
     */
    readConnections(config: ConfigParams): void;
    /**
     * Registers connection parameters into the discovery service.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a key to uniquely identify the connection parameters.
     * @param credential        a connection to be registered.
     * @returns 			    the registered connection parameters.
     */
    register(correlationId: string, key: string, connection: ConnectionParams): Promise<ConnectionParams>;
    /**
     * Resolves a single connection parameters by its key.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a key to uniquely identify the connection.
     * @returns                 a found connection parameters or <code>null</code> otherwise
     */
    resolveOne(correlationId: string, key: string): Promise<ConnectionParams>;
    /**
     * Resolves all connection parameters by their key.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a key to uniquely identify the connections.
     * @returns                 all found connection parameters
     */
    resolveAll(correlationId: string, key: string): Promise<ConnectionParams[]>;
}
