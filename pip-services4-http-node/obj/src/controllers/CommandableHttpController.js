"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandableHttpController = void 0;
/** @module controllers */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const RestController_1 = require("./RestController");
const CommandableSwaggerDocument_1 = require("./CommandableSwaggerDocument");
/**
 * Abstract service that receives remove calls via HTTP protocol
 * to operations automatically generated for commands defined in [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable components]].
 * Each command is exposed as POST operation that receives all parameters in body object.
 *
 * Commandable services require only 3 lines of code to implement a robust external
 * HTTP-based remote interface.
 *
 * ### Configuration parameters ###
 *
 * - base_route:              base route for remote URI
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
 * @see [[CommandableHttpClient]]
 * @see [[RestController]]
 *
 * ### Example ###
 *
 *     class MyCommandableHttpController extends CommandableHttpController {
 *        public constructor() {
 *           base();
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 *     }
 *
 *     let controller = new MyCommandableHttpController();
 *     controller.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *     controller.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","service","default","default","1.0"), service
 *     ));
 *
 *     await controller.open("123");
 *     console.log("The REST controller is running on port 8080");
 */
class CommandableHttpController extends RestController_1.RestController {
    /**
     * Creates a new instance of the service.
     *
     * @param baseRoute a service base route.
     */
    constructor(baseRoute) {
        super();
        this._swaggerAuto = true;
        this._baseRoute = baseRoute;
        this._dependencyResolver.put('service', 'none');
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        super.configure(config);
        this._swaggerAuto = config.getAsBooleanWithDefault("swagger.auto", this._swaggerAuto);
    }
    /**
     * Registers all service routes in HTTP endpoint.
     */
    register() {
        const service = this._dependencyResolver.getOneRequired('service');
        this._commandSet = service.getCommandSet();
        const commands = this._commandSet.getCommands();
        for (const command of commands) {
            let route = command.getName();
            route = route[0] != '/' ? '/' + route : route;
            this.registerRoute('post', route, null, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const params = req.body || {};
                const traceId = this.getTraceId(req);
                const args = pip_services4_components_node_2.Parameters.fromValue(params);
                const context = pip_services4_components_node_1.Context.fromTraceId(traceId);
                const timing = this.instrument(context, this._baseRoute + '.' + command.getName());
                try {
                    const result = yield command.execute(context, args);
                    this.sendResult(req, res, result);
                    timing.endTiming();
                }
                catch (ex) {
                    timing.endFailure(ex);
                    this.sendError(req, res, ex);
                }
            }));
        }
        if (this._swaggerAuto) {
            const swaggerConfig = this._config.getSection("swagger");
            const doc = new CommandableSwaggerDocument_1.CommandableSwaggerDocument(this._baseRoute, swaggerConfig, commands);
            // eslint-disable-next-line no-useless-catch
            try {
                this.registerOpenApiSpec(doc.toString());
            }
            catch (ex) {
                throw ex;
            }
        }
    }
}
exports.CommandableHttpController = CommandableHttpController;
//# sourceMappingURL=CommandableHttpController.js.map