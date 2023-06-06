/** @module build */
import { Factory } from 'pip-services4-components-node';
/**
 * Creates Prometheus components by their descriptors.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[PrometheusCounters]]
 * @see [[PrometheusMetricsController]]
 */
export declare class DefaultPrometheusFactory extends Factory {
    private static readonly PrometheusCountersDescriptor;
    private static readonly PrometheusMetricsControllerDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
