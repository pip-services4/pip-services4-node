import { Factory } from 'pip-services4-components-node';
/**
 * Creates [[ILogger]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[NullLogger]]
 * @see [[ConsoleLogger]]
 * @see [[CompositeLogger]]
 */
export declare class DefaultLoggerFactory extends Factory {
    private static readonly NullLoggerDescriptor;
    private static readonly ConsoleLoggerDescriptor;
    private static readonly CompositeLoggerDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
