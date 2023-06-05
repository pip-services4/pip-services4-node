/** @module services */
import { Parameters } from 'pip-services4-components-node';
import { AzureFunctionController } from './AzureFunctionController';
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
export declare abstract class CommandableAzureFunctionController extends AzureFunctionController {
    private _commandSet;
    /**
     * Creates a new instance of the controller.
     *
     * @param name a controller name.
     */
    constructor(name: string);
    /**
     * Returns body from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  Azure Function context
     * @return Returns Parameters from context
     */
    protected getParametrs(context: any): Parameters;
    /**
     * Registers all actions in Azure Function.
     */
    register(): void;
}
