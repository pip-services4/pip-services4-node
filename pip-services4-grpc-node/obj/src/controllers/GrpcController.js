"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcController = void 0;
/** @module controllers */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const pip_services4_components_node_3 = require("pip-services4-components-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
const pip_services4_observability_node_2 = require("pip-services4-observability-node");
const pip_services4_observability_node_3 = require("pip-services4-observability-node");
const pip_services4_rpc_node_1 = require("pip-services4-rpc-node");
const GrpcEndpoint_1 = require("./GrpcEndpoint");
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
class GrpcController {
    constructor(controllerOrPath, controllerName, packageOptions) {
        this._implementation = {};
        this._interceptors = [];
        /**
         * The dependency resolver.
         */
        this._dependencyResolver = new pip_services4_components_node_3.DependencyResolver(GrpcController._defaultConfig);
        /**
         * The logger.
         */
        this._logger = new pip_services4_observability_node_1.CompositeLogger();
        /**
         * The performance counters.
         */
        this._counters = new pip_services4_observability_node_2.CompositeCounters();
        /**
         * The tracer.
         */
        this._tracer = new pip_services4_observability_node_3.CompositeTracer();
        this._controllerProto = (typeof controllerOrPath !== "string") ? controllerOrPath : null;
        this._protoPath = (typeof controllerOrPath === "string") ? controllerOrPath : null;
        this._controllerName = controllerName;
        this._packageOptions = packageOptions;
        this._registerable = {
            register: () => {
                this.registerControllerProto();
            }
        };
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        config = config.setDefaults(GrpcController._defaultConfig);
        this._config = config;
        this._dependencyResolver.configure(config);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._references = references;
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._tracer.setReferences(references);
        this._dependencyResolver.setReferences(references);
        // Get endpoint
        this._endpoint = this._dependencyResolver.getOneOptional('endpoint');
        // Or create a local one
        if (this._endpoint == null) {
            this._endpoint = this.createEndpoint();
            this._localEndpoint = true;
        }
        else {
            this._localEndpoint = false;
        }
        // Add registration callback to the endpoint
        this._endpoint.register(this._registerable);
    }
    /**
     * Unsets (clears) previously set references to dependent components.
     */
    unsetReferences() {
        // Remove registration callback from endpoint
        if (this._endpoint != null) {
            this._endpoint.unregister(this._registerable);
            this._endpoint = null;
        }
    }
    createEndpoint() {
        const endpoint = new GrpcEndpoint_1.GrpcEndpoint();
        if (this._config) {
            endpoint.configure(this._config);
        }
        if (this._references) {
            endpoint.setReferences(this._references);
        }
        return endpoint;
    }
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param name              a method name.
     * @returns Timing object to end the time measurement.
     */
    instrument(context, name) {
        this._logger.trace(context, "Executing %s method", name);
        this._counters.incrementOne(name + ".exec_count");
        const counterTiming = this._counters.beginTiming(name + ".exec_time");
        const traceTiming = this._tracer.beginTrace(context, name, null);
        return new pip_services4_rpc_node_1.InstrumentTiming(context, name, "exec", this._logger, this._counters, counterTiming, traceTiming);
    }
    // /**
    //  * Adds instrumentation to error handling.
    //  * 
    //  * @param context     (optional) a context to trace execution through call chain.
    //  * @param name              a method name.
    //  * @param err               an occured error
    //  * @param result            (optional) an execution result
    //  * @param callback          (optional) an execution callback
    //  */
    // protected instrumentError(context: IContext, name: string, err: any,
    //     result: any = null, callback: (err: any, result: any) => void = null): void {
    //     if (err != null) {
    //         this._logger.error(context, err, "Failed to execute %s method", name);
    //         this._counters.incrementOne(name + '.exec_errors');    
    //     }
    //     if (callback) callback(err, result);
    // }   
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._opened;
    }
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._opened) {
                return;
            }
            if (this._endpoint == null) {
                this._endpoint = this.createEndpoint();
                this._endpoint.register(this);
                this._localEndpoint = true;
            }
            if (this._localEndpoint) {
                yield this._endpoint.open(context);
            }
            this._opened = true;
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    close(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._opened) {
                return;
            }
            if (this._endpoint == null) {
                throw new pip_services4_commons_node_1.InvalidStateException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, 'NO_ENDPOINT', 'GRPC endpoint is missing');
            }
            if (this._localEndpoint) {
                yield this._endpoint.close(context);
            }
            this._opened = false;
        });
    }
    registerControllerProto() {
        // Register implementations
        this._implementation = {};
        this._interceptors = [];
        this.register();
        // Load controller
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const grpc = require('@grpc/grpc-js');
        let controllerProto = this._controllerProto;
        // Dynamically load controller
        if (controllerProto == null && typeof this._protoPath === "string") {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const protoLoader = require('@grpc/proto-loader');
            const options = this._packageOptions || {
                keepCase: true,
                longs: Number,
                enums: Number,
                defaults: true,
                oneofs: true
            };
            const packageDefinition = protoLoader.loadSync(this._protoPath, options);
            const packageObject = grpc.loadPackageDefinition(packageDefinition);
            controllerProto = this.getControllerProtoByName(packageObject, this._controllerName);
        }
        // Statically load controller
        else {
            controllerProto = this.getControllerProtoByName(this._controllerProto, this._controllerName);
        }
        // Register controller if it is set
        if (controllerProto) {
            this._endpoint.registerController(controllerProto, this._implementation);
        }
    }
    getControllerProtoByName(packageObject, controllerName) {
        if (packageObject == null || controllerName == null)
            return packageObject;
        const names = controllerName.split(".");
        for (const name of names) {
            packageObject = packageObject[name];
            if (packageObject == null)
                break;
        }
        return packageObject;
    }
    applyValidation(schema, action) {
        // Create an action function
        const actionWrapper = (call) => __awaiter(this, void 0, void 0, function* () {
            // Validate object
            if (schema && call && call.request) {
                let value = call.request;
                if (typeof value.toObject === "function") {
                    value = value.toObject();
                }
                // Perform validation                    
                const context = value.trace_id;
                const err = schema.validateAndReturnException(context, value, false);
                if (err) {
                    throw err;
                }
            }
            const result = yield action.call(this, call);
            return result;
        });
        return actionWrapper;
    }
    applyInterceptors(action) {
        let actionWrapper = action;
        for (let index = this._interceptors.length - 1; index >= 0; index--) {
            const interceptor = this._interceptors[index];
            actionWrapper = ((action) => {
                return (call) => {
                    return interceptor(call, action);
                };
            })(actionWrapper);
        }
        return actionWrapper;
    }
    /**
     * Registers a method in GRPC controller.
     *
     * @param name          a method name
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when operation is invoked.
     */
    registerMethod(name, schema, action) {
        if (this._implementation == null)
            return;
        let actionWrapper = this.applyValidation(schema, action);
        actionWrapper = this.applyInterceptors(actionWrapper);
        // Assign method implementation
        this._implementation[name] = (call, callback) => {
            actionWrapper(call)
                .then((result) => {
                callback(null, result);
            })
                .catch((err) => {
                callback(err, null);
            });
        };
    }
    /**
     * Registers a method with authorization.
     *
     * @param name          a method name
     * @param schema        a validation schema to validate received parameters.
     * @param authorize     an authorization interceptor
     * @param action        an action function that is called when operation is invoked.
     */
    registerMethodWithAuth(name, schema, authorize, action) {
        let actionWrapper = this.applyValidation(schema, action);
        // Add authorization just before validation
        actionWrapper = (call) => {
            return authorize(call, actionWrapper);
        };
        actionWrapper = this.applyInterceptors(actionWrapper);
        // Assign method implementation
        this._implementation[name] = (call, callback) => {
            actionWrapper(call)
                .then((result) => {
                callback(null, result);
            })
                .catch((err) => {
                callback(err, null);
            });
        };
    }
    /**
     * Registers a middleware for methods in GRPC endpoint.
     *
     * @param action        an action function that is called when middleware is invoked.
     */
    registerInterceptor(action) {
        if (this._endpoint == null)
            return;
        this._interceptors.push((call, next) => {
            return action.call(this, call, next);
        });
    }
}
exports.GrpcController = GrpcController;
GrpcController._defaultConfig = pip_services4_components_node_2.ConfigParams.fromTuples("dependencies.endpoint", "*:endpoint:grpc:*:1.0");
//# sourceMappingURL=GrpcController.js.map