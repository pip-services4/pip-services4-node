"use strict";
/** @module containers */
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
exports.CommandableLambdaFunction = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const LambdaFunction_1 = require("./LambdaFunction");
/**
 * Abstract AWS Lambda function, that acts as a container to instantiate and run components
 * and expose them via external entry point. All actions are automatically generated for commands
 * defined in [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable components]]. Each command is exposed as an action defined by "cmd" parameter.
 *
 * Container configuration for this Lambda function is stored in <code>"./config/config.yml"</code> file.
 * But this path can be overriden by <code>CONFIG_PATH</code> environment variable.
 *
 * Note: This component has been deprecated. Use LambdaController instead.
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:controller:awslambda:\*:1.0</code>       (optional) [[https://pip-services4-node.github.io/pip-services4-aws-node/interfaces/services.ilambdacontroller.html ILambdaController]] controllers to handle action requests
 * - <code>\*:controller:commandable-awslambda:\*:1.0</code> (optional) [[https://pip-services4-node.github.io/pip-services4-aws-node/interfaces/services.ilambdacontroller.html ILambdaController]] controllers to handle action requests
 *
 * @see [[LambdaClient]]
 *
 * ### Example ###
 *
 *     class MyLambdaFunction extends CommandableLambdaFunction {
 *         private _service: IMyService;
 *         ...
 *         public constructor() {
 *             base("mygroup", "MyGroup lambda function");
 *             this._dependencyResolver.put(
 *                 "service",
 *                 new Descriptor("mygroup","service","*","*","1.0")
 *             );
 *         }
 *     }
 *
 *     let lambda = new MyLambdaFunction();
 *
 *     await container.run();
 *     console.log("MyLambdaFunction is started");
 */
class CommandableLambdaFunction extends LambdaFunction_1.LambdaFunction {
    /**
     * Creates a new instance of this lambda function.
     *
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    constructor(name, description) {
        super(name, description);
        this._dependencyResolver.put('service', 'none');
    }
    registerCommandSet(commandSet) {
        const commands = commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            const command = commands[index];
            this.registerAction(command.getName(), null, (params) => __awaiter(this, void 0, void 0, function* () {
                const context = params.trace_id;
                const args = pip_services4_components_node_1.Parameters.fromValue(params);
                const timing = this.instrument(context, this._info.name + '.' + command.getName());
                try {
                    const result = yield command.execute(context, args);
                    timing.endTiming();
                    return result;
                }
                catch (err) {
                    timing.endTiming(err);
                    throw err;
                }
            }));
        }
    }
    /**
     * Registers all actions in this lambda function.
     */
    register() {
        const controller = this._dependencyResolver.getOneRequired('service');
        const commandSet = controller.getCommandSet();
        this.registerCommandSet(commandSet);
    }
}
exports.CommandableLambdaFunction = CommandableLambdaFunction;
//# sourceMappingURL=CommandableLambdaFunction.js.map