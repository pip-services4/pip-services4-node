/** @module build */
import { Descriptor, Factory } from 'pip-services4-components-node';

import { MemcachedCache } from '../cache/MemcachedCache';
import { MemcachedLock } from '../lock/MemcachedLock';

/**
 * Creates Redis components by their descriptors.
 * 
 * @see [[MemcachedCache]]
 * @see [[MemcachedLock]]
 */
export class DefaultMemcachedFactory extends Factory {
	private static readonly MemcachedCacheDescriptor = new Descriptor("pip-services4", "cache", "memcached", "*", "1.0");
	private static readonly MemcachedLockDescriptor = new Descriptor("pip-services4", "lock", "memcached", "*", "1.0");

	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultMemcachedFactory.MemcachedCacheDescriptor, MemcachedCache);
		this.registerAsType(DefaultMemcachedFactory.MemcachedLockDescriptor, MemcachedLock);
	}
}