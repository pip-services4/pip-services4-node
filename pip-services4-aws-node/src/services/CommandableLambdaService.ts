/** @module services */

import { ICommandable } from 'pip-services4-commons-node';
import { CommandSet } from 'pip-services4-commons-node';
import { Parameters } from 'pip-services4-commons-node';

import { LambdaService } from './LambdaService';

/**
 * Abstract service that receives commands via AWS Lambda protocol
 * to operations automatically generated for commands defined in [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable components]].
 * Each command is exposed as invoke method that receives command name and parameters.
 * 
 * Commandable services require only 3 lines of code to implement a robust external
 * Lambda-based remote interface.
 * 
 * This service is intended to work inside LambdaFunction container that
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
 * @see [[CommandableLambdaClient]]
 * @see [[LambdaService]]
 * 
 * ### Example ###
 * 
 *     class MyCommandableLambdaService extends CommandableLambdaService {
 *        public constructor() {
 *           base();
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 *     }
 * 
 *     let service = new MyCommandableLambdaService();
 *     service.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","controller","default","default","1.0"), controller
 *     ));
 * 
 *     await service.open("123");
 *     console.log("The AWS Lambda service is running");
 */
export abstract class CommandableLambdaService extends LambdaService {
    private _commandSet: CommandSet;

    /**
     * Creates a new instance of the service.
     * 
     * @param name a service name.
     */
    public constructor(name: string) {
        super(name);
        this._dependencyResolver.put('controller', 'none');
    }

    /**
     * Registers all actions in AWS Lambda function.
     */
    public register(): void {
        let controller: ICommandable = this._dependencyResolver.getOneRequired<ICommandable>('controller');
        this._commandSet = controller.getCommandSet();

        let commands = this._commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            let command = commands[index];
            let name = command.getName();

            this.registerAction(name, null, (params) => {
                let context = params != null ? params.trace_id : null;
 
                let args = Parameters.fromValue(params);
                args.remove("trace_id");

                let timing = this.instrument(context, name);
                try {
                    let res = command.execute(context, args);
                    timing.endTiming();
                    return res;
                } catch (ex) {
                    timing.endFailure(ex);
                }
            });
        }
    }
}