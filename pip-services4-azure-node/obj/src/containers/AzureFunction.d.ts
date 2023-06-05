import { DependencyResolver, IContext, IReferences } from 'pip-services4-components-node';
import { Container } from 'pip-services4-container-node';
import { Schema } from 'pip-services4-data-node';
import { CompositeCounters, CompositeTracer } from 'pip-services4-observability-node';
import { InstrumentTiming } from 'pip-services4-rpc-node';
/**
 * Abstract Azure Function, that acts as a container to instantiate and run components
 * and expose them via external entry point.
 *
 * When handling calls "cmd" parameter determines which what action shall be called, while
 * other parameters are passed to the action itself.
 *
 * Container configuration for this Azure Function is stored in <code>"./config/config.yml"</code> file.
 * But this path can be overriden by <code>CONFIG_PATH</code> environment variable.
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
 *     class MyAzureFunctionFunction extends AzureFunction {
 *         public constructor() {
 *             base("mygroup", "MyGroup Azure Function");
 *         }
 *     }
 *
 *     let azureFunction = new MyAzureFunctionFunction();
 *
 *     await controller.run();
 *     console.log("MyAzureFunctionFunction is started");
 */
export declare abstract class AzureFunction extends Container {
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
     * Creates a new instance of this Azure Function function.
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
     * Note: This method has been deprecated. Use AzureFunctionController instead.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param name              a method name.
     * @returns {InstrumentTiming} object to end the time measurement.
     */
    protected instrument(context: IContext, name: string): InstrumentTiming;
    /**
     * Runs this Azure Function, loads container configuration,
     * instantiate components and manage their lifecycle,
     * makes this function ready to access action calls.
     *
     */
    run(): Promise<void>;
    /**
     * Registers all actions in this Azure Function.
     *
     * Note: Overloading of this method has been deprecated. Use AzureFunctionController instead.
     */
    protected register(): void;
    /**
     * Registers all Azure Function controllers in the container.
     */
    protected registerControllers(): void;
    /**
     * Registers an action in this Azure Function.
     *
     * Note: This method has been deprecated. Use AzureFunctionController instead.
     *
     * @param cmd           a action/command name.
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when action is invoked.
     */
    protected registerAction(cmd: string, schema: Schema, action: (context: any) => Promise<any>): void;
    /**
     * Returns context from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  Azure Function context
     * @return Returns context from context
     */
    protected getTraceId(context: any): string;
    /**
     * Returns command from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  Azure Function context
     * @return Returns command from context
     */
    protected getCommand(context: any): string;
    /**
     * Executes this Azure Function and returns the result.
     * This method can be overloaded in child classes
     * if they need to change the default behavior
     *
     * @params context the context parameters (or function arguments)
     * @returns the result of the function execution.
     */
    protected execute(context: any): Promise<any>;
    private handler;
    /**
     * Gets entry point into this Azure Function.
     *
     * @param context     an incoming context object with invocation parameters.
     */
    getHandler(): (context: any) => Promise<any>;
    /**
     * Calls registered action in this Azure Function.
     * "cmd" parameter in the action parameters determin
     * what action shall be called.
     *
     * This method shall only be used in testing.
     *
     * @param context action parameters.
     */
    act(context: any): Promise<any>;
}
