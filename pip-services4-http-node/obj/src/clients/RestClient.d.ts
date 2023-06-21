/** @module clients */
import { IContext } from 'pip-services4-components-node';
import { IOpenable } from 'pip-services4-components-node';
import { IConfigurable } from 'pip-services4-components-node';
import { IReferenceable } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { CompositeLogger } from 'pip-services4-observability-node';
import { CompositeCounters } from 'pip-services4-observability-node';
import { CompositeTracer } from 'pip-services4-observability-node';
import { HttpConnectionResolver } from 'pip-services4-config-node';
import { InstrumentTiming } from 'pip-services4-rpc-node';
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
 * @see [[RestController]]
 * @see [[CommandableHttpController]]
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
export declare abstract class RestClient implements IOpenable, IConfigurable, IReferenceable {
    private static readonly _defaultConfig;
    /**
     * The HTTP client.
     */
    protected _client: any;
    /**
     * The connection resolver.
     */
    protected _connectionResolver: HttpConnectionResolver;
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
    * The configuration options.
    */
    protected _options: ConfigParams;
    /**
     * The base route.
     */
    protected _baseRoute: string;
    /**
     * The number of retries.
     */
    protected _retries: number;
    /**
     * The default headers to be added to every request.
     */
    protected _headers: any;
    /**
     * The connection timeout in milliseconds.
     */
    protected _connectTimeout: number;
    /**
     * The invocation timeout in milliseconds.
     */
    protected _timeout: number;
    /**
     * The remote service uri which is calculated on open.
     */
    protected _uri: string;
    protected _contextLocation: string;
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
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param name              a method name.
     * @returns InstrumentTiming object to end the time measurement.
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
    /**
     * Adds a trace id (trace_id) to invocation parameter map.
     *
     * @param params            invocation parameters.
     * @param context     (optional) a correlation id to be added.
     * @returns invocation parameters with added correlation id.
     */
    protected addTraceId(params: any, context: IContext): any;
    /**
     * Adds filter parameters (with the same name as they defined)
     * to invocation parameter map.
     *
     * @param params        invocation parameters.
     * @param filter        (optional) filter parameters
     * @returns invocation parameters with added filter parameters.
     */
    protected addFilterParams(params: any, filter: any): void;
    /**
     * Adds paging parameters (skip, take, total) to invocation parameter map.
     *
     * @param params        invocation parameters.
     * @param paging        (optional) paging parameters
     * @returns invocation parameters with added paging parameters.
     */
    protected addPagingParams(params: any, paging: any): void;
    private createRequestRoute;
    /**
     * Calls a remote method via HTTP/REST protocol.
     *
     * @param method            HTTP method: "get", "head", "post", "put", "delete"
     * @param route             a command route. Base route will be added to this route
     * @param context           (optional) a context to trace execution through call chain.
     * @param params            (optional) query parameters.
     * @param data              (optional) body object.
     * @returns                 a result object.
     */
    protected call<T>(method: string, route: string, context?: IContext, params?: any, data?: any): Promise<T>;
}
