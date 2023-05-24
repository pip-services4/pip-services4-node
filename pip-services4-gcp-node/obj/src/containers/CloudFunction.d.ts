import { DependencyResolver } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { Schema } from 'pip-services4-commons-node';
import { Container } from 'pip-services4-container-node';
import { CompositeCounters } from 'pip-services4-components-node';
import { CompositeTracer } from 'pip-services4-components-node';
import { InstrumentTiming } from 'pip-services4-rpc-node';
import { Request, Response } from 'express';
/**
 * Abstract Google Function, that acts as a container to instantiate and run components
 * and expose them via external entry point.
 *
 * When handling calls "cmd" parameter determines which what action shall be called, while
 * other parameters are passed to the action itself.
 *
 * Container configuration for this Google Function is stored in <code>"./config/config.yml"</code> file.
 * But this path can be overriden by <code>CONFIG_PATH</code> environment variable.
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:service:cloudfunc:\*:1.0</code>       (optional) [[https://pip-services4-node.github.io/pip-services4-gcp-node/interfaces/services.iCloudFunctionservice.html ICloudFunctionService]] services to handle action requests
 * - <code>\*:service:commandable-cloudfunc:\*:1.0</code> (optional) [[https://pip-services4-node.github.io/pip-services4-gcp-node/interfaces/services.iCloudFunctionservice.html ICloudFunctionService]] services to handle action requests
 *
 *
 * ### Example ###
 *
 *     class MyCloudFunction extends CloudFunction {
 *         public constructor() {
 *             base("mygroup", "MyGroup Google Function");
 *         }
 *     }
 *
 *     let cloudFunction = new MyCloudFunction();
 *
 *     await cloudFunction.run();
 *     console.log("MyCloudFunction is started");
 */
export declare abstract class CloudFunction extends Container {
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
     * Creates a new instance of this Google Function function.
     *
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    constructor(name?: string, description?: string);
    private getConfigPath;
    private getConfigParameters;
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
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    open(correlationId: string): Promise<void>;
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a InstrumentTiming object that is used to end the time measurement.
     *
     * Note: This method has been deprecated. Use CloudFunctionService instead.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns {InstrumentTiming} object to end the time measurement.
     */
    protected instrument(correlationId: string, name: string): InstrumentTiming;
    /**
     * Runs this Google Function, loads container configuration,
     * instantiate components and manage their lifecycle,
     * makes this function ready to access action calls.
     *
     */
    run(): Promise<void>;
    /**
     * Registers all actions in this Google Function.
     *
     * Note: Overloading of this method has been deprecated. Use CloudFunctionService instead.
     */
    protected register(): void;
    /**
     * Registers all Google Function services in the container.
     */
    protected registerServices(): void;
    /**
     * Registers an action in this Google Function.
     *
     * Note: This method has been deprecated. Use CloudFunctionService instead.
     *
     * @param cmd           a action/command name.
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when action is invoked.
     */
    protected registerAction(cmd: string, schema: Schema, action: (req: Request, res: Response) => Promise<any>): void;
    /**
     * Returns correlationId from Googel Function request.
     * This method can be overloaded in child classes
     * @param req -  Googel Function request
     * @return Returns correlationId from request
     */
    protected getCorrelationId(req: any): string;
    /**
     * Returns command from Google Function request.
     * This method can be overloaded in child classes
     * @param req -  Google Function request
     * @return Returns command from request
     */
    protected getCommand(req: Request): string;
    /**
     * Executes this Google Function and returns the result.
     * This method can be overloaded in child classes
     * if they need to change the default behavior
     *
     * @param req the function request
     * @param res the function response
     * @returns the promise.
     */
    protected execute(req: Request, res: Response): Promise<any>;
    private handler;
    /**
     * Gets entry point into this Google Function.
     *
     * @param res     an incoming request object with invocation parameters.
     * @param res     an returnning response object with result parameters.
     */
    getHandler(): (req: Request, res: Response) => Promise<any>;
}
