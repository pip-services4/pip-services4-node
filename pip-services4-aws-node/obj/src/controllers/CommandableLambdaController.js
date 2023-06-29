"use strict";
/** @module controllers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandableLambdaController = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const LambdaController_1 = require("./LambdaController");
/**
 * Abstract controller that receives commands via AWS Lambda protocol
 * to operations automatically generated for commands defined in [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable components]].
 * Each command is exposed as invoke method that receives command name and parameters.
 *
 * Commandable services require only 3 lines of code to implement a robust external
 * Lambda-based remote interface.
 *
 * This controller is intended to work inside LambdaFunction container that
 * exploses registered actions externally.
 *
 * ### Configuration parameters ###
 *
 * - dependencies:
 *   - service:            override for Controller dependency
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 *
 * @see [[CommandableLambdaClient]]
 * @see [[LambdaController]]
 *
 * ### Example ###
 *
 *     class MyCommandableLambdaController extends CommandableLambdaController {
 *        public constructor() {
 *           base();
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 *     }
 *
 *     let controller = new MyCommandableLambdaController();
 *     controller.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","service","default","default","1.0"), controller
 *     ));
 *
 *     await controller.open("123");
 *     console.log("The AWS Lambda controller is running");
 */
class CommandableLambdaController extends LambdaController_1.LambdaController {
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
     * Registers all actions in AWS Lambda function.
     */
    register() {
        const service = this._dependencyResolver.getOneRequired('service');
        this._commandSet = service.getCommandSet();
        const commands = this._commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            const command = commands[index];
            const name = command.getName();
            this.registerAction(name, null, (params) => {
                const context = params != null ? pip_services4_components_node_1.Context.fromTraceId(params.trace_id) : null;
                const args = pip_services4_components_node_1.Parameters.fromValue(params);
                args.remove("trace_id");
                const timing = this.instrument(context, name);
                try {
                    const res = command.execute(context, args);
                    timing.endTiming();
                    return res;
                }
                catch (ex) {
                    timing.endFailure(ex);
                }
            });
        }
    }
}
exports.CommandableLambdaController = CommandableLambdaController;
//# sourceMappingURL=CommandableLambdaController.js.map