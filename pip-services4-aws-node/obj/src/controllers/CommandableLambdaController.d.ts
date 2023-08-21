/** @module controllers */
import { LambdaController } from './LambdaController';
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
 *               "service",
 *               new Descriptor("mygroup","service","*","*","1.0")
 *           );
 *        }
 *     }
 *
 *     let controller = new MyCommandableLambdaController();
 *     controller.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","service","default","default","1.0"), service
 *     ));
 *
 *     await controller.open("123");
 *     console.log("The AWS Lambda controller is running");
 */
export declare abstract class CommandableLambdaController extends LambdaController {
    private _commandSet;
    /**
     * Creates a new instance of the controller.
     *
     * @param name a controller name.
     */
    constructor(name: string);
    /**
     * Registers all actions in AWS Lambda function.
     */
    register(): void;
}
