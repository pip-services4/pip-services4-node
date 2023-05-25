/** @module auth */
import { Descriptor } from 'pip-services4-components-node';
import { Factory } from 'pip-services4-components-node';
import { MemoryCredentialStore } from './MemoryCredentialStore';

/**
 * Creates [[ICredentialStore]] components by their descriptors.
 * 
 * @see [[IFactory]]
 * @see [[ICredentialStore]]
 * @see [[MemoryCredentialStore]]
 */
export class DefaultCredentialStoreFactory extends Factory {
	private static readonly MemoryCredentialStoreDescriptor = new Descriptor("pip-services", "credential-store", "memory", "*", "1.0");
	
	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultCredentialStoreFactory.MemoryCredentialStoreDescriptor, MemoryCredentialStore);
	}	
}
