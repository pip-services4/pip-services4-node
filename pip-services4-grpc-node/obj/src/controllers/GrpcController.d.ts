/** @module controllers */
import { IContext, IUnreferenceable } from 'pip-services4-components-node';
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
import { GrpcEndpoint } from './GrpcEndpoint';
import { IRegisterable } from './IRegisterable';
/**
 * Abstract controller that receives remove calls via GRPC protocol.
 *
 * ### Configuration parameters ###
 *
 * - dependencies:
 *   - endpoint:              override for GRPC Endpoint dependency
 *   - controller:            override for Controller dependency
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 * - credential - the HTTPS credentials:
 *   - ssl_key_file:         the SSL private key in PEM
 *   - ssl_crt_file:         the SSL certificate in PEM
 *   - ssl_ca_file:          the certificate authorities (root cerfiticates) in PEM
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:endpoint:grpc:\*:1.0</code>           (optional) [[GrpcEndpoint]] reference
 *
 * @see [[GrpcClient]]
 *
 * ### Example ###
 *
 *     class MyGrpcController extends GrpcController {
 *        private _service: IMyService;
 *        ...
 *        public constructor() {
 *           base('... path to proto ...', '.. service name ...');
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
 *            registerMethod("get_mydata", null, async (call) => {
 *                let context = call.request.context;
 *                let id = call.request.id;
 *                return await this._service.getMyData(context, id);
 *            });
 *            ...
 *        }
 *     }
 *
 *     let controller = new MyGrpcController();
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
export declare abstract class GrpcController implements IOpenable, IConfigurable, IReferenceable, IUnreferenceable, IRegisterable {
    private static readonly _defaultConfig;
    private _controllerProto;
    private _protoPath;
    private _controllerName;
    private _packageOptions;
    private _config;
    private _references;
    private _localEndpoint;
    private _registerable;
    private _implementation;
    private _interceptors;
    private _opened;
    /**
     * The GRPC endpoint that exposes this controller.
     */
    protected _endpoint: GrpcEndpoint;
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
    constructor(controllerOrPath: any, controllerName?: string, packageOptions?: any);
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
     * Unsets (clears) previously set references to dependent components.
     */
    unsetReferences(): void;
    private createEndpoint;
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
    private registerControllerProto;
    private getControllerProtoByName;
    protected applyValidation(schema: Schema, action: (call: any) => Promise<any>): (call: any) => Promise<any>;
    protected applyInterceptors(action: (call: any) => Promise<any>): (call: any) => Promise<any>;
    /**
     * Registers a method in GRPC controller.
     *
     * @param name          a method name
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when operation is invoked.
     */
    protected registerMethod(name: string, schema: Schema, action: (call: any) => Promise<any>): void;
    /**
     * Registers a method with authorization.
     *
     * @param name          a method name
     * @param schema        a validation schema to validate received parameters.
     * @param authorize     an authorization interceptor
     * @param action        an action function that is called when operation is invoked.
     */
    protected registerMethodWithAuth(name: string, schema: Schema, authorize: (call: any, next: (call: any) => Promise<any>) => Promise<any>, action: (call: any) => Promise<any>): void;
    /**
     * Registers a middleware for methods in GRPC endpoint.
     *
     * @param action        an action function that is called when middleware is invoked.
     */
    protected registerInterceptor(action: (call: any, next: (call: any) => Promise<any>) => Promise<any>): void;
    /**
     * Registers all controller routes in HTTP endpoint.
     *
     * This method is called by the controller and must be overriden
     * in child classes.
     */
    abstract register(): void;
}
