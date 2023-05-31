/** @module controllers */

import { ICommandable } from 'pip-services4-rpc-node';
import { CommandSet } from 'pip-services4-rpc-node';
import { Context, Parameters } from 'pip-services4-components-node';
import { HttpResponseSender } from 'pip-services4-http-node';

import { CloudFunctionController } from './CloudFunctionController';
import { CloudFunctionRequestHelper } from "../containers/CloudFunctionRequestHelper";

/**
 * Abstract controller that receives commands via Google Function protocol
 * to operations automatically generated for commands defined in [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable components]].
 * Each command is exposed as invoke method that receives command name and parameters.
 * 
 * Commandable controllers require only 3 lines of code to implement a robust external
 * Google Function-based remote interface.
 * 
 * This controller is intended to work inside Google Function container that
 * exploses registered actions externally.
 * 
 * ### Configuration parameters ###
 * 
 * - dependencies:
 *   - service:            override for Service dependency
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 *
 * @see [[CloudFunctionController]]
 * 
 * ### Example ###
 * 
 *     class MyCommandableCloudFunctionController extends CommandableCloudFunctionController {
 *        public constructor() {
 *           base("mydata");
 *           this._dependencyResolver.put(
 *               "service",
 *               new Descriptor("mygroup","service","*","*","1.0")
 *           );
 *        }
 *     }
 * 
 *     let controller = new MyCommandableCloudFunctionController();
 *     controller.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","service","default","default","1.0"), service
 *     ));
 * 
 *     await controller.open("123");
 *     console.log("The Google Function controller is running");
 */
export abstract class CommandableCloudFunctionController extends CloudFunctionController {
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
     * Returns body from Google Function request.
     * This method can be overloaded in child classes
     * @param req -  Google Function request
     * @return Returns Parameters from request
     */
    protected getParameters(req: any): Parameters {
        return CloudFunctionRequestHelper.getParameters(req);
    }

    /**
     * Registers all actions in Google Function.
     */
    public register(): void {
        const service: ICommandable = this._dependencyResolver.getOneRequired<ICommandable>('service');
        this._commandSet = service.getCommandSet();

        const commands = this._commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            const command = commands[index];
            const name = command.getName();

            this.registerAction(name, null, async (req, res) => {
                const context = Context.fromTraceId(this.getTraceId(req));
                const args = this.getParameters(req);
                args.remove("trace_id");
                args.remove("correlation_id");

                const timing = this.instrument(context, name);
                try {
                    const result = await command.execute(context, args);
                    HttpResponseSender.sendResult(req, res, result);
                    timing.endTiming()
                } catch (ex) {
                    timing.endFailure(ex);
                    HttpResponseSender.sendError(req, res, ex);
                }
            });
        }
    }
}