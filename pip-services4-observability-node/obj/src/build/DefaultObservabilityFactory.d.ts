import { Factory } from 'pip-services4-components-node';
/**
 * Creates observability components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[NullCounters]]
 * @see [[LogCounters]]
 * @see [[CompositeCounters]]
 */
export declare class DefaultObservabilityFactory extends Factory {
    private static readonly NullCountersDescriptor;
    private static readonly LogCountersDescriptor;
    private static readonly CompositeCountersDescriptor;
    private static readonly NullLoggerDescriptor;
    private static readonly ConsoleLoggerDescriptor;
    private static readonly CompositeLoggerDescriptor;
    private static readonly NullTracerDescriptor;
    private static readonly LogTracerDescriptor;
    private static readonly CompositeTracerDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
