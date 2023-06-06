/** @module lock */
import { IConfigurable, IReferenceable, IOpenable, ConfigParams, IReferences, IContext } from "pip-services4-components-node";
import { Lock } from "pip-services4-logic-node";
/**
 * Distributed lock that is implemented based on Redis in-memory database.
 *
 * ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 * - credential(s):
 *   - store_key:             key to retrieve parameters from credential store
 *   - username:              user name (currently is not used)
 *   - password:              user password
 * - options:
 *   - retry_timeout:         timeout in milliseconds to retry lock acquisition. (Default: 100)
 *   - retries:               number of retries (default: 3)
 *
 * ### References ###
 *
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credential
 *
 * ### Example ###
 *
 *     let lock = new RedisRedis();
 *     lock.configure(ConfigParams.fromTuples(
 *       "host", "localhost",
 *       "port", 6379
 *     ));
 *
 *     lock.open("123");
 *
 *     await lock.acquire("123", "key1");
 *     try {
 *       // Processing...
 *     } finally {
 *       await lock.releaseLock("123", "key1");
 *     }
 */
export declare class RedisLock extends Lock implements IConfigurable, IReferenceable, IOpenable {
    private _connectionResolver;
    private _credentialResolver;
    private _lock;
    private _timeout;
    private _retries;
    private _client;
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
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen(): boolean;
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context: IContext): Promise<void>;
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    close(context: IContext): Promise<void>;
    private checkOpened;
    private retryStrategy;
    /**
     * Makes a single attempt to acquire a lock by its key.
     * It returns immediately a positive or negative result.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique lock key to acquire.
     * @param ttl               a lock timeout (time to live) in milliseconds.
     * @returns <code>true</code> if lock was successfully acquired and <code>false</code> otherwise.
     */
    tryAcquireLock(context: IContext, key: string, ttl: number): Promise<boolean>;
    /**
     * Releases prevously acquired lock by its key.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique lock key to release.
     */
    releaseLock(context: IContext, key: string): Promise<void>;
}
