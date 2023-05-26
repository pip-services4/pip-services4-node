/** @module cache */

import { Descriptor } from 'pip-services4-components-node';
import { Factory } from 'pip-services4-components-node';

import { NullCache } from '../cache/NullCache';
import { MemoryCache } from '../cache/MemoryCache';
import { NullLock } from '../lock/NullLock';
import { MemoryLock } from '../lock/MemoryLock';
import { NullStateStore } from '../state/NullStateStore';
import { MemoryStateStore } from '../state/MemoryStateStore';

/**
 * Creates business logic components by their descriptors.
 * 
 * @see [[Factory]]
 * @see [[ICache]]
 * @see [[MemoryCache]]
 * @see [[NullCache]]
 */
export class DefaultLogicFactory extends Factory {
    private static readonly Descriptor: Descriptor = new Descriptor("pip-services", "factory", "logic", "default", "1.0");
    private static readonly NullCacheDescriptor: Descriptor = new Descriptor("pip-services", "cache", "null", "*", "1.0");
    private static readonly MemoryCacheDescriptor: Descriptor = new Descriptor("pip-services", "cache", "memory", "*", "1.0");
	private static readonly NullLockDescriptor = new Descriptor("pip-services", "lock", "null", "*", "1.0");
	private static readonly MemoryLockDescriptor = new Descriptor("pip-services", "lock", "memory", "*", "1.0");
    private static readonly NullStateStoreDescriptor: Descriptor = new Descriptor("pip-services", "state-store", "null", "*", "1.0");
    private static readonly MemoryStateStoreDescriptor: Descriptor = new Descriptor("pip-services", "state-store", "memory", "*", "1.0");

	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultLogicFactory.MemoryCacheDescriptor, MemoryCache);
		this.registerAsType(DefaultLogicFactory.NullCacheDescriptor, NullCache);
		this.registerAsType(DefaultLogicFactory.NullLockDescriptor, NullLock);
		this.registerAsType(DefaultLogicFactory.MemoryLockDescriptor, MemoryLock);
		this.registerAsType(DefaultLogicFactory.MemoryStateStoreDescriptor, MemoryStateStore);
		this.registerAsType(DefaultLogicFactory.NullStateStoreDescriptor, NullStateStore);
	}
}
