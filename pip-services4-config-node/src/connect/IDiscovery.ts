/** @module connect */

import { IContext } from 'pip-services4-components-node';

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
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the connection parameters.
     * @param credential        a connection to be registered.
     * @returns 			    the registered connection parameters.
     */
    register(context: IContext, key: string, connection: ConnectionParams): Promise<ConnectionParams>;

    /**
     * Resolves a single connection parameters by its key.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the connection.
     * @returns                 a found connection parameters or <code>null</code> otherwise
     */
    resolveOne(context: IContext, key: string): Promise<ConnectionParams>;

    /**
     * Resolves all connection parameters by their key.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the connections.
     * @returns                 all found connection parameters
     */
    resolveAll(context: IContext, key: string): Promise<ConnectionParams[]>;
}