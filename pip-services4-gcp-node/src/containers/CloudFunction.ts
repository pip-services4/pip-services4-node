/** @module containers */
/** @hidden */ 
const process = require('process');

import { BadRequestException } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { DependencyResolver } from 'pip-services4-commons-node';
import { Descriptor } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { Schema } from 'pip-services4-commons-node';
import { UnknownException } from 'pip-services4-commons-node';
import { Container } from 'pip-services4-container-node';
import { CompositeCounters } from 'pip-services4-components-node';
import { ConsoleLogger } from 'pip-services4-components-node';
import { CompositeTracer } from 'pip-services4-components-node';
import { HttpResponseSender, InstrumentTiming } from 'pip-services4-rpc-node';

import { CloudFunctionRequestHelper } from './CloudFunctionRequestHelper';
import { ICloudFunctionService } from '../services/ICloudFunctionService';

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
export abstract class CloudFunction extends Container {
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
    protected _configPath: string = './config/config.yml';

    /**
     * Creates a new instance of this Google Function function.
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

    private getConfigParameters(): ConfigParams {
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
         this.registerServices();
     }


    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a InstrumentTiming object that is used to end the time measurement.
     * 
     * Note: This method has been deprecated. Use CloudFunctionService instead.
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns {InstrumentTiming} object to end the time measurement.
     */
    protected instrument(context: IContext, name: string): InstrumentTiming {
        this._logger.trace(context, "Executing %s method", name);
        this._counters.incrementOne(name + ".exec_count");

        let counterTiming = this._counters.beginTiming(name + ".exec_time");
        let traceTiming = this._tracer.beginTrace(context, name, null);
        return new InstrumentTiming(context, name, "exec",
            this._logger, this._counters, counterTiming, traceTiming);
    }

    /**
     * Runs this Google Function, loads container configuration,
     * instantiate components and manage their lifecycle,
     * makes this function ready to access action calls.
     *  
     */
    public async run(): Promise<void> {
        let context = this._info.name;

        let path = this.getConfigPath();
        let parameters = this.getConfigParameters();
        this.readConfigFromFile(context, path, parameters);

        this.captureErrors(context);
        this.captureExit(context);
    	await this.open(context);
    }

    /**
     * Registers all actions in this Google Function.
     *
     * Note: Overloading of this method has been deprecated. Use CloudFunctionService instead.
     */
    protected register(): void {}

    /**
     * Registers all Google Function services in the container.
     */
    protected registerServices(): void {
        // Extract regular and commandable Google Function services from references
        let services = this._references.getOptional<ICloudFunctionService>(
            new Descriptor("*", "service", "cloudfunc", "*", "*")
        );
        let cmdServices = this._references.getOptional<ICloudFunctionService>(
            new Descriptor("*", "service", "commandable-cloudfunc", "*", "*")
        );
        services.push(...cmdServices);

        // Register actions defined in those services
        for (let service of services) {
            // Check if the service implements required interface
            if (typeof service.getActions !== "function") continue;

            let actions = service.getActions();
            for (let action of actions) {
                this.registerAction(action.cmd, action.schema, action.action);
            }
        }
    }

    /**
     * Registers an action in this Google Function.
     * 
     * Note: This method has been deprecated. Use CloudFunctionService instead.
     * 
     * @param cmd           a action/command name.
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when action is invoked.
     */
    protected registerAction(cmd: string, schema: Schema, 
        action: (req: Request, res: Response) => Promise<any>): void {
        if (cmd == '') {
            throw new UnknownException(null, 'NO_COMMAND', 'Missing command');
        }

        if (action == null) {
            throw new UnknownException(null, 'NO_ACTION', 'Missing action');
        }

        if (typeof action != "function") {
            throw new UnknownException(null, 'ACTION_NOT_FUNCTION', 'Action is not a function');
        }

        if (this._actions.hasOwnProperty(cmd)) {
            throw new UnknownException(null, 'DUPLICATED_ACTION', `"${cmd}" action already exists`);
        }

        // Hack!!! Wrapping action to preserve prototyping request
        const actionCurl = async (req: Request, res: Response) => {
            // Perform validation
            if (schema != null) {
                let params = Object.assign({}, req.params, req.query, { body: req.body });
                let context = this.getTraceId(req);
                let err = schema.validateAndReturnException(context, params, false);
                if (err != null) {
                    HttpResponseSender.sendError(req, res, err);
                }
            }

            // Todo: perform verification?
            return await action.call(this, req, res);
        };

        this._actions[cmd] = actionCurl;
    }

    /**
     * Returns context from Googel Function request.
     * This method can be overloaded in child classes
     * @param req -  Googel Function request
     * @return Returns context from request
     */
    protected getTraceId(req: any): string {
        return CloudFunctionRequestHelper.getTraceId(req);
    }

    /**
     * Returns command from Google Function request.
     * This method can be overloaded in child classes
     * @param req -  Google Function request
     * @return Returns command from request
     */
    protected getCommand(req: Request): string {
        return CloudFunctionRequestHelper.getCommand(req);
    }

    /**
     * Executes this Google Function and returns the result.
     * This method can be overloaded in child classes
     * if they need to change the default behavior
     * 
     * @param req the function request
     * @param res the function response
     * @returns the promise.
     */
    protected async execute(req: Request, res: Response): Promise<any> {
        let cmd: string = this.getCommand(req);
        let context = this.getTraceId(req);
        if (cmd == null) {
            HttpResponseSender.sendError(req, res,
                new BadRequestException(
                    context,
                    'NO_COMMAND',
                    'Cmd parameter is missing'
                )
            );
            return;
        }
        
        const action: any = this._actions[cmd];
        if (action == null) {
            HttpResponseSender.sendError(req, res, 
                new BadRequestException(
                    context,
                    'NO_ACTION',
                    'Action ' + cmd + ' was not found'
                ).withDetails('command', cmd)
            );
            return;
        }
        
        return await action(req, res);
    }
    
    private async handler(req: Request, res: Response): Promise<any> {
        // If already started then execute
        if (this.isOpen()) {
            return await this.execute(req, res);
        }
        // Start before execute
        await this.run();
        return await this.execute(req, res);
    }
    
    /**
     * Gets entry point into this Google Function.
     * 
     * @param res     an incoming request object with invocation parameters.
     * @param res     an returnning response object with result parameters.
     */
    public getHandler(): (req: Request, res: Response) => Promise<any> {
        let self = this;
        
        // Return plugin function
        return async function (req, res) {
            // Calling run with changed request
            return self.handler.call(self, req, res);
        }
    }
}