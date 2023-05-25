/** @module cache */
import { ConfigParams } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { IReferenceable } from 'pip-services4-commons-node';
import { IOpenable } from 'pip-services4-commons-node';
import { ICache } from 'pip-services4-components-node';
/**
 * Distributed cache that stores values in Redis in-memory database.
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
 *   - retries:               number of retries (default: 3)
 *   - timeout:               default caching timeout in milliseconds (default: 1 minute)
 *   - max_size:              maximum number of values stored in this cache (default: 1000)
 *
 * ### References ###
 *
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credential
 *
 * ### Example ###
 *
 *     let cache = new RedisCache();
 *     cache.configure(ConfigParams.fromTuples(
 *       "host", "localhost",
 *       "port", 6379
 *     ));
 *
 *     await cache.open("123");
 *
 *     await cache.store("123", "key1", "ABC");
 *     let value = await cache.store("123", "key1"); // Result: "ABC"
 */
export declare class RedisCache implements ICache, IConfigurable, IReferenceable, IOpenable {
    private _connectionResolver;
    private _credentialResolver;
    private _timeout;
    private _retries;
    private _client;
    /**
     * Creates a new instance of this cache.
     */
    constructor();
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
     * Retrieves cached value from the cache using its key.
     * If value is missing in the cache or expired it returns null.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param key               a unique value key.
     * @returns a retrieve cached value or <code>null</code> if nothing was found.
     */
    retrieve(context: IContext, key: string): Promise<any>;
    /**
     * Stores value in the cache with expiration time.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param key               a unique value key.
     * @param value             a value to store.
     * @param timeout           expiration timeout in milliseconds.
     * @returns the stored value.
     */
    store(context: IContext, key: string, value: any, timeout: number): Promise<any>;
    /**
     * Removes a value from the cache by its key.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param key               a unique value key.
     * @returns the removed value.
     */
    remove(context: IContext, key: string): Promise<any>;
}
