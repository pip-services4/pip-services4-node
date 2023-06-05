"use strict";
/** @module services */
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
exports.CommandableAzureFunctionController = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const AzureFunctionController_1 = require("./AzureFunctionController");
const AzureFunctionContextHelper_1 = require("../containers/AzureFunctionContextHelper");
/**
 * Abstract controller that receives commands via Azure Function protocol
 * to operations automatically generated for commands defined in [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable components]].
 * Each command is exposed as invoke method that receives command name and parameters.
 *
 * Commandable controllers require only 3 lines of code to implement a robust external
 * Azure Function-based remote interface.
 *
 * This controller is intended to work inside Azure Function container that
 * exploses registered actions externally.
 *
 * ### Configuration parameters ###
 *
 * - dependencies:
 *   - controller:            override for Controller dependency
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 *
 * @see [[AzureFunctionController]]
 *
 * ### Example ###
 *
 *     class MyCommandableAzureFunctionController extends CommandableAzureFunctionController {
 *        public constructor() {
 *           base();
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 *     }
 *
 *     let controller = new MyCommandableAzureFunctionController();
 *     controller.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","service","default","default","1.0"), service
 *     ));
 *
 *     await controller.open("123");
 *     console.log("The Azure Function controller is running");
 */
class CommandableAzureFunctionController extends AzureFunctionController_1.AzureFunctionController {
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
     * Returns body from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  Azure Function context
     * @return Returns Parameters from context
     */
    getParametrs(context) {
        return AzureFunctionContextHelper_1.AzureFunctionContextHelper.getParameters(context);
    }
    /**
     * Registers all actions in Azure Function.
     */
    register() {
        const controller = this._dependencyResolver.getOneRequired('service');
        this._commandSet = controller.getCommandSet();
        const commands = this._commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            const command = commands[index];
            const name = command.getName();
            this.registerAction(name, null, (reqContext) => __awaiter(this, void 0, void 0, function* () {
                const traceId = this.getTraceId(reqContext);
                const args = this.getParametrs(reqContext);
                args.remove("trace_id");
                const timing = this.instrument(pip_services4_components_node_1.Context.fromTraceId(traceId), name);
                try {
                    const res = yield command.execute(pip_services4_components_node_1.Context.fromTraceId(traceId), args);
                    timing.endTiming();
                    return res;
                }
                catch (ex) {
                    timing.endFailure(ex);
                    return ex;
                }
            }));
        }
    }
}
exports.CommandableAzureFunctionController = CommandableAzureFunctionController;
//# sourceMappingURL=CommandableAzureFunctionController.js.map