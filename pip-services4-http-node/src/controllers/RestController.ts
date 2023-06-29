/** @module controllers */
/** @hidden */
import fs = require('fs');

import { ContextResolver, IContext, IUnreferenceable } from 'pip-services4-components-node';
import { IOpenable } from 'pip-services4-components-node';
import { InvalidStateException } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-components-node';
import { IReferenceable } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { DependencyResolver } from 'pip-services4-components-node';
import { CompositeLogger } from 'pip-services4-observability-node';
import { CompositeCounters } from 'pip-services4-observability-node';
import { CompositeTracer } from 'pip-services4-observability-node';
import { Schema } from 'pip-services4-data-node';

import { HttpEndpoint } from './HttpEndpoint';
import { IRegisterable } from './IRegisterable';
import { ISwaggerController } from './ISwaggerController';
import { HttpResponseSender } from './HttpResponseSender';
import { InstrumentTiming } from 'pip-services4-rpc-node';

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
export abstract class RestController implements IOpenable, IConfigurable, IReferenceable,
    IUnreferenceable, IRegisterable {

    private static readonly _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        "base_route", "",
        "dependencies.endpoint", "*:endpoint:http:*:1.0",
        "dependencies.swagger", "*:swagger-controller:*:*:1.0"
    );

    protected _config: ConfigParams;
    private _references: IReferences;
    private _localEndpoint: boolean;
    private _opened: boolean;

    /**
     * The base route.
     */
    protected _baseRoute: string;
    /**
     * The HTTP endpoint that exposes this service.
     */
    protected _endpoint: HttpEndpoint;
    /**
     * The dependency resolver.
     */
    protected _dependencyResolver: DependencyResolver = new DependencyResolver(RestController._defaultConfig);
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

    protected _swaggerController: ISwaggerController;
    protected _swaggerEnable = false;
    protected _swaggerRoute = "swagger";

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
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
    public setReferences(references: IReferences): void {
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
        } else {
            this._localEndpoint = false;
        }
        // Add registration callback to the endpoint
        this._endpoint.register(this);

        this._swaggerController = this._dependencyResolver.getOneOptional<ISwaggerController>("swagger");
    }

    /**
     * Unsets (clears) previously set references to dependent components. 
     */
    public unsetReferences(): void {
        // Remove registration callback from endpoint
        if (this._endpoint != null) {
            this._endpoint.unregister(this);
            this._endpoint = null;
        }
        this._swaggerController = null;
    }

    private createEndpoint(): HttpEndpoint {
        const endpoint = new HttpEndpoint();

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
    protected instrument(context: IContext, name: string): InstrumentTiming {
        this._logger.trace(context, "Executing %s method", name);
        this._counters.incrementOne(name + ".exec_count");

		const counterTiming = this._counters.beginTiming(name + ".exec_time");
        const traceTiming = this._tracer.beginTrace(context, name, null);
        return new InstrumentTiming(context, name, "exec",
            this._logger, this._counters, counterTiming, traceTiming);
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

        if (this._endpoint == null) {
            this._endpoint = this.createEndpoint();
            this._endpoint.register(this);
            this._localEndpoint = true;
        }

        if (this._localEndpoint) {
            await this._endpoint.open(context);
        }

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

        if (this._endpoint == null) {
            throw new InvalidStateException(
                context != null ? ContextResolver.getTraceId(context) : null,
                'NO_ENDPOINT',
                'HTTP endpoint is missing'
            );
        }

        if (this._localEndpoint) {
            await this._endpoint.close(context);
        }

        this._opened = false;
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
    protected sendResult(req: any, res: any, result: any): void {
        HttpResponseSender.sendResult(req, res, result);
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
    protected sendCreatedResult(req: any, res: any, result: any): void {
        HttpResponseSender.sendCreatedResult(req, res, result);
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
    protected sendDeletedResult(req: any, res: any, result: any): void {
        HttpResponseSender.sendDeletedResult(req, res, result);
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
    protected sendError(req: any, res: any, error: any): void {
        HttpResponseSender.sendError(req, res, error);
    }

    private appendBaseRoute(route: string): string {
        route = route || "/";

        if (this._baseRoute != null && this._baseRoute.length > 0) {
            let baseRoute = this._baseRoute;
            if (route.length == 0) route = "/";
            if (route[0] != '/') route = "/" + route;
            if (baseRoute[0] != '/') baseRoute = '/' + baseRoute;
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
    protected registerRoute(method: string, route: string, schema: Schema,
        action: (req: any, res: any) => void): void {
        if (this._endpoint == null) return;

        route = this.appendBaseRoute(route);

        this._endpoint.registerRoute(
            method, route, schema,
            async (req, res) => {
                await action.call(this, req, res);
            }
        );
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
    protected registerRouteWithAuth(method: string, route: string, schema: Schema,
        authorize: (req: any, res: any, next: () => void) => void,
        action: (req: any, res: any) => void): void {
        if (this._endpoint == null) return;

        route = this.appendBaseRoute(route);

        this._endpoint.registerRouteWithAuth(
            method, route, schema,
            async (req, res, next) => {
                if (authorize)
                    await authorize.call(this, req, res, next);
                else next();
            },
            async (req, res) => {
                await action.call(this, req, res);
            }
        );
    }

    /**
     * Registers a middleware for a given route in HTTP endpoint.
     * 
     * @param route         a command route. Base route will be added to this route
     * @param action        an action function that is called when middleware is invoked.
     */
    protected registerInterceptor(route: string,
        action: (req: any, res: any, next: () => void) => void): void {
        if (this._endpoint == null) return;

        route = this.appendBaseRoute(route);

        this._endpoint.registerInterceptor(
            route,
            (req, res, next) => {
                action.call(this, req, res, next);
            }
        );
    }

    /**
     * Returns context from request
     * @param req -  http request
     * @return Returns context from request
     */
    protected getTraceId(req: any): string {
        let traceId = req.query.trace_id || req.query.correlation_id;
        if (traceId == null || traceId == "") {
            traceId = req.headers['trace_id'] || req.headers['correlation_id'];
        }
        return traceId;
    }

    protected registerOpenApiSpecFromFile(path: string) {
        const content = fs.readFileSync(path).toString();
        this.registerOpenApiSpec(content);
    }

    protected registerOpenApiSpec(content: string) {
        if (!this._swaggerEnable) return;

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
     * Registers all controller routes in HTTP endpoint.
     * 
     * This method is called by the controller and must be overriden
     * in child classes.
     */
     public abstract register(): void;
}