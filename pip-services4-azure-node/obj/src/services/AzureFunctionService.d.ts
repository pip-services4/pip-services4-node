/** @module services */
import { IOpenable } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { DependencyResolver } from 'pip-services4-commons-node';
import { CompositeLogger } from 'pip-services4-components-node';
import { CompositeCounters } from 'pip-services4-components-node';
import { CompositeTracer } from 'pip-services4-components-node';
import { InstrumentTiming } from 'pip-services4-rpc-node';
import { Schema } from 'pip-services4-commons-node';
import { AzureFunctionAction } from './AzureFunctionAction';
import { IAzureFunctionService } from './IAzureFunctionService';
/**
 * Abstract service that receives remove calls via Azure Function protocol.
 *
 * This service is intended to work inside AzureFunction container that
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
 *     class MyAzureFunctionService extends AzureFunctionService {
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
 *            registerAction("get_mydata", null, async (context) => {
 *                let context = context.trace_id;
 *                let id = context.id;
 *                return await this._controller.getMyData(context, id);
 *            });
 *            ...
 *        }
 *     }
 *
 *     let service = new MyAzureFunctionService();
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
export declare abstract class AzureFunctionService implements IAzureFunctionService, IOpenable, IConfigurable, IReferenceable {
    private _name;
    private _actions;
    private _interceptors;
    private _opened;
    /**
     * The dependency resolver.
     */
    protected _dependencyResolver: DependencyResolver;
    /**
     * The logger.
     */
    protected _logger: CompositeLogger;
    /**
     * The performance counters.
     */
    protected _counters: CompositeCounters;
    /**
     * The tracer.
     */
    protected _tracer: CompositeTracer;
    /**
     * Creates an instance of this service.
     * @param name a service name to generate action cmd.
     */
    constructor(name?: string);
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Get all actions supported by the service.
     * @returns an array with supported actions.
     */
    getActions(): AzureFunctionAction[];
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param name              a method name.
     * @returns Timing object to end the time measurement.
     */
    protected instrument(context: IContext, name: string): InstrumentTiming;
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen(): boolean;
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context: IContext): Promise<void>;
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    close(context: IContext): Promise<void>;
    protected applyValidation(schema: Schema, action: (context: any) => Promise<any>): (context: any) => Promise<any>;
    protected applyInterceptors(action: (context: any) => Promise<any>): (context: any) => Promise<any>;
    protected generateActionCmd(name: string): string;
    /**
     * Registers a action in Azure Function function.
     *
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when operation is invoked.
     */
    protected registerAction(name: string, schema: Schema, action: (context: any) => Promise<any>): void;
    /**
     * Registers an action with authorization.
     *
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param authorize     an authorization interceptor
     * @param action        an action function that is called when operation is invoked.
     */
    protected registerActionWithAuth(name: string, schema: Schema, authorize: (context: any, next: (context: any) => Promise<any>) => Promise<any>, action: (context: any) => Promise<any>): void;
    /**
     * Registers a middleware for actions in Azure Function service.
     *
     * @param action an action function that is called when middleware is invoked.
     */
    protected registerInterceptor(cmd: string, action: (context: any, next: (context: any) => Promise<any>) => Promise<any>): void;
    /**
     * Registers all service routes in HTTP endpoint.
     *
     * This method is called by the service and must be overridden
     * in child classes.
     */
    protected abstract register(): void;
    /**
     * Returns context from Azure Function context.
     * This method can be overloaded in child classes
     * @param context - the context context
     * @return returns context from context
     */
    protected getTraceId(context: any): string;
    /**
     * Returns command from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  the context context
     * @return returns command from context
     */
    protected getCommand(context: any): string;
    /**
     * Calls registered action in this Azure Function.
     * "cmd" parameter in the action parameters determine
     * what action shall be called.
     *
     * This method shall only be used in testing.
     *
     * @param context the context context.
     */
    act(context: any): Promise<any>;
}
