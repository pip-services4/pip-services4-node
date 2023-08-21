/** @module containers */
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
export declare abstract class CommandableLambdaFunction extends LambdaFunction {
    /**
     * Creates a new instance of this lambda function.
     *
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    constructor(name: string, description?: string);
    private registerCommandSet;
    /**
     * Registers all actions in this lambda function.
     */
    register(): void;
}
