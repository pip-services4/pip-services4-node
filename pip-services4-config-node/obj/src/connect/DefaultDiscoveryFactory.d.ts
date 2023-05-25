/** @module connect */
import { Factory } from 'pip-services4-components-node';
/**
 * Creates [[https://pip-services4-node.github.io/pip-services4-config-node/interfaces/connect.idiscovery.html IDiscovery]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[IDiscovery]]
 * @see [[MemoryDiscovery]]
 */
export declare class DefaultDiscoveryFactory extends Factory {
    private static readonly MemoryDiscoveryDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
