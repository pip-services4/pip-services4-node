/** @module services */

import { IOpenable } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { DependencyResolver } from 'pip-services4-commons-node';
import { BadRequestException } from 'pip-services4-commons-node';
import { CompositeLogger } from 'pip-services4-components-node';
import { CompositeCounters } from 'pip-services4-components-node';
import { CompositeTracer } from 'pip-services4-components-node';
import { InstrumentTiming } from 'pip-services4-rpc-node';
import { Schema } from 'pip-services4-commons-node';

import { LambdaAction } from './LambdaAction';
import { ILambdaService } from './ILambdaService';

/**
 * Abstract service that receives remove calls via AWS Lambda protocol.
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
 * @see [[LambdaClient]]
 * 
 * ### Example ###
 * 
 *     class MyLambdaService extends LambdaService {
 *        private _controller: IMyController;
 *        ...
 *        public constructor() {
 *           base('v1.myservice');
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 * 
 *        public setReferences(references: IReferences): void {
 *           base.setReferences(references);
 *           this._controller = this._dependencyResolver.getRequired<IMyController>("controller");
 *        }
 * 
 *        public register(): void {
 *            registerAction("get_mydata", null, async (params) => {
 *                let context = params.trace_id;
 *                let id = params.id;
 *                return await this._controller.getMyData(context, id);
 *            });
 *            ...
 *        }
 *     }
 * 
 *     let service = new MyLambdaService();
 *     service.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *     service.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","controller","default","default","1.0"), controller
 *     ));
 * 
 *     service.open("123");
 *     console.log("The GRPC service is running on port 8080");
 */
export abstract class LambdaService implements ILambdaService, IOpenable, IConfigurable,
    IReferenceable {

    protected _name: string;
    private _actions: LambdaAction[] = [];
    private _interceptors: any[] = [];
    private _opened: boolean;

    /**
     * The dependency resolver.
     */
    protected _dependencyResolver: DependencyResolver = new DependencyResolver();
    /**
     * The logger.
     */
    protected _logger: CompositeLogger = new CompositeLogger();
    /**
     * The performance counters.
     */
    protected _counters: CompositeCounters = new CompositeCounters();
    /**
     * The tracer.
     */
    protected _tracer: CompositeTracer = new CompositeTracer();

    /**
     * Creates an instance of this service.
     * @param name a service name to generate action cmd.
     */
    public constructor(name?: string) {
        this._name = name;
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    /**
     * Sets references to dependent components.
     * 
     * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._tracer.setReferences(references);
        this._dependencyResolver.setReferences(references);
    }

    /**
     * Get all actions supported by the service.
     * @returns an array with supported actions.
     */
    public getActions(): LambdaAction[] {
        return this._actions;
    }

    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param name              a method name.
     * @returns Timing object to end the time measurement.
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
     * Checks if the component is opened.
     * 
     * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._opened;
    }

    /**
     * Opens the component.
     * 
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        if (this._opened) {
            return;
        }

        this.register();

        this._opened = true;
    }

    /**
     * Closes component and frees used resources.
     * 
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async close(context: IContext): Promise<void> {
        if (!this._opened) {
            return;
        }

        this._opened = false;
        this._actions = [];
        this._interceptors = [];
    }

    protected applyValidation(schema: Schema, action: (params: any) => Promise<any>): (params: any) => Promise<any> {
        // Create an action function
        let actionWrapper = async (params) => {
            // Validate object
            if (schema && params) {
                // Perform validation                    
                let context = params.trace_id;
                let err = schema.validateAndReturnException(context, params, false);
                if (err) {
                    throw err;
                }
            }

            let result = await action.call(this, params);
            return result;
        };

        return actionWrapper;
    }

    protected applyInterceptors(action: (params: any) => Promise<any>): (params: any) => Promise<any> {
        let actionWrapper = action;

        for (let index = this._interceptors.length - 1; index >= 0; index--) {
            let interceptor = this._interceptors[index];
            actionWrapper = ((action) => {
                return (params) => {
                    return interceptor(params, action);
                };
            })(actionWrapper);
        }

        return actionWrapper;
    }

    protected generateActionCmd(name: string): string {
        let cmd = name;
        if (this._name != null) {
            cmd = this._name + "." + cmd;
        }   
        return cmd;
    }

    /**
     * Registers a action in AWS Lambda function.
     * 
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when operation is invoked.
     */
    protected registerAction(name: string, schema: Schema, action: (params: any) => Promise<any>): void {
        let actionWrapper = this.applyValidation(schema, action);
        actionWrapper = this.applyInterceptors(actionWrapper);

        let self = this;
        let registeredAction: LambdaAction = {
            cmd: this.generateActionCmd(name), 
            schema: schema,
            action: (params) => { return actionWrapper.call(self, params); }
        };
        this._actions.push(registeredAction);
    }

    /**
     * Registers an action with authorization.
     * 
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param authorize     an authorization interceptor
     * @param action        an action function that is called when operation is invoked.
     */
    protected registerActionWithAuth(name: string, schema: Schema,
        authorize: (call: any, next: (call: any) => Promise<any>) => Promise<any>,
        action: (call: any) => Promise<any>): void {
    
        let actionWrapper = this.applyValidation(schema, action);
        // Add authorization just before validation
        actionWrapper = (call) => {
            return authorize(call, actionWrapper);
        };
        actionWrapper = this.applyInterceptors(actionWrapper);

        let self = this;
        let registeredAction: LambdaAction = {
            cmd: this.generateActionCmd(name), 
            schema: schema,
            action: (params) => { return actionWrapper.call(self, params); }
        };
        this._actions.push(registeredAction);
    }

    /**
     * Registers a middleware for actions in AWS Lambda service.
     * 
     * @param action        an action function that is called when middleware is invoked.
     */
    protected registerInterceptor(action: (params: any, next: (params: any) => Promise<any>) => Promise<any>): void {
        this._interceptors.push(action);
    }

    /**
     * Registers all service routes in HTTP endpoint.
     * 
     * This method is called by the service and must be overriden
     * in child classes.
     */
    protected abstract register(): void;

    /**
     * Calls registered action in this lambda function.
     * "cmd" parameter in the action parameters determin
     * what action shall be called.
     * 
     * This method shall only be used in testing.
     * 
     * @param params action parameters.
     */
     public async act(params: any): Promise<any> {
        let cmd: string = params.cmd;
        let context = params.trace_id;
        
        if (cmd == null) {
            throw new BadRequestException(
                context, 
                'NO_COMMAND', 
                'Cmd parameter is missing'
            );
        }
        
        const action: LambdaAction = this._actions.find(a => a.cmd == cmd);
        if (action == null) {
            throw new BadRequestException(
                context, 
                'NO_ACTION', 
                'Action ' + cmd + ' was not found'
            )
            .withDetails('command', cmd);
        }

        return action.action(params);
    }

}