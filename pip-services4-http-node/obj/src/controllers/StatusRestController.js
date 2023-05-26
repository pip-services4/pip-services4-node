"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusRestController = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const RestController_1 = require("./RestController");
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
class StatusRestController extends RestController_1.RestController {
    /**
     * Creates a new instance of this service.
     */
    constructor() {
        super();
        this._startTime = new Date();
        this._route = "status";
        this._dependencyResolver.put("context-info", new pip_services4_components_node_1.Descriptor("pip-services", "context-info", "default", "*", "1.0"));
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
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._references2 = references;
        super.setReferences(references);
        this._contextInfo = this._dependencyResolver.getOneOptional("context-info");
    }
    /**
     * Registers all service routes in HTTP endpoint.
     */
    register() {
        this.registerRoute("get", this._route, null, this.status);
    }
    /**
     * Handles status requests
     *
     * @param req   an HTTP request
     * @param res   an HTTP response
     */
    status(req, res) {
        const id = this._contextInfo != null ? this._contextInfo.contextId : "";
        const name = this._contextInfo != null ? this._contextInfo.name : "Unknown";
        const description = this._contextInfo != null ? this._contextInfo.description : "";
        const uptime = new Date().getTime() - this._startTime.getTime();
        const properties = this._contextInfo != null ? this._contextInfo.properties : "";
        const components = [];
        if (this._references2 != null) {
            for (const locator of this._references2.getAllLocators()) {
                components.push(locator.toString());
            }
        }
        const status = {
            id: id,
            name: name,
            description: description,
            start_time: pip_services4_commons_node_1.StringConverter.toString(this._startTime),
            current_time: pip_services4_commons_node_1.StringConverter.toString(new Date()),
            uptime: uptime,
            properties: properties,
            components: components
        };
        this.sendResult(req, res, status);
    }
}
exports.StatusRestController = StatusRestController;
//# sourceMappingURL=StatusRestController.js.map