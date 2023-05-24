/** @module info */
import { Descriptor } from 'pip-services4-commons-node';

import { Factory } from '../build/Factory';
import { ContextInfo } from './ContextInfo';

/**
 * Creates information components by their descriptors.
 * 
 * @see [[IFactory]]
 * @see [[ContextInfo]]
 */
export class DefaultInfoFactory extends Factory {
	private static readonly ContextInfoDescriptor: Descriptor = new Descriptor("pip-services", "context-info", "default", "*", "1.0");
	private static readonly ContainerInfoDescriptor: Descriptor = new Descriptor("pip-services", "container-info", "default", "*", "1.0");
	
	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
		super();
		this.registerAsType(DefaultInfoFactory.ContextInfoDescriptor, ContextInfo);
		this.registerAsType(DefaultInfoFactory.ContainerInfoDescriptor, ContextInfo);
	}
}
