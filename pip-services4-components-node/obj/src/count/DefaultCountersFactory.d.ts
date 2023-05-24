import { Factory } from '../build/Factory';
/**
 * Creates [[ICounters]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[NullCounters]]
 * @see [[LogCounters]]
 * @see [[CompositeCounters]]
 */
export declare class DefaultCountersFactory extends Factory {
    private static readonly NullCountersDescriptor;
    private static readonly LogCountersDescriptor;
    private static readonly CompositeCountersDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
