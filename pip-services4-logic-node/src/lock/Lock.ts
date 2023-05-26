/** @module lock */

import { IContext } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { IReconfigurable } from 'pip-services4-components-node';
import { ConflictException } from 'pip-services4-commons-node';

import { ILock } from './ILock';

/**
 * Abstract lock that implements default lock acquisition routine.
 * 
 * ### Configuration parameters ###
 * 
 * - __options:__
 *     - retry_timeout:   timeout in milliseconds to retry lock acquisition. (Default: 100)
 * 
 * @see [[ILock]]
 */
export abstract class Lock implements ILock, IReconfigurable {
    private _retryTimeout: number = 100;

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._retryTimeout = config.getAsIntegerWithDefault("options.retry_timeout", this._retryTimeout);
    }

    /**
     * Makes a single attempt to acquire a lock by its key.
     * It returns immediately a positive or negative result.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique lock key to acquire.
     * @param ttl               a lock timeout (time to live) in milliseconds.
     * @returns                 <code>true</code> if the lock was acquired and <code>false</code> otherwise.
     */
    public abstract tryAcquireLock(context: IContext, key: string, ttl: number): Promise<boolean>;


    /**
     * Releases prevously acquired lock by its key.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique lock key to release.
     */
    public abstract releaseLock(context: IContext, key: string): Promise<void>;
        
    /**
     * Makes multiple attempts to acquire a lock by its key within give time interval.
     * 
     * @param context     (optional) a context to trace execution through call chain. 
     * @param key               a unique lock key to acquire.
     * @param ttl               a lock timeout (time to live) in milliseconds.
     * @param timeout           a lock acquisition timeout.
     */
    public async acquireLock(context: IContext, key: string, ttl: number, timeout: number): Promise<void> {
        let retryTime = new Date().getTime() + timeout;

        // Try to get lock first
        let ok = await this.tryAcquireLock(context, key, ttl);
        if (ok) {
            return;
        }

        // Start retrying
        while (!ok) {
            // Sleep for a while...
            await new Promise(request => setTimeout(request, this._retryTimeout));

            // When timeout expires return false
            let now = new Date().getTime();
            if (now > retryTime) {
                throw new ConflictException(
                    context,
                    "LOCK_TIMEOUT",
                    "Acquiring lock " + key + " failed on timeout"
                ).withDetails("key", key);
            }

            ok = await this.tryAcquireLock(context, key, ttl);
        }
    }
}