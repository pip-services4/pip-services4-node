/** @module lock */
import { Lock } from './Lock';
/**
 * Lock that is used to synchronize execution within one process using shared memory.
 *
 * Remember: This implementation is not suitable for synchronization of distributed processes.
 *
 * ### Configuration parameters ###
 *
 * - __options:__
 *     - retry_timeout:   timeout in milliseconds to retry lock acquisition. (Default: 100)
 *
 * @see [[ILock]]
 * @see [[Lock]]
 *
 * ### Example ###
 *
 *     let lock = new MemoryLock();
 *
 *     await lock.acquire("123", "key1");
 *     try {
 *        // Processing...
 *     } finally {
 *        await lock.releaseLock("123", "key1");
 *     }
 *
 *     // Continue...
 *
 */
export declare class MemoryLock extends Lock {
    private _locks;
    /**
     * Makes a single attempt to acquire a lock by its key.
     * It returns immediately a positive or negative result.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a unique lock key to acquire.
     * @param ttl               a lock timeout (time to live) in milliseconds.
     * @returns                 <code>true</code> if the lock was acquired and <code>false</code> otherwise.
     */
    tryAcquireLock(correlationId: string, key: string, ttl: number): Promise<boolean>;
    /**
     * Releases the lock with the given key.
     *
     * @param correlationId     not used.
     * @param key               the key of the lock that is to be released.
     */
    releaseLock(correlationId: string, key: string): Promise<void>;
}
