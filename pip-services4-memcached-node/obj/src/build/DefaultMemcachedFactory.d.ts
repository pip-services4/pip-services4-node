/** @module build */
import { Factory } from 'pip-services4-components-node';
/**
 * Creates Redis components by their descriptors.
 *
 * @see [[MemcachedCache]]
 * @see [[MemcachedLock]]
 */
export declare class DefaultMemcachedFactory extends Factory {
    private static readonly MemcachedCacheDescriptor;
    private static readonly MemcachedLockDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
