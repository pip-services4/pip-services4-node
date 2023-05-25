/** @module clients */

import { IOpenable } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { CompositeLogger } from 'pip-services4-components-node';
import { CompositeCounters } from 'pip-services4-components-node';
import { CompositeTracer } from 'pip-services4-components-node';
import { ApplicationExceptionFactory } from 'pip-services4-commons-node';
import { ConnectionException } from 'pip-services4-commons-node';
import { UnknownException } from 'pip-services4-commons-node';

import { HttpConnectionResolver } from '../connect/HttpConnectionResolver';
import { InstrumentTiming } from '../services';

/**
 * Abstract client that calls remove endpoints using HTTP/REST protocol.
 * 
 * ### Configuration parameters ###
 * 
 * - base_route:              base route for remote URI
 * - connection(s):           
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 * - options:
 *   - retries:               number of retries (default: 3)
 *   - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *   - timeout:               invocation timeout in milliseconds (default: 10 sec)
 *   - trace_id         place for adding correalationId, query - in query string, headers - in headers, both - in query and headers (default: query)
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>       (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:traces:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/trace.itracer.html ITracer]] components to record traces
 * - <code>\*:discovery:\*:\*:1.0</code>      (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * 
 * @see [[RestService]]
 * @see [[CommandableHttpService]]
 * 
 * ### Example ###
 * 
 *     class MyRestClient extends RestClient implements IMyClient {
 *        ...
 * 
 *        public async getData(context: IContext, id: string): Promise<MyData> {
 *            let timing = this.instrument(context, 'myclient.get_data');
 *            try {
 *                return await this.call("get", "/get_data" context, { id: id }, null);
 *            } catch (ex) {
 *                timing.endFailure(ex);
 *            } finally {
 *                timing.endTiming();
 *            }
 *        }
 *        ...
 *     }
 * 
 *     let client = new MyRestClient();
 *     client.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 * 
 *     let result = await client.getData("123", "1");
 */
export abstract class RestClient implements IOpenable, IConfigurable, IReferenceable {
    private static readonly _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        "connection.protocol", "http",
        "connection.host", "0.0.0.0",
        "connection.port", 3000,

