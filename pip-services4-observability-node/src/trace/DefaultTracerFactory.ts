/** @module trace */
import { Descriptor } from 'pip-services4-components-node';
import { Factory } from 'pip-services4-components-node';

import { NullTracer } from './NullTracer';
import { LogTracer } from './LogTracer';
import { CompositeTracer } from './CompositeTracer';

/**
 * Creates [[ITracer]] components by their descriptors.
 * 
 * @see [[Factory]]
 * @see [[NullTracer]]
 * @see [[ConsoleTracer]]
 * @see [[CompositeTracer]]
 */
export class DefaultTracerFactory extends Factory {
	private static readonly NullTracerDescriptor = new Descriptor("pip-services", "tracer", "null", "*", "1.0");
	private static readonly LogTracerDescriptor = new Descriptor("pip-services", "tracer", "log", "*", "1.0");
	private static readonly CompositeTracerDescriptor = new Descriptor("pip-services", "tracer", "composite", "*", "1.0");

	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultTracerFactory.NullTracerDescriptor, NullTracer);
		this.registerAsType(DefaultTracerFactory.LogTracerDescriptor, LogTracer);
		this.registerAsType(DefaultTracerFactory.CompositeTracerDescriptor, CompositeTracer);
	}
}