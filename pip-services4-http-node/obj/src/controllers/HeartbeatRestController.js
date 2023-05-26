"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeartbeatRestController = void 0;
const RestController_1 = require("./RestController");
/**
 * Service returns heartbeat via HTTP/REST protocol.
 *
 * The service responds on /heartbeat route (can be changed)
 * with a string with the current time in UTC.
 *
 * This service route can be used to health checks by loadbalancers and
 * container orchestrators.
 *
 * ### Configuration parameters ###
 *
 * - base_route:              base route for remote URI (default: "")
 * - route:                   route to heartbeat operation (default: "heartbeat")
 * - dependencies:
 *   - endpoint:              override for HTTP Endpoint dependency
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
 *     let service = new HeartbeatService();
 *     service.configure(ConfigParams.fromTuples(
 *         "route", "ping",
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *
 *     await service.open("123");
 *     console.log("The Heartbeat service is accessible at http://+:8080/ping");
 */
class HeartbeatRestController extends RestController_1.RestController {
    /**
     * Creates a new instance of this service.
     */
    constructor() {
        super();
        this._route = "heartbeat";
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        super.configure(config);
        this._route = config.getAsStringWithDefault("route", this._route);
    }
    /**
     * Registers all service routes in HTTP endpoint.
     */
    register() {
        this.registerRoute("get", this._route, null, this.heartbeat);
    }
    /**
     * Handles heartbeat requests
     *
     * @param req   an HTTP request
     * @param res   an HTTP response
     */
    heartbeat(req, res) {
        this.sendResult(req, res, new Date());
    }
}
exports.HeartbeatRestController = HeartbeatRestController;
//# sourceMappingURL=HeartbeatRestController.js.map