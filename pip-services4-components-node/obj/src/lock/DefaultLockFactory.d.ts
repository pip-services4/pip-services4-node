import { Factory } from '../build/Factory';
/**
 * Creates [[ILock]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[ILock]]
 * @see [[MemoryLock]]
 * @see [[NullLock]]
 */
export declare class DefaultLockFactory extends Factory {
    private static readonly NullLockDescriptor;
    private static readonly MemoryLockDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
