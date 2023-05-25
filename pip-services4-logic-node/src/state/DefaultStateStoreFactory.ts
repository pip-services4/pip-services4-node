/** @module state-store */
import { Descriptor } from 'pip-services4-commons-node';

import { Factory } from '../build/Factory';
import { NullStateStore } from './NullStateStore';
import { MemoryStateStore } from './MemoryStateStore';

/**
 * Creates [[IStateStore]] components by their descriptors.
 * 
 * @see [[Factory]]
 * @see [[IStateStore]]
 * @see [[MemoryStateStore]]
 * @see [[NullStateStore]]
 */
export class DefaultStateStoreFactory extends Factory {
    public static readonly Descriptor: Descriptor = new Descriptor("pip-services", "factory", "state-store", "default", "1.0");
    public static readonly NullStateStoreDescriptor: Descriptor = new Descriptor("pip-services", "state-store", "null", "*", "1.0");
    public static readonly MemoryStateStoreDescriptor: Descriptor = new Descriptor("pip-services", "state-store", "memory", "*", "1.0");

	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultStateStoreFactory.MemoryStateStoreDescriptor, MemoryStateStore);
		this.registerAsType(DefaultStateStoreFactory.NullStateStoreDescriptor, NullStateStore);
	}
}
