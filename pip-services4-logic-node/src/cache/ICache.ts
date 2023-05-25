/** @module cache */

/**
 * Interface for caches that are used to cache values to improve performance.
 */
export interface ICache {
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
