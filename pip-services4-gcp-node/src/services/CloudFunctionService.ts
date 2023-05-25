/** @module services */

import {Request, Response} from 'express';

import { IOpenable } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { DependencyResolver } from 'pip-services4-commons-node';
import { CompositeLogger } from 'pip-services4-components-node';
import { CompositeCounters } from 'pip-services4-components-node';
import { CompositeTracer } from 'pip-services4-components-node';
import { HttpResponseSender, InstrumentTiming } from 'pip-services4-rpc-node';
import { Schema } from 'pip-services4-commons-node';

import { CloudFunctionAction } from './CloudFunctionAction';
import { ICloudFunctionService } from './ICloudFunctionService';
import { CloudFunctionRequestHelper } from '../containers/CloudFunctionRequestHelper';

/**
 * Abstract service that receives remove calls via Google Function protocol.
 * 
 * This service is intended to work inside CloudFunction container that
 * exposes registered actions externally.
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
 * 
 * ### Example ###
 * 
 *     class MyCloudFunctionService extends CloudFunctionService {
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
 *            registerAction("get_mydata", null, async (req, res) => {
 *                let params = req.body;
 *                let context = params.trace_id;
 *                let id = params.id;
 *                const result = await this._controller.getMyData(context, id);
 *                
 *                res.send(result);
 *            });
 *            ...
 *        }
 *     }
 * 
 *     let service = new MyCloudFunctionService();
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
 */
export abstract class CloudFunctionService implements ICloudFunctionService, IOpenable, IConfigurable,
    IReferenceable {

    private _name: string;
    private _actions: CloudFunctionAction[] = [];
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
    public getActions(): CloudFunctionAction[] {
        return this._actions;
    }

    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
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

    protected applyValidation(schema: Schema, action: (req: Request, res: Response) => Promise<any>): (req: Request, res: Response) => Promise<any> {
        // Create an action function
        let actionWrapper = async (req, res) => {
            // Validate object
            if (schema && req) {
                // Perform validation
                let params = Object.assign({}, req.params, req.query, { body: req.body });
                let context = this.getTraceId(req);
                let err = schema.validateAndReturnException(context, params, false);
                if (err) {
                    HttpResponseSender.sendError(req, res, err);
                }
            }

            return action.call(this, req, res);
        };

        return actionWrapper;
    }

    protected applyInterceptors(action: (req: Request, res: Response) => Promise<any>): (req: Request, res: Response) => Promise<any> {
        let actionWrapper = action;

        for (let index = this._interceptors.length - 1; index >= 0; index--) {
            let interceptor = this._interceptors[index];
            actionWrapper = ((action) => {
                return (req, res) => {
                    return interceptor(req, res, action);
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
     * Registers a action in Google Function function.
     * 
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when operation is invoked.
     */
    protected registerAction(name: string, schema: Schema, action: (req: Request, res: Response) => Promise<any>): void {
        let actionWrapper = this.applyValidation(schema, action);
        actionWrapper = this.applyInterceptors(actionWrapper);

        let self = this;
        let registeredAction: CloudFunctionAction = {
            cmd: this.generateActionCmd(name), 
            schema: schema,
            action: (req: Request, res: Response) => { return actionWrapper.call(self, req, res); }
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
        authorize: (req: Request, res: Response, next: (req: Request, res: Response) => Promise<any>) => Promise<any>,
        action: (req: Request, res: Response) => Promise<any>): void {
    
        let actionWrapper = this.applyValidation(schema, action);
        // Add authorization just before validation
        actionWrapper = (req, res) => {
            return authorize(req, res, actionWrapper);
        };
        actionWrapper = this.applyInterceptors(actionWrapper);

        let self = this;
        let registeredAction: CloudFunctionAction = {
            cmd: this.generateActionCmd(name), 
            schema: schema,
            action: (req, res) => { return actionWrapper.call(self, req, res); }
        };
        this._actions.push(registeredAction);
    }

    /**
     * Registers a middleware for actions in Google Function service.
     * 
     * @param action an action function that is called when middleware is invoked.
     */
    protected registerInterceptor(cmd: string, action: (req: Request, res: Response, next: (req: Request, res: Response) => void) => void): void {
        let self = this;
        let interceptorWrapper = (req: Request, res: Response, next: () => void) => {
            let currCmd = this.getCommand(req);
            let match = (currCmd.match(cmd) || []).length > 0;
            if (cmd != null && cmd != "" && !match)
                next.call(self, req, res);
            else action.call(self,req, res, next);
        }

        this._interceptors.push(interceptorWrapper);
    }

    /**
     * Registers all service routes in HTTP endpoint.
     * 
     * This method is called by the service and must be overridden
     * in child classes.
     */
    protected abstract register(): void;

    /**
     * Returns context from Google Function request.
     * This method can be overloaded in child classes
     * @param req - the function request
     * @return returns context from request
     */
    protected getTraceId(req: any): string {
        return CloudFunctionRequestHelper.getTraceId(req);
    }

    /**
     * Returns command from Google Function request.
     * This method can be overloaded in child classes
     * @param req -  the function request
     * @return returns command from request
     */
    protected getCommand(req: any): string {
        return CloudFunctionRequestHelper.getCommand(req);
    }
}