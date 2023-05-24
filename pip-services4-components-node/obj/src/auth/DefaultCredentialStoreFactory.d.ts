import { Factory } from '../build/Factory';
/**
 * Creates [[ICredentialStore]] components by their descriptors.
 *
 * @see [[IFactory]]
 * @see [[ICredentialStore]]
 * @see [[MemoryCredentialStore]]
 */
export declare class DefaultCredentialStoreFactory extends Factory {
    private static readonly MemoryCredentialStoreDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
