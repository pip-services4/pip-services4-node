/** @module containers */
/** @hidden */ 
import process = require('process');

import { BadRequestException, UnknownException } from 'pip-services4-commons-node';


import { AzureFunctionContextHelper } from './AzureFunctionContextHelper';
import { IAzureFunctionController } from '../controllers/IAzureFunctionController';
import { DependencyResolver, ConfigParams, IContext, IReferences, Descriptor, Context } from 'pip-services4-components-node';
import { Container } from 'pip-services4-container-node';
import { Schema } from 'pip-services4-data-node';
import { CompositeCounters, CompositeTracer, ConsoleLogger } from 'pip-services4-observability-node';
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
export abstract class AzureFunction extends Container {
    /**
     * The performanc counters.
     */
    protected _counters = new CompositeCounters();
    /**
     * The tracer.
     */
    protected _tracer: CompositeTracer = new CompositeTracer();
    /**
     * The dependency resolver.
     */
    protected _dependencyResolver = new DependencyResolver();
    /**
     * The map of registred validation schemas.
     */
    protected _schemas: { [id: string]: Schema } = {};
    /**
     * The map of registered actions.
     */
    protected _actions: { [id: string]: any } = {};
    /**
     * The default path to config file.
     */
    protected _configPath = './config/config.yml';

    /**
     * Creates a new instance of this Azure Function function.
     * 
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    public constructor(name?: string, description?: string) {
        super(name, description);

        this._logger = new ConsoleLogger();
    }

    private getConfigPath(): string {
        return process.env.CONFIG_PATH || this._configPath;
    }

    private getParameters(): ConfigParams {
        return ConfigParams.fromValue(process.env);
    }

    private captureErrors(context: IContext): void {
        // Log uncaught exceptions
        process.on('uncaughtException', (ex) => {
            this._logger.fatal(context, ex, "Process is terminated");
            process.exit(1);
        });
    }

    private captureExit(context: IContext): void {
        this._logger.info(context, "Press Control-C to stop the microservice...");

        // Activate graceful exit
        process.on('SIGINT', () => {
            process.exit();
        });

        // Gracefully shutdown
        process.on('exit', () => {
            this.close(context);
            this._logger.info(context, "Goodbye!");
        });
    }

	/**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
	 */
    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._counters.setReferences(references);
        this._dependencyResolver.setReferences(references);

