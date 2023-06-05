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
exports.CommandableGrpcController = void 0;
/** @module controllers */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_commons_node_2 = require("pip-services4-commons-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const GrpcController_1 = require("./GrpcController");
/**
 * Abstract controller that receives commands via GRPC protocol
 * to operations automatically generated for commands defined in [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable components]].
 * Each command is exposed as invoke method that receives command name and parameters.
 *
 * Commandable controllers require only 3 lines of code to implement a robust external
 * GRPC-based remote interface.
 *
 * ### Configuration parameters ###
 *
 * - dependencies:
 *   - endpoint:              override for HTTP Endpoint dependency
 *   - service:            override for Service dependency
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
 * - <code>\*:discovery:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] controllers to resolve connection
 * - <code>\*:endpoint:grpc:\*:1.0</code>          (optional) [[GrpcEndpoint]] reference
 *
 * @see [[CommandableGrpcClient]]
 * @see [[GrpcService]]
 *
 * ### Example ###
 *
 *     class MyCommandableGrpcController extends CommandableGrpcController {
 *        public constructor() {
 *           base();
 *           this._dependencyResolver.put(
 *               "service",
 *               new Descriptor("mygroup","service","*","*","1.0")
 *           );
 *        }
 *     }
 *
 *     let controller = new MyCommandableGrpcController();
 *     controller.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *     controller.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","service","default","default","1.0"), service
 *     ));
 *
 *     await controller.open(Context.fromTraceId("123"));
 *     console.log("The GRPC controller is running on port 8080");
 */
class CommandableGrpcController extends GrpcController_1.GrpcController {
    /**
     * Creates a new instance of the service.
     *
     * @param name a service name.
     */
    constructor(name) {
        super(null);
        this._name = name;
        this._dependencyResolver.put('service', 'none');
    }
    applyCommand(schema, action) {
        const actionWrapper = (call) => __awaiter(this, void 0, void 0, function* () {
            const method = call.request.method;
            const traceId = call.request.trace_id;
            try {
                // Convert arguments
                const argsEmpty = call.request.args_empty;
                const argsJson = call.request.args_json;
                const args = !argsEmpty && argsJson ? pip_services4_components_node_2.Parameters.fromJson(argsJson) : new pip_services4_components_node_2.Parameters();
                // Todo: Validate schema
                if (schema) {
                    //...
                }
                // Call command action
                try {
                    const result = yield action(pip_services4_components_node_1.Context.fromTraceId(traceId), args);
                    // Process result and generate response
                    return {
                        error: null,
                        result_empty: result == null,
                        result_json: result != null ? JSON.stringify(result) : null
                    };
                }
                catch (ex) {
                    return {
                        error: pip_services4_commons_node_1.ErrorDescriptionFactory.create(ex),
                        result_empty: true,
                        result_json: null
                    };
                }
            }
            catch (ex) {
                // Handle unexpected exception
                const err = new pip_services4_commons_node_2.InvocationException(traceId, "METHOD_FAILED", "Method " + method + " failed").wrap(ex).withDetails("method", method);
                return {
                    error: pip_services4_commons_node_1.ErrorDescriptionFactory.create(err),
                    result_empty: true,
                    result_json: null
                };
            }
        });
        return actionWrapper;
    }
    /**
     * Registers a commandable method in this objects GRPC server (service) by the given name.,
     *
     * @param method        the GRPC method name.
     * @param schema        the schema to use for parameter validation.
     * @param action        the action to perform at the given route.
     */
    registerCommadableMethod(method, schema, action) {
        let actionWrapper = this.applyCommand(schema, action);
        actionWrapper = this.applyInterceptors(actionWrapper);
        this._endpoint.registerCommadableMethod(method, schema, actionWrapper);
    }
    /**
     * Registers all service routes in HTTP endpoint.
     */
    register() {
        const service = this._dependencyResolver.getOneRequired('service');
        this._commandSet = service.getCommandSet();
        const commands = this._commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            const command = commands[index];
            const method = '' + this._name + '.' + command.getName();
            this.registerCommadableMethod(method, null, (context, args) => {
                const timing = this.instrument(context, method);
                try {
                    return command.execute(context, args);
                }
                catch (ex) {
                    timing.endFailure(ex);
                }
                finally {
                    timing.endTiming();
                }
            });
        }
    }
}
exports.CommandableGrpcController = CommandableGrpcController;
//# sourceMappingURL=CommandableGrpcController.js.map