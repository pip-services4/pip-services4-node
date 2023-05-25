/** @module connect */
import { Descriptor } from 'pip-services4-commons-node';

import { Factory } from '../build/Factory';
import { MemoryDiscovery } from './MemoryDiscovery';

/**
 * Creates [[https://pip-services4-node.github.io/pip-services4-config-node/interfaces/connect.idiscovery.html IDiscovery]] components by their descriptors.
 * 
 * @see [[Factory]]
 * @see [[IDiscovery]]
 * @see [[MemoryDiscovery]]
 */
export class DefaultDiscoveryFactory extends Factory {
	private static readonly MemoryDiscoveryDescriptor = new Descriptor("pip-services", "discovery", "memory", "*", "1.0");
	
	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultDiscoveryFactory.MemoryDiscoveryDescriptor, MemoryDiscovery);
	}	
}
