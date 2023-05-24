/** @module test */
import { Descriptor } from 'pip-services4-commons-node';

import { Factory } from '../build/Factory';
import { Shutdown } from './Shutdown';

/**
 * Creates test components by their descriptors.
 * 
 * @see [[Factory]]
 * @see [[Shutdown]]
 */
export class DefaultTestFactory extends Factory {
	private static readonly ShutdownDescriptor = new Descriptor("pip-services", "shutdown", "*", "*", "1.0");

	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultTestFactory.ShutdownDescriptor, Shutdown);
	}
}