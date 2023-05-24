/** @module build */
import { Factory } from 'pip-services4-components-node';
/**
 * Creates DataDog components by their descriptors.
 *
 * @see [[DataDogLogger]]
 */
export declare class DefaultDataDogFactory extends Factory {
    private static readonly DataDogLoggerDescriptor;
    private static readonly DataDogCountersDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