        this.register();
    }

    /**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
     public async open(context: IContext): Promise<void> {
         if (this.isOpen()) return;

         await super.open(context);
         this.registerControllers();
     }


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
    protected instrument(context: IContext, name: string): InstrumentTiming {
        this._logger.trace(context, "Executing %s method", name);
        this._counters.incrementOne(name + ".exec_count");

        const counterTiming = this._counters.beginTiming(name + ".exec_time");
        const traceTiming = this._tracer.beginTrace(context, name, null);
        return new InstrumentTiming(context, name, "exec",
            this._logger, this._counters, counterTiming, traceTiming);
    }

    /**
     * Runs this Azure Function, loads container configuration,
     * instantiate components and manage their lifecycle,
     * makes this function ready to access action calls.
     *  
     */
    public async run(): Promise<void> {
        const context = Context.fromTraceId(this._info.name);

        const path = this.getConfigPath();
        const parameters = this.getParameters();
        this.readConfigFromFile(context, path, parameters);

        this.captureErrors(context);
        this.captureExit(context);
        await this.open(context);
    }

    /**
     * Registers all actions in this Azure Function.
     *
     * Note: Overloading of this method has been deprecated. Use AzureFunctionController instead.
     */
    protected register(): void {
        //
    }

    /**
     * Registers all Azure Function controllers in the container.
     */
    protected registerControllers(): void {
        // Extract regular and commandable Azure Function controllers from references
        const controllers = this._references.getOptional<IAzureFunctionController>(
            new Descriptor("*", "controller", "azurefunc", "*", "*")
        );
        const cmdServices = this._references.getOptional<IAzureFunctionController>(
            new Descriptor("*", "controller", "commandable-azurefunc", "*", "*")
        );
        controllers.push(...cmdServices);

        // Register actions defined in those controller
        for (const controller of controllers) {
            // Check if the controller implements required interface
            if (typeof controller.getActions !== "function") continue;

            const actions = controller.getActions();
            for (const action of actions) {
                this.registerAction(action.cmd, action.schema, action.action);
            }
        }
    }

    /**
     * Registers an action in this Azure Function.
     * 
     * Note: This method has been deprecated. Use AzureFunctionController instead.
     * 
     * @param cmd           a action/command name.
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when action is invoked.
     */
    protected registerAction(cmd: string, schema: Schema, 
        action: (context: any) => Promise<any>): void {
        if (cmd == '') {
            throw new UnknownException(null, 'NO_COMMAND', 'Missing command');
        }

        if (action == null) {
            throw new UnknownException(null, 'NO_ACTION', 'Missing action');
        }

        if (typeof action != "function") {
            throw new UnknownException(null, 'ACTION_NOT_FUNCTION', 'Action is not a function');
        }

        if (Object.prototype.hasOwnProperty.call(this._actions, cmd)) {
            throw new UnknownException(null, 'DUPLICATED_ACTION', `"${cmd}" action already exists`);
        }

        // Hack!!! Wrapping action to preserve prototyping context
        const actionCurl = (actionContext: { params: any; query: any; body: any; }) => {
            // Perform validation
            if (schema != null) {
                const params = Object.assign({}, actionContext.params, actionContext.query, { body: actionContext.body });
                const traceId = this.getTraceId(actionContext);
                const err = schema.validateAndReturnException(traceId, params, false);
                if (err != null) {
                    return err;
                }
            }

            // Todo: perform verification?
            return action.call(this, actionContext);
        };

        this._actions[cmd] = actionCurl;
    }

    /**
     * Returns context from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  Azure Function context
     * @return Returns context from context
     */
    protected getTraceId(context: any): string {
        return AzureFunctionContextHelper.getTraceId(context);
    }

    /**
     * Returns command from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  Azure Function context
     * @return Returns command from context
     */
    protected getCommand(context: any): string {
        return AzureFunctionContextHelper.getCommand(context);
    }

    /**
     * Executes this Azure Function and returns the result.
     * This method can be overloaded in child classes
     * if they need to change the default behavior
     * 
     * @params context the context parameters (or function arguments)
     * @returns the result of the function execution.
     */
    protected async execute(context: any): Promise<any> {
        const cmd: string = this.getCommand(context);
        const traceId = this.getTraceId(context);
        if (cmd == null) {
            throw new BadRequestException(
                traceId, 
                'NO_COMMAND', 
                'Cmd parameter is missing'
            );
        }
        
        const action: any = this._actions[cmd];
        if (action == null) {
            throw new BadRequestException(
                traceId, 
                'NO_ACTION', 
                'Action ' + cmd + ' was not found'
            )
            .withDetails('command', cmd);
        }
        
        return action(context);
    }
    
    private async handler(context: any): Promise<any> {
        // If already started then execute
        if (this.isOpen()) {
            return this.execute(context);
        }
        // Start before execute
        await this.run();
        return this.execute(context);
    }
    
    /**
     * Gets entry point into this Azure Function.
     * 
     * @param context     an incoming context object with invocation parameters.
     */
    public getHandler(): (context: any) => Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        
        // Return plugin function
        return async function (context) {
            // Calling run with changed context
            return self.handler.call(self, context);
        }
    }

    /**
     * Calls registered action in this Azure Function.
     * "cmd" parameter in the action parameters determin
     * what action shall be called.
     * 
     * This method shall only be used in testing.
     * 
     * @param context action parameters.
     */
    public async act(context: any): Promise<any> {
        return this.getHandler()({ body: context });
    }

}