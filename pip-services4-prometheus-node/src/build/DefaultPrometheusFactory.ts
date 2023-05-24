/** @module build */
import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-commons-node';

import { PrometheusCounters } from '../count/PrometheusCounters';
import { PrometheusMetricsService } from '../services/PrometheusMetricsService';

/**
 * Creates Prometheus components by their descriptors.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[PrometheusCounters]]
 * @see [[PrometheusMetricsService]]
 */
export class DefaultPrometheusFactory extends Factory {
	private static readonly PrometheusCountersDescriptor: Descriptor = new Descriptor("pip-services", "counters", "prometheus", "*", "1.0");
	private static readonly PrometheusMetricsServiceDescriptor: Descriptor = new Descriptor("pip-services", "metrics-service", "prometheus", "*", "1.0");

	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultPrometheusFactory.PrometheusCountersDescriptor, PrometheusCounters);
		this.registerAsType(DefaultPrometheusFactory.PrometheusMetricsServiceDescriptor, PrometheusMetricsService);
	}
}