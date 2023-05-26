/** @module cache */
import { Factory } from 'pip-services4-components-node';
/**
 * Creates business logic components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[ICache]]
 * @see [[MemoryCache]]
 * @see [[NullCache]]
 */
export declare class DefaultLogicFactory extends Factory {
    private static readonly Descriptor;
    private static readonly NullCacheDescriptor;
    private static readonly MemoryCacheDescriptor;
    private static readonly NullLockDescriptor;
    private static readonly MemoryLockDescriptor;
    private static readonly NullStateStoreDescriptor;
    private static readonly MemoryStateStoreDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
