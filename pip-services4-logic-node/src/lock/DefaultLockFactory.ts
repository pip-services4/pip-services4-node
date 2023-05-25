/** @module lock */
import { Descriptor } from 'pip-services4-commons-node';

import { NullLock } from './NullLock';
import { MemoryLock } from './MemoryLock';
import { Factory } from '../build/Factory';

/**
 * Creates [[ILock]] components by their descriptors.
 * 
 * @see [[Factory]]
 * @see [[ILock]]
 * @see [[MemoryLock]]
 * @see [[NullLock]]
 */
export class DefaultLockFactory extends Factory {
	private static readonly NullLockDescriptor = new Descriptor("pip-services", "lock", "null", "*", "1.0");
	private static readonly MemoryLockDescriptor = new Descriptor("pip-services", "lock", "memory", "*", "1.0");

	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultLockFactory.NullLockDescriptor, NullLock);
		this.registerAsType(DefaultLockFactory.MemoryLockDescriptor, MemoryLock);
	}
}