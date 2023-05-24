/** @module cache */
import { Descriptor } from 'pip-services4-commons-node';
import { Factory } from '../build/Factory';
/**
 * Creates [[ICache]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[ICache]]
 * @see [[MemoryCache]]
 * @see [[NullCache]]
 */
export declare class DefaultCacheFactory extends Factory {
    static readonly Descriptor: Descriptor;
    static readonly NullCacheDescriptor: Descriptor;
    static readonly MemoryCacheDescriptor: Descriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
