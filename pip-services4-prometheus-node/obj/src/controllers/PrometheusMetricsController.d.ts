/** @module services */
import { IReferences } from 'pip-services4-components-node';
import { RestController } from 'pip-services4-http-node';
/**
 * Controller that exposes the <code>"/metrics"</code> and <code>"/metricsandreset"</code> routes for Prometheus to scap performance metrics.
 *
 * ### Configuration parameters ###
 *
 * - dependencies:
 *   - endpoint:              override for HTTP Endpoint dependency
 *   - prometheus-counters:   override for PrometheusCounters dependency
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from IDiscovery
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] controllers to resolve connection
 * - <code>\*:endpoint:http:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-rpc-node/classes/controllers.httpendpoint.html HttpEndpoint]] reference to expose REST operation
 * - <code>\*:counters:prometheus:\*:1.0</code>    [[PrometheusCounters]] reference to retrieve collected metrics
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-rpc-node/classes/controllers.restcontroller.html RestController]]
 * @see [[https://pip-services4-node.github.io/pip-services4-rpc-node/classes/clients.restclient.html RestClient]]
 *
 * ### Example ###
 *
 *     let controller = new PrometheusMetricsController();
 *     controller.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *
 *     await controller.open("123");
 *     console.log("The Prometheus metrics controller is accessible at http://+:8080/metrics");
 */
export declare class PrometheusMetricsController extends RestController {
    private _cachedCounters;
    private _source;
    private _instance;
    /**
     * Creates a new instance of this controller.
     */
    constructor();
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Registers all controllers routes in HTTP endpoint.
     */
    register(): void;
    /**
     * Handles metrics requests
     *
     * @param req   an HTTP request
     * @param res   an HTTP response
     */
    private metrics;
    /**
     * Handles metricsandreset requests.
     * The counters will be returned and then zeroed out.
     *
     * @param req   an HTTP request
     * @param res   an HTTP response
     */
    private metricsAndReset;
}
