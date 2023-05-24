/** @module lock */
import { ILock } from './ILock';
/**
 * Dummy lock implementation that doesn't do anything.
 *
 * It can be used in testing or in situations when lock is required
 * but shall be disabled.
 *
 * @see [[ILock]]
 */
export declare class NullLock implements ILock {
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
     * Makes multiple attempts to acquire a lock by its key within give time interval.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a unique lock key to acquire.
     * @param ttl               a lock timeout (time to live) in milliseconds.
     * @param timeout           a lock acquisition timeout.
     */
    acquireLock(correlationId: string, key: string, ttl: number, timeout: number): Promise<void>;
    /**
     * Releases prevously acquired lock by its key.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a unique lock key to release.
     */
    releaseLock(correlationId: string, key: string): Promise<void>;
}
