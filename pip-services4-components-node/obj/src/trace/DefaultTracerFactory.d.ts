import { Factory } from '../build/Factory';
/**
 * Creates [[ITracer]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[NullTracer]]
 * @see [[ConsoleTracer]]
 * @see [[CompositeTracer]]
 */
export declare class DefaultTracerFactory extends Factory {
    private static readonly NullTracerDescriptor;
    private static readonly LogTracerDescriptor;
    private static readonly CompositeTracerDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
