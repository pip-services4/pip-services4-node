/** @module services */

import { AzureFunctionAction } from './AzureFunctionAction';
import { IAzureFunctionController } from './IAzureFunctionController';
import { AzureFunctionContextHelper } from '../containers/AzureFunctionContextHelper';
import { BadRequestException } from 'pip-services4-commons-node';
import { IOpenable, IConfigurable, IReferenceable, DependencyResolver, ConfigParams, IReferences, IContext } from 'pip-services4-components-node';
import { Schema } from 'pip-services4-data-node';
import { CompositeLogger, CompositeCounters, CompositeTracer } from 'pip-services4-observability-node';
import { InstrumentTiming } from 'pip-services4-rpc-node';

/**
 * Abstract controller that receives remove calls via Azure Function protocol.
 * 
 * This controller is intended to work inside AzureFunction container that
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
 *     class MyAzureFunctionController extends AzureFunctionController {
 *        private _controller: IMyController;
 *        ...
 *        public constructor() {
 *           base('v1.mycontroller');
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
 *            registerAction("get_mydata", null, async (context) => {
 *                let context = context.trace_id;
 *                let id = context.id;
 *                return await this._controller.getMyData(context, id);
 *            });
 *            ...
 *        }
 *     }
 * 
 *     let controller = new MyAzureFunctionController();
 *     controller.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *     controller.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","controller","default","default","1.0"), controller
 *     ));
 * 
 *     controller.open("123");
 */
export abstract class AzureFunctionController implements IAzureFunctionController, IOpenable, IConfigurable,
    IReferenceable {

    private _name: string;
    private _actions: AzureFunctionAction[] = [];
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
     * Creates an instance of this controller.
     * @param name a controller name to generate action cmd.
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
     * Get all actions supported by the controller.
     * @returns an array with supported actions.
     */
    public getActions(): AzureFunctionAction[] {
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

        const counterTiming = this._counters.beginTiming(name + ".exec_time");
        const traceTiming = this._tracer.beginTrace(context, name, null);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async close(context: IContext): Promise<void> {
        if (!this._opened) {
            return;
        }

        this._opened = false;
        this._actions = [];
        this._interceptors = [];
    }

    protected applyValidation(schema: Schema, action: (context: any) => Promise<any>): (context: any) => Promise<any> {
        // Create an action function
        const actionWrapper = async (reqContext) => {
            // Validate object
            if (schema && reqContext) {
                // Perform validation
                const params = Object.assign({}, reqContext.params, reqContext.query, { body: reqContext.body });
                const traceId = this.getTraceId(reqContext);
                const err = schema.validateAndReturnException(traceId, params, false);
                if (err) {
                    return err;
                }
            }

            const result = await action.call(this, reqContext);
            return result;
        };

        return actionWrapper;
    }

    protected applyInterceptors(action: (context: any) => Promise<any>): (context: any) => Promise<any> {
        let actionWrapper = action;

        for (let index = this._interceptors.length - 1; index >= 0; index--) {
            const interceptor = this._interceptors[index];
            actionWrapper = ((action) => {
                return (context) => {
                    return interceptor(context, action);
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
     * Registers a action in Azure Function function.
     * 
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when operation is invoked.
     */
    protected registerAction(name: string, schema: Schema, action: (context: any) => Promise<any>): void {
        let actionWrapper = this.applyValidation(schema, action);
        actionWrapper = this.applyInterceptors(actionWrapper);

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const registeredAction: AzureFunctionAction = {
            cmd: this.generateActionCmd(name), 
            schema: schema,
            action: (context) => { return actionWrapper.call(self, context); }
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
        authorize: (context: any, next: (context: any) => Promise<any>) => Promise<any>,
        action: (context: any) => Promise<any>): void {
    
        let actionWrapper = this.applyValidation(schema, action);
        // Add authorization just before validation
        actionWrapper = (call) => {
            return authorize(call, actionWrapper);
        };
        actionWrapper = this.applyInterceptors(actionWrapper);

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const registeredAction: AzureFunctionAction = {
            cmd: this.generateActionCmd(name), 
            schema: schema,
            action: (context) => { return actionWrapper.call(self, context); }
        };
        this._actions.push(registeredAction);
    }

    /**
     * Registers a middleware for actions in Azure Function controller.
     * 
     * @param action an action function that is called when middleware is invoked.
     */
    protected registerInterceptor(cmd: string, action: (context: any, next: (context: any) => Promise<any>) => Promise<any>): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const interceptorWrapper = async (req: Request, next: (context: any) => Promise<any>) => {
            const currCmd = this.getCommand(req);
            const match = (currCmd.match(cmd) || []).length > 0;
            if (cmd != null && cmd != "" && !match)
                return await next.call(self, req);
            else 
                return await action.call(self, req, next);
        }

        this._interceptors.push(interceptorWrapper);
    }

    /**
     * Registers all controller routes in HTTP endpoint.
     * 
     * This method is called by the controller and must be overridden
     * in child classes.
     */
    protected abstract register(): void;

    /**
     * Returns context from Azure Function context.
     * This method can be overloaded in child classes
     * @param context - the context context
     * @return returns context from context
     */
    protected getTraceId(context: any): string {
        return AzureFunctionContextHelper.getTraceId(context);
    }

    /**
     * Returns command from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  the context context
     * @return returns command from context
     */
    protected getCommand(context: any): string {
        return AzureFunctionContextHelper.getCommand(context);
    }

    /**
     * Calls registered action in this Azure Function.
     * "cmd" parameter in the action parameters determine
     * what action shall be called.
     * 
     * This method shall only be used in testing.
     * 
     * @param context the context context.
     */
     // eslint-disable-next-line prefer-const
     public async act(context: any): Promise<any> {
        const cmd: string = this.getCommand(context);
        const traceId = this.getTraceId(context);
        
        if (cmd == null) {
            throw new BadRequestException(
                traceId, 
                'NO_COMMAND', 
                'Cmd parameter is missing'
            );
        }
        
        const action: AzureFunctionAction = this._actions.find(a => a.cmd == cmd);
        if (action == null) {
            throw new BadRequestException(
                traceId,
                'NO_ACTION', 
                'Action ' + cmd + ' was not found'
            )
            .withDetails('command', cmd);
        }

        return action.action(context);
    }

}