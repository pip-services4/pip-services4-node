/** @module build */
import { Factory } from 'pip-services4-components-node';
/**
 * Creates Redis components by their descriptors.
 *
 * @see [[RedisCache]]
 * @see [[RedisLock]]
 */
export declare class DefaultRedisFactory extends Factory {
    private static readonly RedisCacheDescriptor;
    private static readonly RedisLockDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
