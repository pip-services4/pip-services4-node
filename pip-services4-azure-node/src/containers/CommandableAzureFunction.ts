/** @module containers */

import { Context, Parameters } from 'pip-services4-components-node';
import { AzureFunction } from './AzureFunction';
import {AzureFunctionContextHelper} from "./AzureFunctionContextHelper";
import { CommandSet, ICommandable } from 'pip-services4-rpc-node';

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
export abstract class CommandableAzureFunction extends AzureFunction {

    /**
     * Creates a new instance of this Azure Function.
     * 
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    public constructor(name: string, description?: string) {
        super(name, description);
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

    private registerCommandSet(commandSet: CommandSet) {
        const commands = commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            const command = commands[index];

            this.registerAction(command.getName(), null, async context => {
                const traceId = this.getTraceId(context);
                const args = this.getParametrs(context);
                const timing = this.instrument(Context.fromTraceId(traceId), this._info.name + '.' + command.getName());

                try {
                    const res = await command.execute(Context.fromTraceId(traceId), args);
                    timing.endTiming();
                    return res;
                } catch (err) {
                    timing.endFailure(err);
                    return err;
                }
            });
        }
    }

    /**
     * Registers all actions in this Azure Function.
     */
    public register(): void {
        const controller: ICommandable = this._dependencyResolver.getOneRequired<ICommandable>('service');
        const commandSet = controller.getCommandSet();
        this.registerCommandSet(commandSet);
    }
}
