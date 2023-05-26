/** @module cache */
import { IContext } from 'pip-services4-components-node';
import { IReconfigurable } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { ICache } from './ICache';
/**
 * Cache that stores values in the process memory.
 *
 * Remember: This implementation is not suitable for synchronization of distributed processes.
 *
 * ### Configuration parameters ###
 *
 * __options:__
 * - timeout:               default caching timeout in milliseconds (default: 1 minute)
 * - max_size:              maximum number of values stored in this cache (default: 1000)
 *
 * @see [[ICache]]
 *
 * ### Example ###
 *
 *     let cache = new MemoryCache();
 *
 *     await cache.store("123", "key1", "ABC");
 *     ...
 *     let value = await cache.retrieve("123", "key1");
 *     // Result: "ABC"
 *
 */
export declare class MemoryCache implements ICache, IReconfigurable {
    private _cache;
    private _count;
    private _timeout;
    private _maxSize;
    /**
     * Creates a new instance of the cache.
     */
    constructor();
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Clears component state.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    private cleanup;
    /**
     * Retrieves cached value from the cache using its key.
     * If value is missing in the cache or expired it returns null.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique value key.
     * @returns                 the cached value or <code>null</code> if value wasn't found.
     */
    retrieve(context: IContext, key: string): Promise<any>;
    /**
     * Stores value in the cache with expiration time.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique value key.
     * @param value             a value to store.
     * @param timeout           expiration timeout in milliseconds.
     * @returns                 The value that was stored in the cache.
     */
    store(context: IContext, key: string, value: any, timeout: number): Promise<any>;
    /**
     * Removes a value from the cache by its key.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique value key.
     */
    remove(context: IContext, key: string): Promise<void>;
}
