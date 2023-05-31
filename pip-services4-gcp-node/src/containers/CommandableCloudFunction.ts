/** @module containers */
import { ICommandable } from 'pip-services4-rpc-node';
import { CommandSet } from 'pip-services4-rpc-node';
import { Context, Parameters } from 'pip-services4-components-node';
import { HttpResponseSender } from 'pip-services4-http-node';

import { CloudFunction } from './CloudFunction';
import { CloudFunctionRequestHelper } from "./CloudFunctionRequestHelper";

/**
 * Abstract Google Function function, that acts as a container to instantiate and run components
 * and expose them via external entry point. All actions are automatically generated for commands
 * defined in [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable components]]. Each command is exposed as an action defined by "cmd" parameter.
 *  
 * Container configuration for this Google Function is stored in <code>"./config/config.yml"</code> file.
 * But this path can be overridden by <code>CONFIG_PATH</code> environment variable.
 * 
 * Note: This component has been deprecated. Use CloudFunctionController instead.
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:controller:cloudfunc:\*:1.0</code>       (optional) [[https://pip-services4-node.github.io/pip-services4-gcp-node/interfaces/controllers.iCloudFunctioncontroller.html ICloudFunctionController]] controllers to handle action requests
 * - <code>\*:controller:commandable-cloudfunc:\*:1.0</code> (optional) [[https://pip-services4-node.github.io/pip-services4-gcp-node/interfaces/controllers.iCloudFunctioncontroller.html ICloudFunctionController]] controllers to handle action requests
 *
 * 
 * ### Example ###
 * 
 *     class MyCloudFunction extends CommandableCloudFunction {
 *         private _service: IMyService;
 *         ...
 *         public constructor() {
 *             base("mygroup", "MyGroup CloudFunction");
 *             this._dependencyResolver.put(
 *                 "service",
 *                 new Descriptor("mygroup","service","*","*","1.0")
 *             );
 *         }
 *     }
 * 
 *     let CloudFunction = new MyCloudFunction();
 *     
 *     await controller.run();
 *     console.log("MyCloudFunction is started");
 */
export abstract class CommandableCloudFunction extends CloudFunction {

    /**
     * Creates a new instance of this Google Function.
     * 
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    public constructor(name: string, description?: string) {
        super(name, description);
        this._dependencyResolver.put('service', 'none');
    }

    /**
     * Returns body from Google Function request.
     * This method can be overloaded in child classes
     * @param req -  Googl Function request
     * @return Returns Parameters from request
     */
    protected getParameters(req: any): Parameters {
        return CloudFunctionRequestHelper.getParameters(req);
    }

    private registerCommandSet(commandSet: CommandSet) {
        const commands = commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            const command = commands[index];

            this.registerAction(command.getName(), null, async (req, res) => {
                const context = Context.fromTraceId(this.getTraceId(req));
                const args = this.getParameters(req);
                const timing = this.instrument(context, this._info.name + '.' + command.getName());

                try {
                    const result = await command.execute(context, args);
                    timing.endTiming();
                    HttpResponseSender.sendResult(req, res, result);
                } catch (err) {
                    timing.endTiming(err);
                    HttpResponseSender.sendError(req, res, err);
                }
            });
        }
    }

    /**
     * Registers all actions in this Google Function.
     */
    public register(): void {
        const service: ICommandable = this._dependencyResolver.getOneRequired<ICommandable>('service');
        const commandSet = service.getCommandSet();
        this.registerCommandSet(commandSet);
    }
}
