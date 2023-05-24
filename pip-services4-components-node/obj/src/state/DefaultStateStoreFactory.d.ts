/** @module state-store */
import { Descriptor } from 'pip-services4-commons-node';
import { Factory } from '../build/Factory';
/**
 * Creates [[IStateStore]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[IStateStore]]
 * @see [[MemoryStateStore]]
 * @see [[NullStateStore]]
 */
export declare class DefaultStateStoreFactory extends Factory {
    static readonly Descriptor: Descriptor;
    static readonly NullStateStoreDescriptor: Descriptor;
    static readonly MemoryStateStoreDescriptor: Descriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