        "options.request_max_size", 1024 * 1024,
        "options.connect_timeout", 10000,
        "options.timeout", 10000,
        "options.retries", 3,
        "options.debug", true,
    );

    /**
     * The HTTP client.
     */
    protected _client: any;
    /**
     * The connection resolver.
     */
    protected _connectionResolver: HttpConnectionResolver = new HttpConnectionResolver();
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
     * The configuration options.
     */
    protected _options: ConfigParams = new ConfigParams();
    /**
     * The base route.
     */
    protected _baseRoute: string;
    /**
     * The number of retries.
     */
    protected _retries: number = 1;
    /**
     * The default headers to be added to every request.
     */
    protected _headers: any = {};
    /**
     * The connection timeout in milliseconds.
     */
    protected _connectTimeout: number = 10000;
    /**
     * The invocation timeout in milliseconds.
     */
    protected _timeout: number = 10000;
    /**
     * The remote service uri which is calculated on open.
     */
    protected _uri: string;

    protected _contextLocation: string = "query"

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        config = config.setDefaults(RestClient._defaultConfig);
        this._connectionResolver.configure(config);
        this._options = this._options.override(config.getSection("options"));

        this._retries = config.getAsIntegerWithDefault("options.retries", this._retries);
        this._connectTimeout = config.getAsIntegerWithDefault("options.connect_timeout", this._connectTimeout);
        this._timeout = config.getAsIntegerWithDefault("options.timeout", this._timeout);

        this._baseRoute = config.getAsStringWithDefault("base_route", this._baseRoute);
        this._contextLocation = config.getAsStringWithDefault("options.trace_id_place", this._contextLocation);
        this._contextLocation = config.getAsStringWithDefault("options.trace_id", this._contextLocation);
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
        this._connectionResolver.setReferences(references);
    }

    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns InstrumentTiming object to end the time measurement.
     */
     protected instrument(context: IContext, name: string): InstrumentTiming {
        this._logger.trace(context, "Calling %s method", name);
        this._counters.incrementOne(name + ".call_count");

		let counterTiming = this._counters.beginTiming(name + ".call_time");
        let traceTiming = this._tracer.beginTrace(context, name, null);
        return new InstrumentTiming(context, name, "call",
            this._logger, this._counters, counterTiming, traceTiming);
	}

    // /**
    //  * Adds instrumentation to error handling.
    //  * 
    //  * @param context     (optional) transaction id to trace execution through call chain.
    //  * @param name              a method name.
    //  * @param err               an occured error
    //  * @param result            (optional) an execution result
    //  * @param callback          (optional) an execution callback
    //  */
    // protected instrumentError(context: IContext, name: string, err: any,
    //     result: any = null, callback: (err: any, result: any) => void = null): void {
    //     if (err != null) {
    //         const typeName = this.constructor.name || "unknown-target";
    //         this._logger.error(context, err, "Failed to call %s method of %s", name, typeName);
    //         this._counters.incrementOne(typeName + "." + name + '.call_errors');
    //     }

    //     if (callback) callback(err, result);
    // }

    /**
     * Checks if the component is opened.
     * 
     * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._client != null;
    }

    /**
     * Opens the component.
     * 
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        if (this.isOpen()) {
            return;
        }

        let connection = await this._connectionResolver.resolve(context);

        try {
            this._uri = connection.getAsString("uri");
            let restify = require('restify-clients');
            this._client = restify.createJsonClient({
                url: this._uri,
                connectTimeout: this._connectTimeout,
                requestTimeout: this._timeout,
                headers: this._headers,
                retry: {
                    minTimeout: this._timeout,
                    maxTimeout: Infinity,
                    retries: this._retries
                },
                version: '*'
            });

            this._logger.debug(context, "Connected via REST to %s", this._uri);
        } catch (err) {
            this._client = null;

            throw new ConnectionException(
                context, "CANNOT_CONNECT", "Connection to REST service failed"
            ).wrap(err).withDetails("url", this._uri);
        }
    }

    /**
     * Closes component and frees used resources.
     * 
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async close(context: IContext): Promise<void> {
        if (this._client != null) {
            // Eat exceptions
            try {
                this._logger.debug(context, "Closed REST service at %s", this._uri);
            } catch (ex) {
                this._logger.warn(context, "Failed while closing REST service: %s", ex);
            }

            this._client = null;
            this._uri = null;
        }
    }

    /**
     * Adds a correlation id (trace_id) to invocation parameter map.
     * 
     * @param params            invocation parameters.
     * @param context     (optional) a correlation id to be added.
     * @returns invocation parameters with added correlation id.
     */
    protected addTraceId(params: any, context: IContext): any {
        // Automatically generate short ids for now
        if (context == null)
            //context = IdGenerator.nextShort();
            return params;

        params = params || {};
        params.trace_id = context;
        return params;
    }

    /**
     * Adds filter parameters (with the same name as they defined)
     * to invocation parameter map.
     * 
     * @param params        invocation parameters.
     * @param filter        (optional) filter parameters
     * @returns invocation parameters with added filter parameters.
     */
    protected addFilterParams(params: any, filter: any): void {
        params = params || {};

        if (filter) {
            for (let prop in filter) {
                if (filter.hasOwnProperty(prop))
                    params[prop] = filter[prop];
            }
        }

        return params;
    }

    /**
     * Adds paging parameters (skip, take, total) to invocation parameter map.
     * 
     * @param params        invocation parameters.
     * @param paging        (optional) paging parameters
     * @returns invocation parameters with added paging parameters.
     */
    protected addPagingParams(params: any, paging: any): void {
        params = params || {};

        if (paging) {
            if (paging.total)
                params.total = paging.total;
            if (paging.skip)
                params.skip = paging.skip;
            if (paging.take)
                params.take = paging.take;
        }

        return params;
    }

    private createRequestRoute(route: string): string {
        let builder = "";

        if (this._baseRoute != null && this._baseRoute.length > 0) {
            if (this._baseRoute[0] != "/")
                builder += "/";
            builder += this._baseRoute;
        }

        if (route.length != 0 && route[0] != "/")
            builder += "/";
        builder += route;

        return builder;
    }

    /**
     * Calls a remote method via HTTP/REST protocol.
     * 
     * @param method            HTTP method: "get", "head", "post", "put", "delete"
     * @param route             a command route. Base route will be added to this route
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param params            (optional) query parameters.
     * @param data              (optional) body object.
     * @returns                 a result object.
     */
    protected async call<T>(method: string, route: string, context?: string, params: any = {}, data?: any): Promise<T> {
        method = method.toLowerCase();

        route = this.createRequestRoute(route);

        if (this._contextLocation == "query" || this._contextLocation == "both") {
            params = this.addTraceId(params, context)
        }
        if (this._contextLocation == "headers" || this._contextLocation == "both") {
            this._headers['trace_id'] = context;
        }

        if (params != null && Object.keys(params).length > 0) {
            route += '?' + new URLSearchParams(params).toString()
        }

        return new Promise((resolve, reject) => {
            let action = (err, req, res, data) => {
                // Handling 204 codes
                if (res && res.statusCode == 204)
                    resolve(null);
                else if (err == null)
                    resolve(data);
                else {
                    // Restore application exception
                    if (data != null)
                        err = ApplicationExceptionFactory.create(data).withCause(err);
                    reject(err);
                }
            };

            if (method == 'get') this._client.get(route, action);
            else if (method == 'head') this._client.head(route, action);
            else if (method == 'post') this._client.post(route, data, action);
            else if (method == 'put') this._client.put(route, data, action);
            else if (method == 'patch') this._client.patch(route, data, action);
            else if (method == 'delete') this._client.del(route, action);
            else {
                let err = new UnknownException(
                    context, 'UNSUPPORTED_METHOD', 'Method is not supported by REST client'
                ).withDetails('verb', method);
                reject(err);
            }
        });
    }

}