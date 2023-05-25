import { IContext } from 'pip-services4-components-node';
import { IReferenceable } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { IConfigurable } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { ConnectionResolver } from './ConnectionResolver';
import { CredentialResolver } from '../auth/CredentialResolver';
/**
 * Helper class to retrieve connections for HTTP-based services abd clients.
 *
 * In addition to regular functions of ConnectionResolver is able to parse http:// URIs
 * and validate connection parameters before returning them.
 *
 * ### Configuration parameters ###
 *
 * - connection:
 *   - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - ...                          other connection parameters
 *
 * - connections:                   alternative to connection
 *   - [connection params 1]:       first connection parameters
 *   -  ...
 *   - [connection params N]:       Nth connection parameters
 *   -  ...
 *
 * ### References ###
 *
 * - <code>\*:discovery:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/connect.connectionparams.html ConnectionParams]]
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/connect.connectionresolver.html ConnectionResolver]]
 *
 * ### Example ###
 *
 *     let config = ConfigParams.fromTuples(
 *          "connection.host", "10.1.1.100",
 *          "connection.port", 8080
 *     );
 *
 *     let connectionResolver = new HttpConnectionResolver();
 *     connectionResolver.configure(config);
 *     connectionResolver.setReferences(references);
 *
 *     let connection = await connectionResolver.resolve("123");
 *     // Now use connection...
 */
export declare class HttpConnectionResolver implements IReferenceable, IConfigurable {
    /**
     * The base connection resolver.
     */
    protected _connectionResolver: ConnectionResolver;
    /**
     * The base credential resolver.
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
    private composeConnection;
    /**
     * Resolves a single component connection. If connections are configured to be retrieved
     * from Discovery service it finds a IDiscovery and resolves the connection there.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @returns 			    a resolved connection options
     */
    resolve(context: IContext): Promise<ConfigParams>;
    /**
     * Resolves all component connection. If connections are configured to be retrieved
     * from Discovery service it finds a IDiscovery and resolves the connection there.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @returns 			    a resolved connection options
     */
    resolveAll(context: IContext): Promise<ConfigParams>;
    /**
     * Registers the given connection in all referenced discovery services.
     * This method can be used for dynamic service discovery.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param connection        a connection to register.
     */
    register(context: IContext): Promise<void>;
}
