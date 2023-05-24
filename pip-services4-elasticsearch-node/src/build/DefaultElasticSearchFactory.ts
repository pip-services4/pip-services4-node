/** @module build */
import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-commons-node';

import { ElasticSearchLogger } from '../log/ElasticSearchLogger';

/**
 * Creates ElasticSearch components by their descriptors.
 * 
 * @see [[ElasticSearchLogger]]
 */
export class DefaultElasticSearchFactory extends Factory {
	private static readonly ElasticSearchLoggerDescriptor = new Descriptor("pip-services", "logger", "elasticsearch", "*", "1.0");

	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultElasticSearchFactory.ElasticSearchLoggerDescriptor, ElasticSearchLogger);
	}
}