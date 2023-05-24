/** @module connect */
import { ConnectionParams } from './ConnectionParams';
/**
 * Interface for discovery services which are used to store and resolve connection parameters
 * to connect to external services.
 *
 * @see [[ConnectionParams]]
 * @see [[CredentialParams]]
 */
export interface IDiscovery {
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
