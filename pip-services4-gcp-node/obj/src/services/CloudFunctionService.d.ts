/** @module services */
import { Request, Response } from 'express';
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
import { CloudFunctionAction } from './CloudFunctionAction';
import { ICloudFunctionService } from './ICloudFunctionService';
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
 *                let correlationId = params.correlation_id;
 *                let id = params.id;
 *                const result = await this._controller.getMyData(correlationId, id);
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
export declare abstract class CloudFunctionService implements ICloudFunctionService, IOpenable, IConfigurable, IReferenceable {
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
    getActions(): CloudFunctionAction[];
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns Timing object to end the time measurement.
     */
    protected instrument(correlationId: string, name: string): InstrumentTiming;
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen(): boolean;
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    open(correlationId: string): Promise<void>;
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    close(correlationId: string): Promise<void>;
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
     * Registers a middleware for actions in Google Function service.
     *
     * @param action an action function that is called when middleware is invoked.
     */
    protected registerInterceptor(cmd: string, action: (req: Request, res: Response, next: (req: Request, res: Response) => void) => void): void;
    /**
     * Registers all service routes in HTTP endpoint.
     *
     * This method is called by the service and must be overridden
     * in child classes.
     */
    protected abstract register(): void;
    /**
     * Returns correlationId from Google Function request.
     * This method can be overloaded in child classes
     * @param req - the function request
     * @return returns correlationId from request
     */
    protected getCorrelationId(req: any): string;
    /**
     * Returns command from Google Function request.
     * This method can be overloaded in child classes
     * @param req -  the function request
     * @return returns command from request
     */
    protected getCommand(req: any): string;
}
