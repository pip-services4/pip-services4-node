/** @module controllers */
import { Request, Response } from 'express';
import { IContext } from 'pip-services4-components-node';
import { IOpenable } from 'pip-services4-components-node';
import { IConfigurable } from 'pip-services4-components-node';
import { IReferenceable } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { DependencyResolver } from 'pip-services4-components-node';
import { CompositeLogger } from 'pip-services4-observability-node';
import { CompositeCounters } from 'pip-services4-observability-node';
import { CompositeTracer } from 'pip-services4-observability-node';
import { InstrumentTiming } from 'pip-services4-rpc-node';
import { Schema } from 'pip-services4-data-node';
import { CloudFunctionAction } from './CloudFunctionAction';
import { ICloudFunctionController } from './ICloudFunctionController';
/**
 * Abstract controller that receives remove calls via Google Function protocol.
 *
 * This controller is intended to work inside CloudFunction container that
 * exposes registered actions externally.
 *
 * ### Configuration parameters ###
 *
 * - dependencies:
 *   - service:            override for Service dependency
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 *
 *
 * ### Example ###
 *
 *     class MyCloudFunctionController extends CloudFunctionController {
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
 *            registerAction("get_mydata", null, async (req, res) => {
 *                let params = req.body;
 *                let context = params.trace_id;
 *                let id = params.id;
 *                const result = await this._service.getMyData(context, id);
 *
 *                res.send(result);
 *            });
 *            ...
 *        }
 *     }
 *
 *     let controller = new MyCloudFunctionController();
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
 */
export declare abstract class CloudFunctionController implements ICloudFunctionController, IOpenable, IConfigurable, IReferenceable {
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
    getActions(): CloudFunctionAction[];
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
    protected applyValidation(schema: Schema, action: (req: Request, res: Response) => Promise<any>): (req: Request, res: Response) => Promise<any>;
    protected applyInterceptors(action: (req: Request, res: Response) => Promise<any>): (req: Request, res: Response) => Promise<any>;
    protected generateActionCmd(name: string): string;
    /**
     * Registers a action in Google Function function.
     *
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when operation is invoked.
     */
    protected registerAction(name: string, schema: Schema, action: (req: Request, res: Response) => Promise<any>): void;
    /**
     * Registers an action with authorization.
     *
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param authorize     an authorization interceptor
     * @param action        an action function that is called when operation is invoked.
     */
    protected registerActionWithAuth(name: string, schema: Schema, authorize: (req: Request, res: Response, next: (req: Request, res: Response) => Promise<any>) => Promise<any>, action: (req: Request, res: Response) => Promise<any>): void;
    /**
     * Registers a middleware for actions in Google Function controller.
     *
     * @param action an action function that is called when middleware is invoked.
     */
    protected registerInterceptor(cmd: string, action: (req: Request, res: Response, next: (req: Request, res: Response) => void) => void): void;
    /**
     * Registers all controller routes in HTTP endpoint.
     *
     * This method is called by the controller and must be overridden
     * in child classes.
     */
    protected abstract register(): void;
    /**
     * Returns context from Google Function request.
     * This method can be overloaded in child classes
     * @param req - the function request
     * @return returns context from request
     */
    protected getTraceId(req: any): string;
    /**
     * Returns command from Google Function request.
     * This method can be overloaded in child classes
     * @param req -  the function request
     * @return returns command from request
     */
    protected getCommand(req: any): string;
}
