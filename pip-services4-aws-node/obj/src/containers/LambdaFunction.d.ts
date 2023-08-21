import { DependencyResolver, IContext, IReferences } from 'pip-services4-components-node';
import { Container } from 'pip-services4-container-node';
import { CompositeCounters, CompositeTracer } from 'pip-services4-observability-node';
import { InstrumentTiming } from 'pip-services4-rpc-node';
import { Schema } from 'pip-services4-data-node';
/**
 * Abstract AWS Lambda function, that acts as a container to instantiate and run components
 * and expose them via external entry point.
 *
 * When handling calls "cmd" parameter determines which what action shall be called, while
 * other parameters are passed to the action itself.
 *
 * Container configuration for this Lambda function is stored in <code>"./config/config.yml"</code> file.
 * But this path can be overriden by <code>CONFIG_PATH</code> environment variable.
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
 *     class MyLambdaFunction extends LambdaFunction {
 *         public constructor() {
 *             base("mygroup", "MyGroup lambda function");
 *         }
 *     }
 *
 *     let lambda = new MyLambdaFunction();
 *
 *     await container.run();
 *     console.log("MyLambdaFunction is started");
 */
export declare abstract class LambdaFunction extends Container {
    /**
     * The performanc counters.
     */
    protected _counters: CompositeCounters;
    /**
     * The tracer.
     */
    protected _tracer: CompositeTracer;
    /**
     * The dependency resolver.
     */
    protected _dependencyResolver: DependencyResolver;
    /**
     * The map of registred validation schemas.
     */
    protected _schemas: {
        [id: string]: Schema;
    };
    /**
     * The map of registered actions.
     */
    protected _actions: {
        [id: string]: any;
    };
    /**
     * The default path to config file.
     */
    protected _configPath: string;
    /**
     * Creates a new instance of this lambda function.
     *
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    constructor(name?: string, description?: string);
    private getConfigPath;
    private getParameters;
    private captureErrors;
    private captureExit;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context: IContext): Promise<void>;
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a InstrumentTiming object that is used to end the time measurement.
     *
     * Note: This method has been deprecated. Use LambdaController instead.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param name              a method name.
     * @returns {InstrumentTiming} object to end the time measurement.
     */
    protected instrument(context: IContext, name: string): InstrumentTiming;
    /**
     * Runs this lambda function, loads container configuration,
     * instantiate components and manage their lifecycle,
     * makes this function ready to access action calls.
     *
     */
    run(): Promise<void>;
    /**
     * Registers all actions in this lambda function.
     *
     * Note: Overloading of this method has been deprecated. Use LambdaController instead.
     */
    protected register(): void;
    /**
     * Registers all lambda controllers in the container.
     */
    protected registerControllers(): void;
    /**
     * Registers an action in this lambda function.
     *
     * Note: This method has been deprecated. Use LambdaController instead.
     *
     * @param cmd           a action/command name.
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when action is invoked.
     */
    protected registerAction(cmd: string, schema: Schema, action: (params: any) => Promise<any>): void;
    /**
     * Executes this AWS Lambda function and returns the result.
     * This method can be overloaded in child classes
     * if they need to change the default behavior
     *
     * @params event the event parameters (or function arguments)
     * @returns the result of the function execution.
     */
    protected execute(event: any): Promise<any>;
    private handler;
    /**
     * Gets entry point into this lambda function.
     *
     * @param event     an incoming event object with invocation parameters.
     */
    getHandler(): (event: any) => Promise<any>;
    /**
     * Calls registered action in this lambda function.
     * "cmd" parameter in the action parameters determin
     * what action shall be called.
     *
     * This method shall only be used in testing.
     *
     * @param params action parameters.
     */
    act(params: any): Promise<any>;
}
