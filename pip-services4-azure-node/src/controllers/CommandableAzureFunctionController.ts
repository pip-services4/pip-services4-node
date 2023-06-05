/** @module services */

import { Context, Parameters } from 'pip-services4-components-node';
import { AzureFunctionController } from './AzureFunctionController';
import {AzureFunctionContextHelper} from "../containers/AzureFunctionContextHelper";
import { CommandSet, ICommandable } from 'pip-services4-rpc-node';

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
export abstract class CommandableAzureFunctionController extends AzureFunctionController {
    private _commandSet: CommandSet;

    /**
     * Creates a new instance of the controller.
     * 
     * @param name a controller name.
     */
    public constructor(name: string) {
        super(name);
        this._dependencyResolver.put('service', 'none');
    }

    /**
     * Returns body from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  Azure Function context
     * @return Returns Parameters from context
     */
    protected getParametrs(context: any): Parameters {
        return AzureFunctionContextHelper.getParameters(context);
    }

    /**
     * Registers all actions in Azure Function.
     */
    public register(): void {
        const controller: ICommandable = this._dependencyResolver.getOneRequired<ICommandable>('service');
        this._commandSet = controller.getCommandSet();

        const commands = this._commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            const command = commands[index];
            const name = command.getName();

            this.registerAction(name, null, async (reqContext) => {
                const traceId = this.getTraceId(reqContext);
                const args = this.getParametrs(reqContext);
                args.remove("trace_id");

                const timing = this.instrument(Context.fromTraceId(traceId), name);
                try {
                    const res = await command.execute(Context.fromTraceId(traceId), args);
                    timing.endTiming();
                    return res;
                } catch (ex) {
                    timing.endFailure(ex);
                    return ex;
                }
            });
        }
    }
}