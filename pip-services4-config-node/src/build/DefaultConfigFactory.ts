/** @module auth */
import { Descriptor } from 'pip-services4-components-node';
import { Factory } from 'pip-services4-components-node';

import { MemoryCredentialStore } from '../auth/MemoryCredentialStore';
import { MemoryConfigReader } from '../config/MemoryConfigReader';
import { JsonConfigReader } from '../config/JsonConfigReader';
import { YamlConfigReader } from '../config/YamlConfigReader';
import { MemoryDiscovery } from '../connect/MemoryDiscovery';

/**
 * Creates [[ICredentialStore]] components by their descriptors.
 * 
 * @see [[IFactory]]
 * @see [[ICredentialStore]]
 * @see [[MemoryCredentialStore]]
 */
export class DefaultConfigFactory extends Factory {
	private static readonly MemoryCredentialStoreDescriptor = new Descriptor("pip-services", "credential-store", "memory", "*", "1.0");
	private static readonly MemoryConfigReaderDescriptor = new Descriptor("pip-services", "config-reader", "memory", "*", "1.0");
	private static readonly JsonConfigReaderDescriptor = new Descriptor("pip-services", "config-reader", "json", "*", "1.0");
	private static readonly YamlConfigReaderDescriptor = new Descriptor("pip-services", "config-reader", "yaml", "*", "1.0");
	private static readonly MemoryDiscoveryDescriptor = new Descriptor("pip-services", "discovery", "memory", "*", "1.0");

	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultConfigFactory.MemoryCredentialStoreDescriptor, MemoryCredentialStore);
		this.registerAsType(DefaultConfigFactory.MemoryConfigReaderDescriptor, MemoryConfigReader);
		this.registerAsType(DefaultConfigFactory.JsonConfigReaderDescriptor, JsonConfigReader);
		this.registerAsType(DefaultConfigFactory.YamlConfigReaderDescriptor, YamlConfigReader);
		this.registerAsType(DefaultConfigFactory.MemoryDiscoveryDescriptor, MemoryDiscovery);
	}	
}
