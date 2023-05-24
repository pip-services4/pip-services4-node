import { Factory } from '../build/Factory';
/**
 * Creates [[IConfigReader]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[MemoryConfigReader]]
 * @see [[JsonConfigReader]]
 * @see [[YamlConfigReader]]
 */
export declare class DefaultConfigReaderFactory extends Factory {
    private static readonly MemoryConfigReaderDescriptor;
    private static readonly JsonConfigReaderDescriptor;
    private static readonly YamlConfigReaderDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
