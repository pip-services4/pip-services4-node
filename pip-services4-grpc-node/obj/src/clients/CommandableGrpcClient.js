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
exports.CommandableGrpcClient = void 0;
/** @module clients */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const GrpcClient_1 = require("./GrpcClient");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
/**
 * Abstract client that calls commandable GRPC controller.
 *
 * Commandable controllers are generated automatically for [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable objects]].
 * Each command is exposed as Invoke method that receives all parameters as args.
 *
 * ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 * - options:
 *   - retries:               number of retries (default: 3)
 *   - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *   - timeout:               invocation timeout in milliseconds (default: 10 sec)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] controllers to resolve connection
 *
 * ### Example ###
 *
 *     class MyCommandableGrpcClient extends CommandableGrpcClient implements IMyClient {
 *        ...
 *
 *         public async getData(context: IContext, id: string): Promise<MyData> {
 *
 *            return await this.callCommand(
 *                "get_data",
 *                context,
 *                { id: id }
 *            );
 *         }
 *         ...
 *     }
 *
 *     let client = new MyCommandableGrpcClient();
 *     client.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *
 *     let result = await client.getData("123", "1");
 */
class CommandableGrpcClient extends GrpcClient_1.GrpcClient {
    /**
     * Creates a new instance of the client.
     *
     * @param name     a controller name.
     */
    constructor(name) {
        super(__dirname + "../../../../src/protos/commandable.proto", "commandable.Commandable");
        this._name = name;
    }
    /**
     * Calls a remote method via GRPC commadable protocol.
     * The call is made via Invoke method and all parameters are sent in args object.
     * The complete route to remote method is defined as controllerName + "." + name.
     *
     * @param name              a name of the command to call.
     * @param context     (optional) a context to trace execution through call chain.
     * @param params            command parameters.
     * @returns the received result.
     */
    callCommand(name, context, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const method = this._name + '.' + name;
            const timing = this.instrument(context, method);
            const traceId = context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null;
            const request = {
                method: method,
                trace_id: traceId,
                args_empty: params == null,
                args_json: params != null ? JSON.stringify(params) : null
            };
            try {
                const response = yield this.call("invoke", traceId, request);
                // Handle error response
                if (response.error != null) {
                    const err = pip_services4_commons_node_1.ApplicationExceptionFactory.create(response.error);
                    throw err;
                }
                // Handle empty response
                if (response.result_empty || response.result_json == null) {
                    return null;
                }
                // Handle regular response
                const result = JSON.parse(response.result_json);
                timing.endTiming();
                return result;
            }
            catch (ex) {
                timing.endFailure(ex);
                throw ex;
            }
        });
    }
}
exports.CommandableGrpcClient = CommandableGrpcClient;
//# sourceMappingURL=CommandableGrpcClient.js.map