/** @module containers */

import { Parameters } from 'pip-services4-components-node';
import { CommandSet, ICommandable } from 'pip-services4-rpc-node';
import { LambdaFunction } from './LambdaFunction';

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
export abstract class CommandableLambdaFunction extends LambdaFunction {

    /**
     * Creates a new instance of this lambda function.
     * 
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    public constructor(name: string, description?: string) {
        super(name, description);
        this._dependencyResolver.put('service', 'none');
    }

    private registerCommandSet(commandSet: CommandSet) {
        const commands = commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            const command = commands[index];

            this.registerAction(command.getName(), null, async params => {
                const context = params.trace_id;
                const args = Parameters.fromValue(params);
                const timing = this.instrument(context, this._info.name + '.' + command.getName());

                try {
                    const result = await command.execute(context, args);
                    timing.endTiming();
                    return result;
                } catch (err) {
                    timing.endTiming(err);
                    throw err;
                }
            });
        }
    }

    /**
     * Registers all actions in this lambda function.
     */
    public register(): void {
        const controller: ICommandable = this._dependencyResolver.getOneRequired<ICommandable>('service');
        const commandSet = controller.getCommandSet();
        this.registerCommandSet(commandSet);
    }
}
