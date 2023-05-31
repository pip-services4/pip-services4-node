"use strict";
/** @module controllers */
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
exports.CommandableCloudFunctionController = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_http_node_1 = require("pip-services4-http-node");
const CloudFunctionController_1 = require("./CloudFunctionController");
const CloudFunctionRequestHelper_1 = require("../containers/CloudFunctionRequestHelper");
/**
 * Abstract controller that receives commands via Google Function protocol
 * to operations automatically generated for commands defined in [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable components]].
 * Each command is exposed as invoke method that receives command name and parameters.
 *
 * Commandable controllers require only 3 lines of code to implement a robust external
 * Google Function-based remote interface.
 *
 * This controller is intended to work inside Google Function container that
 * exploses registered actions externally.
 *
 * ### Configuration parameters ###
 *
 * - dependencies:
 *   - service:            override for Service dependency
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 *
 * @see [[CloudFunctionController]]
 *
 * ### Example ###
 *
 *     class MyCommandableCloudFunctionController extends CommandableCloudFunctionController {
 *        public constructor() {
 *           base("mydata");
 *           this._dependencyResolver.put(
 *               "service",
 *               new Descriptor("mygroup","service","*","*","1.0")
 *           );
 *        }
 *     }
 *
 *     let controller = new MyCommandableCloudFunctionController();
 *     controller.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","service","default","default","1.0"), service
 *     ));
 *
 *     await controller.open("123");
 *     console.log("The Google Function controller is running");
 */
class CommandableCloudFunctionController extends CloudFunctionController_1.CloudFunctionController {
    /**
     * Creates a new instance of the controller.
     *
     * @param name a controller name.
     */
    constructor(name) {
        super(name);
        this._dependencyResolver.put('service', 'none');
    }
    /**
     * Returns body from Google Function request.
     * This method can be overloaded in child classes
     * @param req -  Google Function request
     * @return Returns Parameters from request
     */
    getParameters(req) {
        return CloudFunctionRequestHelper_1.CloudFunctionRequestHelper.getParameters(req);
    }
    /**
     * Registers all actions in Google Function.
     */
    register() {
        const service = this._dependencyResolver.getOneRequired('service');
        this._commandSet = service.getCommandSet();
        const commands = this._commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            const command = commands[index];
            const name = command.getName();
            this.registerAction(name, null, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const context = pip_services4_components_node_1.Context.fromTraceId(this.getTraceId(req));
                const args = this.getParameters(req);
                args.remove("trace_id");
                args.remove("correlation_id");
                const timing = this.instrument(context, name);
                try {
                    const result = yield command.execute(context, args);
                    pip_services4_http_node_1.HttpResponseSender.sendResult(req, res, result);
                    timing.endTiming();
                }
                catch (ex) {
                    timing.endFailure(ex);
                    pip_services4_http_node_1.HttpResponseSender.sendError(req, res, ex);
                }
            }));
        }
    }
}
exports.CommandableCloudFunctionController = CommandableCloudFunctionController;
//# sourceMappingURL=CommandableCloudFunctionController.js.map