/** @module lock */
import { IContext } from 'pip-services4-components-node';
/**
 * Interface for locks to synchronize work or parallel processes and to prevent collisions.
 *
 * The lock allows to manage multiple locks identified by unique keys.
 */
export interface ILock {
    /**
     * Makes a single attempt to acquire a lock by its key.
     * It returns immediately a positive or negative result.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique lock key to acquire.
     * @param ttl               a lock timeout (time to live) in milliseconds.
     * @returns                 <code>true</code> if the lock was acquired and <code>false</code> otherwise.
     */
    tryAcquireLock(context: IContext, key: string, ttl: number): Promise<boolean>;
    /**
     * Makes multiple attempts to acquire a lock by its key within give time interval.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique lock key to acquire.
     * @param ttl               a lock timeout (time to live) in milliseconds.
     * @param timeout           a lock acquisition timeout.
     */
    acquireLock(context: IContext, key: string, ttl: number, timeout: number): Promise<void>;
    /**
     * Releases prevously acquired lock by its key.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique lock key to release.
     */
    releaseLock(context: IContext, key: string): Promise<void>;
}
