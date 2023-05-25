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
export class MemoryLock extends Lock {
    private _locks: { [key: string]: number } = {};

    /**
     * Makes a single attempt to acquire a lock by its key.
     * It returns immediately a positive or negative result.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique lock key to acquire.
     * @param ttl               a lock timeout (time to live) in milliseconds.
     * @returns                 <code>true</code> if the lock was acquired and <code>false</code> otherwise.
     */
    public async tryAcquireLock(context: IContext, key: string, ttl: number): Promise<boolean> {
        let expireTime = this._locks[key];
        let now = new Date().getTime();

        if (expireTime == null || expireTime < now) {
            this._locks[key] = now + ttl;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Releases the lock with the given key.
     * 
     * @param context     not used.
     * @param key               the key of the lock that is to be released.
     */
    public async releaseLock(context: IContext, key: string): Promise<void> {
        delete this._locks[key];
    }
}