/** @module build */
import { Descriptor, Factory } from 'pip-services4-components-node';
/**
 * Creates AWS components by their descriptors.
 *
 * @see [[CloudWatchLogger]]
 * @see [[CloudWatchCounters]]
 */
export declare class DefaultAwsFactory extends Factory {
    static readonly Descriptor: Descriptor;
    static readonly CloudWatchLoggerDescriptor: Descriptor;
    static readonly CloudWatchCountersDescriptor: Descriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
