/** @module connect */

import { IContext } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { IReconfigurable } from 'pip-services4-components-node';

import { ConnectionParams } from './ConnectionParams';
import { IDiscovery } from './IDiscovery';

/**
 * Used to store key-identifiable information about connections.
 */
class DiscoveryItem {
    public key: string;
    public connection: ConnectionParams;
}

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
 *     discovery.configure(config);
 *     
 *     let connection = await discovery.resolveOne("123", "key1");
 *     // Result: host=10.1.1.100;port=8080
 *     
 */
export class MemoryDiscovery implements IDiscovery, IReconfigurable {
    protected _items: Map<string, ConnectionParams[]> = new Map();

    /**
     * Creates a new instance of discovery service.
     * 
     * @param config    (optional) configuration with connection parameters.
     */
    public constructor(config: ConfigParams = null) {
        if (config != null) {
            this.readConnections(config);
        }
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
    }

    /**
     * Reads connections from configuration parameters.
     * Each section represents an individual Connectionparams
     * 
     * @param config   configuration parameters to be read
     */
    public readConnections(config: ConfigParams) {
        this._items.clear();

        if (config.length() > 0) {
            let connectionSections: string[] = config.getSectionNames();
            for (let index = 0; index < connectionSections.length; index++) {
                let key = connectionSections[index]
                let value: ConfigParams = config.getSection(key);

                let connectionsList = this._items.get(key) ?? [];
                connectionsList.push(new ConnectionParams(value));
                this._items.set(key, connectionsList);
            }
        }
    }

    /**
     * Registers connection parameters into the discovery service.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the connection parameters.
     * @param credential        a connection to be registered.
     * @returns 			    the registered connection parameters.
     */
    public async register(context: IContext, key: string, connection: ConnectionParams): Promise<ConnectionParams> {
        let connectionsList = this._items.get(key) ?? [];
        connectionsList.push(new ConnectionParams(connection));
        this._items.set(key, connectionsList);

        return connection;
    }

    /**
     * Resolves a single connection parameters by its key.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the connection.
     * @returns                 a found connection parameters or <code>null</code> otherwise
     */
    public async resolveOne(context: IContext, key: string): Promise<ConnectionParams> {
        let connection: ConnectionParams = null;
        let connections = this._items.get(key) ?? [];
        
        if (connections.length > 0) 
            connection = connections[0];

        return connection;
    }

    /**
     * Resolves all connection parameters by their key.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the connections.
     * @returns                 all found connection parameters
     */
    public async resolveAll(context: IContext, key: string): Promise<ConnectionParams[]> {
        let connections: ConnectionParams[] = this._items.get(key) ?? [];
        
        return connections.filter(c => c != null);
    }
}