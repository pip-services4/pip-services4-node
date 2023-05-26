import { IReferences } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { RestController } from './RestController';
/**
 * Controller that returns microservice status information via HTTP/REST protocol.
 *
 * The controller responds on /status route (can be changed) with a JSON object:
 * {
 *     - "id":            unique container id (usually hostname)
 *     - "name":          container name (from ContextInfo)
 *     - "description":   container description (from ContextInfo)
 *     - "start_time":    time when container was started
 *     - "current_time":  current time in UTC
 *     - "uptime":        duration since container start time in milliseconds
 *     - "properties":    additional container properties (from ContextInfo)
 *     - "components":    descriptors of components registered in the container
 * }
 *
 * ### Configuration parameters ###
 *
 * - base_route:              base route for remote URI
 * - route:                   status route (default: "status")
 * - dependencies:
 *   - endpoint:              override for HTTP Endpoint dependency
 *   - controller:            override for Controller dependency
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:endpoint:http:\*:1.0</code>          (optional) [[HttpEndpoint]] reference
 *
 * @see [[RestController]]
 * @see [[RestClient]]
 *
 * ### Example ###
 *
 *     let controller = new StatusRestController();
 *     controller.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *
 *     await controller.open(Context.fromTraceId("123"));
 *     console.log("The Status controller is accessible at http://+:8080/status");
 */
export declare class StatusRestController extends RestController {
    private _startTime;
    private _references2;
    private _contextInfo;
    private _route;
    /**
     * Creates a new instance of this service.
     */
    constructor();
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Registers all service routes in HTTP endpoint.
     */
    register(): void;
    /**
     * Handles status requests
     *
     * @param req   an HTTP request
     * @param res   an HTTP response
     */
    private status;
}
