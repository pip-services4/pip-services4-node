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
exports.CommandableCloudFunction = void 0;
const pip_services3_rpc_node_1 = require("pip-services4-rpc-node");
const CloudFunction_1 = require("./CloudFunction");
const CloudFunctionRequestHelper_1 = require("./CloudFunctionRequestHelper");
/**
 * Abstract Google Function function, that acts as a container to instantiate and run components
 * and expose them via external entry point. All actions are automatically generated for commands
 * defined in [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable components]]. Each command is exposed as an action defined by "cmd" parameter.
 *
 * Container configuration for this Google Function is stored in <code>"./config/config.yml"</code> file.
 * But this path can be overridden by <code>CONFIG_PATH</code> environment variable.
 *
 * Note: This component has been deprecated. Use CloudFunctionService instead.
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:service:cloudfunc:\*:1.0</code>       (optional) [[https://pip-services4-node.github.io/pip-services4-gcp-node/interfaces/services.iCloudFunctionservice.html ICloudFunctionService]] services to handle action requests
 * - <code>\*:service:commandable-cloudfunc:\*:1.0</code> (optional) [[https://pip-services4-node.github.io/pip-services4-gcp-node/interfaces/services.iCloudFunctionservice.html ICloudFunctionService]] services to handle action requests
 *
 *
 * ### Example ###
 *
 *     class MyCloudFunction extends CommandableCloudFunction {
 *         private _controller: IMyController;
 *         ...
 *         public constructor() {
 *             base("mygroup", "MyGroup CloudFunction");
 *             this._dependencyResolver.put(
 *                 "controller",
 *                 new Descriptor("mygroup","controller","*","*","1.0")
 *             );
 *         }
 *     }
 *
 *     let CloudFunction = new MyCloudFunction();
 *
 *     await service.run();
 *     console.log("MyCloudFunction is started");
 */
class CommandableCloudFunction extends CloudFunction_1.CloudFunction {
    /**
     * Creates a new instance of this Google Function.
     *
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    constructor(name, description) {
        super(name, description);
        this._dependencyResolver.put('controller', 'none');
    }
    /**
     * Returns body from Google Function request.
     * This method can be overloaded in child classes
     * @param req -  Googl Function request
     * @return Returns Parameters from request
     */
    getParameters(req) {
        return CloudFunctionRequestHelper_1.CloudFunctionRequestHelper.getParameters(req);
    }
    registerCommandSet(commandSet) {
        let commands = commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            let command = commands[index];
            this.registerAction(command.getName(), null, (req, res) => __awaiter(this, void 0, void 0, function* () {
                let correlationId = this.getCorrelationId(req);
                let args = this.getParameters(req);
                let timing = this.instrument(correlationId, this._info.name + '.' + command.getName());
                try {
                    const result = yield command.execute(correlationId, args);
                    timing.endTiming();
                    pip_services3_rpc_node_1.HttpResponseSender.sendResult(req, res, result);
                }
                catch (err) {
                    timing.endTiming(err);
                    pip_services3_rpc_node_1.HttpResponseSender.sendError(req, res, err);
                }
            }));
        }
    }
    /**
     * Registers all actions in this Google Function.
     */
    register() {
        let controller = this._dependencyResolver.getOneRequired('controller');
        let commandSet = controller.getCommandSet();
        this.registerCommandSet(commandSet);
    }
}
exports.CommandableCloudFunction = CommandableCloudFunction;
//# sourceMappingURL=CommandableCloudFunction.js.map