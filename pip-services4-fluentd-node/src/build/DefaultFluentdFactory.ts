/** @module build */

import { Factory, Descriptor } from 'pip-services4-components-node';
import { FluentdLogger } from '../log/FluentdLogger';

/**
 * Creates Fluentd components by their descriptors.
 * 
 * @see [[FluentdLogger]]
 */
export class DefaultFluentdFactory extends Factory {
	private static readonly FluentdLoggerDescriptor = new Descriptor("pip-services", "logger", "fluentd", "*", "1.0");

	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultFluentdFactory.FluentdLoggerDescriptor, FluentdLogger);
	}
}