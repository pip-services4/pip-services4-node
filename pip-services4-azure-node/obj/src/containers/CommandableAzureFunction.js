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
exports.CommandableAzureFunction = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const AzureFunction_1 = require("./AzureFunction");
const AzureFunctionContextHelper_1 = require("./AzureFunctionContextHelper");
/**
 * Abstract Azure Function function, that acts as a container to instantiate and run components
 * and expose them via external entry point. All actions are automatically generated for commands
 * defined in [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable components]]. Each command is exposed as an action defined by "cmd" parameter.
 *
 * Container configuration for this Azure Function is stored in <code>"./config/config.yml"</code> file.
 * But this path can be overridden by <code>CONFIG_PATH</code> environment variable.
 *
 * Note: This component has been deprecated. Use Azure FunctionService instead.
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:controller:azurefunc:\*:1.0</code>       (optional) [[https://pip-services4-node.github.io/pip-services4-azure-node/interfaces/controllers.iazurefunctioncontroller.html IAzureFunctionController]] controllers to handle action requests
 * - <code>\*:controller:commandable-azurefunc:\*:1.0</code> (optional) [[https://pip-services4-node.github.io/pip-services4-azure-node/interfaces/controllers.iazurefunctioncontroller.html IAzureFunctionController]] controllers to handle action requests
 *
 *
 * ### Example ###
 *
 *     class MyAzureFunctionFunction extends CommandableAzureFunction {
 *         private _controller: IMyController;
 *         ...
 *         public constructor() {
 *             base("mygroup", "MyGroup AzureFunction");
 *             this._dependencyResolver.put(
 *                 "controller",
 *                 new Descriptor("mygroup","controller","*","*","1.0")
 *             );
 *         }
 *     }
 *
 *     let azureFunction = new MyAzureFunctionFunction();
 *
 *     await controller.run();
 *     console.log("MyAzureFunction is started");
 */
class CommandableAzureFunction extends AzureFunction_1.AzureFunction {
    /**
     * Creates a new instance of this Azure Function.
     *
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    constructor(name, description) {
        super(name, description);
        this._dependencyResolver.put('service', 'none');
    }
    /**
     * Returns body from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  Azure Function context
     * @return Returns Parameters from context
     */
    getParametrs(context) {
        return AzureFunctionContextHelper_1.AzureFunctionContextHelper.getParameters(context);
    }
    registerCommandSet(commandSet) {
        const commands = commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            const command = commands[index];
            this.registerAction(command.getName(), null, (context) => __awaiter(this, void 0, void 0, function* () {
                const traceId = this.getTraceId(context);
                const args = this.getParametrs(context);
                const timing = this.instrument(pip_services4_components_node_1.Context.fromTraceId(traceId), this._info.name + '.' + command.getName());
                try {
                    const res = yield command.execute(pip_services4_components_node_1.Context.fromTraceId(traceId), args);
                    timing.endTiming();
                    return res;
                }
                catch (err) {
                    timing.endFailure(err);
                    return err;
                }
            }));
        }
    }
    /**
     * Registers all actions in this Azure Function.
     */
    register() {
        const controller = this._dependencyResolver.getOneRequired('service');
        const commandSet = controller.getCommandSet();
        this.registerCommandSet(commandSet);
    }
}
exports.CommandableAzureFunction = CommandableAzureFunction;
//# sourceMappingURL=CommandableAzureFunction.js.map