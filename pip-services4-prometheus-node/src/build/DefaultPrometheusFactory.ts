/** @module build */
import { Descriptor, Factory } from 'pip-services4-components-node';

import { PrometheusCounters } from '../count/PrometheusCounters';
import { PrometheusMetricsController } from '../controllers/PrometheusMetricsController';

/**
 * Creates Prometheus components by their descriptors.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[PrometheusCounters]]
 * @see [[PrometheusMetricsController]]
 */
export class DefaultPrometheusFactory extends Factory {
	private static readonly PrometheusCountersDescriptor: Descriptor = new Descriptor("pip-services", "counters", "prometheus", "*", "1.0");
	private static readonly PrometheusMetricsControllerDescriptor: Descriptor = new Descriptor("pip-services", "metrics-controller", "prometheus", "*", "1.0");

	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultPrometheusFactory.PrometheusCountersDescriptor, PrometheusCounters);
		this.registerAsType(DefaultPrometheusFactory.PrometheusMetricsControllerDescriptor, PrometheusMetricsController);
	}
}