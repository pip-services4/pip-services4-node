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
exports.RestController = void 0;
/** @module controllers */
/** @hidden */
const fs = require("fs");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const pip_services4_components_node_3 = require("pip-services4-components-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
const pip_services4_observability_node_2 = require("pip-services4-observability-node");
const pip_services4_observability_node_3 = require("pip-services4-observability-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
const HttpEndpoint_1 = require("./HttpEndpoint");
const HttpResponseSender_1 = require("./HttpResponseSender");
const pip_services4_rpc_node_1 = require("pip-services4-rpc-node");
/**
 * Abstract service that receives remove calls via HTTP/REST protocol.
 *
 * ### Configuration parameters ###
 *
 * - base_route:              base route for remote URI
 * - dependencies:
 *   - endpoint:              override for HTTP Endpoint dependency
 *   - service:               override for Service dependency
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
 * - <code>\*:tracer:\*:\*:1.0</code>               (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/trace.itracer.html ITracer]] components to record traces
 * - <code>\*:discovery:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:endpoint:http:\*:1.0</code>          (optional) [[HttpEndpoint]] reference
 *
 * @see [[RestClient]]
 *
 * ### Example ###
 *
 *     class MyRestController extends RestController {
 *        private _service: IMyService;
 *        ...
 *        public constructor() {
 *           base();
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
 *            registerRoute("get", "get_mydata", null, (req, res) => {
 *                let traceId = req.param("trace_id");
 *                let id = req.param("id");
 *                let promise = this._controller.getMyData(Context.fromTraceId(traceId), id);
 *                this.sendResult(req, res, promise);
 *            });
 *            ...
 *        }
 *     }
 *
 *     let controller = new MyRestController();
 *     controller.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *     controller.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","service","default","default","1.0"), service
 *     ));
 *
 *     await controller.open("123");
 *     console.log("The REST controller is running on port 8080");
 */
class RestController {
    constructor() {
        /**
         * The dependency resolver.
         */
        this._dependencyResolver = new pip_services4_components_node_3.DependencyResolver(RestController._defaultConfig);
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
        this._swaggerEnable = false;
        this._swaggerRoute = "swagger";
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        config = config.setDefaults(RestController._defaultConfig);
        this._config = config;
        this._dependencyResolver.configure(config);
        this._baseRoute = config.getAsStringWithDefault("base_route", this._baseRoute);
        this._swaggerEnable = config.getAsBooleanWithDefault("swagger.enable", this._swaggerEnable);
        this._swaggerRoute = config.getAsStringWithDefault("swagger.route", this._swaggerRoute);
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
        this._endpoint.register(this);
        this._swaggerController = this._dependencyResolver.getOneOptional("swagger");
    }
    /**
     * Unsets (clears) previously set references to dependent components.
     */
    unsetReferences() {
        // Remove registration callback from endpoint
        if (this._endpoint != null) {
            this._endpoint.unregister(this);
            this._endpoint = null;
        }
        this._swaggerController = null;
    }
    createEndpoint() {
        const endpoint = new HttpEndpoint_1.HttpEndpoint();
        if (this._config)
            endpoint.configure(this._config);
        if (this._references)
            endpoint.setReferences(this._references);
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
                throw new pip_services4_commons_node_1.InvalidStateException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, 'NO_ENDPOINT', 'HTTP endpoint is missing');
            }
            if (this._localEndpoint) {
                yield this._endpoint.close(context);
            }
            this._opened = false;
        });
    }
    /**
     * Creates a callback function that sends result as JSON object.
     * That callack function call be called directly or passed
     * as a parameter to business logic components.
     *
     * If object is not null it returns 200 status code.
     * For null results it returns 204 status code.
     * If error occur it sends ErrorDescription with approproate status code.
     *
     * @param req       a HTTP request object.
     * @param res       a HTTP response object.
     * @param result   an execution result or a promise with execution result
     */
    sendResult(req, res, result) {
        HttpResponseSender_1.HttpResponseSender.sendResult(req, res, result);
    }
    /**
     * Creates a callback function that sends newly created object as JSON.
     * That callack function call be called directly or passed
     * as a parameter to business logic components.
     *
     * If object is not null it returns 201 status code.
     * For null results it returns 204 status code.
     * If error occur it sends ErrorDescription with approproate status code.
     *
     * @param req       a HTTP request object.
     * @param res       a HTTP response object.
     * @param result   an execution result or a promise with execution result
     */
    sendCreatedResult(req, res, result) {
        HttpResponseSender_1.HttpResponseSender.sendCreatedResult(req, res, result);
    }
    /**
     * Creates a callback function that sends deleted object as JSON.
     * That callack function call be called directly or passed
     * as a parameter to business logic components.
     *
     * If object is not null it returns 200 status code.
     * For null results it returns 204 status code.
     * If error occur it sends ErrorDescription with approproate status code.
     *
     * @param req       a HTTP request object.
     * @param res       a HTTP response object.
     * @param result   an execution result or a promise with execution result
     */
    sendDeletedResult(req, res, result) {
        HttpResponseSender_1.HttpResponseSender.sendDeletedResult(req, res, result);
    }
    /**
     * Sends error serialized as ErrorDescription object
     * and appropriate HTTP status code.
     * If status code is not defined, it uses 500 status code.
     *
     * @param req       a HTTP request object.
     * @param res       a HTTP response object.
     * @param error     an error object to be sent.
     */
    sendError(req, res, error) {
        HttpResponseSender_1.HttpResponseSender.sendError(req, res, error);
    }
    appendBaseRoute(route) {
        route = route || "/";
        if (this._baseRoute != null && this._baseRoute.length > 0) {
            let baseRoute = this._baseRoute;
            if (route.length == 0)
                route = "/";
            if (route[0] != '/')
                route = "/" + route;
            if (baseRoute[0] != '/')
                baseRoute = '/' + baseRoute;
            route = baseRoute + route;
        }
        return route;
    }
    /**
     * Registers a route in HTTP endpoint.
     *
     * @param method        HTTP method: "get", "head", "post", "put", "delete"
     * @param route         a command route. Base route will be added to this route
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when operation is invoked.
     */
    registerRoute(method, route, schema, action) {
        if (this._endpoint == null)
            return;
        route = this.appendBaseRoute(route);
        this._endpoint.registerRoute(method, route, schema, (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield action.call(this, req, res);
        }));
    }
    /**
     * Registers a route with authorization in HTTP endpoint.
     *
     * @param method        HTTP method: "get", "head", "post", "put", "delete"
     * @param route         a command route. Base route will be added to this route
     * @param schema        a validation schema to validate received parameters.
     * @param authorize     an authorization interceptor
     * @param action        an action function that is called when operation is invoked.
     */
    registerRouteWithAuth(method, route, schema, authorize, action) {
        if (this._endpoint == null)
            return;
        route = this.appendBaseRoute(route);
        this._endpoint.registerRouteWithAuth(method, route, schema, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (authorize)
                yield authorize.call(this, req, res, next);
            else
                next();
        }), (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield action.call(this, req, res);
        }));
    }
    /**
     * Registers a middleware for a given route in HTTP endpoint.
     *
     * @param route         a command route. Base route will be added to this route
     * @param action        an action function that is called when middleware is invoked.
     */
    registerInterceptor(route, action) {
        if (this._endpoint == null)
            return;
        route = this.appendBaseRoute(route);
        this._endpoint.registerInterceptor(route, (req, res, next) => {
            action.call(this, req, res, next);
        });
    }
    /**
     * Returns context from request
     * @param req -  http request
     * @return Returns context from request
     */
    getTraceId(req) {
        let traceId = req.query.trace_id || req.query.correlation_id;
        if (traceId == null || traceId == "") {
            traceId = req.headers['trace_id'] || req.headers['correlation_id'];
        }
        return traceId;
    }
    registerOpenApiSpecFromFile(path) {
        const content = fs.readFileSync(path).toString();
        this.registerOpenApiSpec(content);
    }
    registerOpenApiSpec(content) {
        if (!this._swaggerEnable)
            return;
        this.registerRoute("get", this._swaggerRoute, null, (req, res) => {
            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(content),
                'Content-Type': 'application/x-yaml'
            });
            res.write(content);
            res.end();
        });
        if (this._swaggerController != null) {
            this._swaggerController.registerOpenApiSpec(this._baseRoute, this._swaggerRoute);
        }
    }
    /**
     * Returns FilterParams object from query request
     * @param req request
     * @returns FilterParams object from request
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getFilterParams(req) {
        let filter;
        const value = Object.assign({}, req.query);
        if (value.filter == null) {
            delete value.skip;
            delete value.take;
            delete value.total;
            delete value.trace_id;
            filter = pip_services4_data_node_1.FilterParams.fromValue(value);
        }
        else {
            filter = pip_services4_data_node_1.FilterParams.fromString(value.filter);
        }
        return filter;
    }
    /**
     * Returns PagingParams object from query request
     * @param req request
     * @returns PagingParams object from request
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getPagingParams(req) {
        const value = {
            skip: req.query.skip,
            take: req.query.take,
            total: req.query.total
        };
        const paging = pip_services4_data_node_1.PagingParams.fromValue(value);
        return paging;
    }
    /**
     * Returns SortParams object from query request
     * @param req request
     * @returns SortParams object from request
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSortParams(req) {
        var _a;
        const sort = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.sort) || "";
        const result = new pip_services4_data_node_1.SortParams();
        if (sort != null && sort.length > 0) {
            const items = sort.split(",");
            for (const item of items) {
                const parts = item.split("=");
                const param = new pip_services4_data_node_1.SortField(parts[0], pip_services4_commons_node_1.BooleanConverter.toBoolean(parts[1]));
                result.push(param);
            }
        }
        return result;
    }
}
exports.RestController = RestController;
RestController._defaultConfig = pip_services4_components_node_2.ConfigParams.fromTuples("base_route", "", "dependencies.endpoint", "*:endpoint:http:*:1.0", "dependencies.swagger", "*:swagger-controller:*:*:1.0");
//# sourceMappingURL=RestController.js.map