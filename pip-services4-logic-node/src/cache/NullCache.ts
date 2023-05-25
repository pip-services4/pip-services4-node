/** @module cache */
import { ICache } from './ICache';

/**
 * Dummy cache implementation that doesn't do anything.
 * 
 * It can be used in testing or in situations when cache is required
 * but shall be disabled.
 * 
 * @see [[ICache]]
 */
export class NullCache implements ICache {
    /**
     * Retrieves cached value from the cache using its key.
     * If value is missing in the cache or expired it returns null.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a unique value key.
     * @returns                 the cached value or <code>null</code> if value wasn't found.
     */
    public async retrieve(correlationId: string, key: string): Promise<any> {
        return null;
    }

    /**
     * Stores value in the cache with expiration time.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a unique value key.
     * @param value             a value to store.
     * @param timeout           expiration timeout in milliseconds.
     * @returns                 The value that was stored in the cache.
	 */
    public async store(correlationId: string, key: string, value: any, timeout: number): Promise<any> {
        return value;
    }

	/**
     * Removes a value from the cache by its key.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a unique value key.
	 */
    public async remove(correlationId: string, key: string): Promise<void> {
        return null;
    }

}
