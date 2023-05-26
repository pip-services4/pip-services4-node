import { Factory } from 'pip-services4-components-node';
/**
 * Creates [[ICredentialStore]] components by their descriptors.
 *
 * @see [[IFactory]]
 * @see [[ICredentialStore]]
 * @see [[MemoryCredentialStore]]
 */
export declare class DefaultConfigFactory extends Factory {
    private static readonly MemoryCredentialStoreDescriptor;
    private static readonly MemoryConfigReaderDescriptor;
    private static readonly JsonConfigReaderDescriptor;
    private static readonly YamlConfigReaderDescriptor;
    private static readonly MemoryDiscoveryDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
