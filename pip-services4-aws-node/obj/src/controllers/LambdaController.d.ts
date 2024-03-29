/** @module controllers */
import { LambdaAction } from './LambdaAction';
import { ILambdaController } from './ILambdaController';
import { IOpenable, IConfigurable, IReferenceable, DependencyResolver, ConfigParams, IReferences, IContext } from 'pip-services4-components-node';
import { InstrumentTiming } from 'pip-services4-rpc-node';
import { Schema } from 'pip-services4-data-node';
import { CompositeLogger, CompositeCounters, CompositeTracer } from 'pip-services4-observability-node';
/**
 * Abstract controller that receives remove calls via AWS Lambda protocol.
 *
 * This controller is intended to work inside LambdaFunction container that
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
 *     class MyLambdaController extends LambdaController {
 *        private _service: IMyService;
 *        ...
 *        public constructor() {
 *           base('v1.mycontroller');
 *           this._dependencyResolver.put(
 *               "service",
 *               new Descriptor("mygroup","service","*","*","1.0")
 *           );
 *        }
 *
 *        public setReferences(references: IReferences): void {
 *           base.setReferences(references);
 *           this._service = this._dependencyResolver.getRequired<IMyService>("service");
 *        }
 *
 *        public register(): void {
 *            registerAction("get_mydata", null, async (params) => {
 *                let context = params.trace_id;
 *                let id = params.id;
 *                return await this._service.getMyData(context, id);
 *            });
 *            ...
 *        }
 *     }
 *
 *     let controller = new MyLambdaController();
 *     controller.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *     controller.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","service","default","default","1.0"), service
 *     ));
 *
 *     controller.open("123");
 *     console.log("The GRPC controller is running on port 8080");
 */
export declare abstract class LambdaController implements ILambdaController, IOpenable, IConfigurable, IReferenceable {
    protected _name: string;
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
     * Creates an instance of this controller.
     * @param name a controller name to generate action cmd.
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
     * Get all actions supported by the controller.
     * @returns an array with supported actions.
     */
    getActions(): LambdaAction[];
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
    protected applyValidation(schema: Schema, action: (params: any) => Promise<any>): (params: any) => Promise<any>;
    protected applyInterceptors(action: (params: any) => Promise<any>): (params: any) => Promise<any>;
    protected generateActionCmd(name: string): string;
    /**
     * Registers a action in AWS Lambda function.
     *
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when operation is invoked.
     */
    protected registerAction(name: string, schema: Schema, action: (params: any) => Promise<any>): void;
    /**
     * Registers an action with authorization.
     *
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param authorize     an authorization interceptor
     * @param action        an action function that is called when operation is invoked.
     */
    protected registerActionWithAuth(name: string, schema: Schema, authorize: (call: any, next: (call: any) => Promise<any>) => Promise<any>, action: (call: any) => Promise<any>): void;
    /**
     * Registers a middleware for actions in AWS Lambda controller.
     *
     * @param action        an action function that is called when middleware is invoked.
     */
    protected registerInterceptor(action: (params: any, next: (params: any) => Promise<any>) => Promise<any>): void;
    /**
     * Registers all controller routes in HTTP endpoint.
     *
     * This method is called by the controller and must be overriden
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
    act(params: any): Promise<any>;
}
