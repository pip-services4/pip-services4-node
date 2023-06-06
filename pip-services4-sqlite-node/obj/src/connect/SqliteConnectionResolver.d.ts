/** @module connect */
import { ConnectionResolver, CredentialResolver } from "pip-services4-config-node";
import { IReferenceable, IConfigurable, ConfigParams, IReferences, IContext } from "pip-services4-components-node";
/**
 * Helper class that resolves SQLite connection and credential parameters,
 * validates them and generates a connection URI.
 *
 * It is able to process multiple connections to SQLite cluster nodes.
 *
 *  ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:             (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - database:                  database file path
 *   - uri:                       resource URI with file:// protocol
 *
 * ### References ###
 *
 * - <code>\*:discovery:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code>      (optional) Credential stores to resolve credentials
 */
export declare class SqliteConnectionResolver implements IReferenceable, IConfigurable {
    /**
     * The connections resolver.
     */
    protected _connectionResolver: ConnectionResolver;
    /**
     * The credentials resolver.
     */
    protected _credentialResolver: CredentialResolver;
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
    private validateConnection;
    private validateConnections;
    private composeConfig;
    /**
     * Resolves SQLite connection URI from connection and credential parameters.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @returns 			    a resolved config.
     */
    resolve(context: IContext): Promise<any>;
}
