/** @module clients */
import { IOpenable } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { DependencyResolver } from 'pip-services4-commons-node';
import { CompositeLogger } from 'pip-services4-components-node';
import { CompositeTracer } from 'pip-services4-components-node';
import { CompositeCounters } from 'pip-services4-components-node';
import { InstrumentTiming } from "pip-services4-rpc-node";
import { GcpConnectionParams } from '../connect/GcpConnectionParams';
import { GcpConnectionResolver } from '../connect/GcpConnectionResolver';
/**
 * Abstract client that calls Google Functions.
 *
 * When making calls "cmd" parameter determines which what action shall be called, while
 * other parameters are passed to the action itself.
 *
 * ### Configuration parameters ###
 *
 * - connections:
 *      - uri:           full connection uri with specific app and function name
 *      - protocol:      connection protocol
 *      - project_id:    is your Google Cloud Platform project ID
 *      - region:        is the region where your function is deployed
 *      - function:      is the name of the HTTP function you deployed
 *      - org_id:        organization name
 * - options:
 *      - retries:               number of retries (default: 3)
 *      - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *      - timeout:               invocation timeout in milliseconds (default: 10 sec)
 * - credentials:
 *     - account: the service account name
 *     - auth_token:    Google-generated ID token or null if using custom auth (IAM)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:credential-store:\*:\*:1.0</code>  (optional) Credential stores to resolve credentials
 *
 * @see [[CloudFunction]]
 * @see [[CommandableGoogleClient]]
 *
 * ### Example ###
 *
 *     class MyCloudFunctionClient extends CloudFunctionClient implements IMyClient {
 *         ...
 *
 *         public async getData(context: IContext, id: string): Promise<MyData> {
 *
 *             let timing = this.instrument(context, 'myclient.get_data');
 *             const result = await this.call("get_data" context, { id: id });
 *             timing.endTiming();
 *             return result;
 *         }
 *         ...
 *     }
 *
 *     let client = new MyCloudFunctionClient();
 *     client.configure(ConfigParams.fromTuples(
 *         'connection.uri", "http://region-id.cloudfunctions.net/myfunction',
 *         'connection.protocol', 'http',
 *         'connection.region', 'region',
 *         'connection.function', 'myfunction',
 *         'connection.project_id', 'id',
 *         'credential.auth_token', 'XXX',
 *     ));
 *
 *     const result = await client.getData("123", "1");
 */
export declare abstract class CloudFunctionClient implements IOpenable, IConfigurable, IReferenceable {
    /**
     * The HTTP client.
     */
    protected _client: any;
    /**
     * The Google Function connection parameters
     */
    protected _connection: GcpConnectionParams;
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
    /**
     * The dependencies resolver.
     */
    protected _dependencyResolver: DependencyResolver;
    /**
     * The connection resolver.
     */
    protected _connectionResolver: GcpConnectionResolver;
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
     * It returns a CounterTiming object that is used to end the time measurement.
     *
     * @param context         (optional) transaction id to trace execution through call chain.
     * @param name                  a method name.
     * @returns {InstrumentTiming}  object to end the time measurement.
     */
    protected instrument(context: IContext, name: string): InstrumentTiming;
    /**
     * Checks if the component is opened.
     *
     * @returns {boolean} true if the component has been opened and false otherwise.
     */
    isOpen(): boolean;
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     *
     */
    open(context: IContext): Promise<void>;
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    close(context: IContext): Promise<void>;
    /**
     * Performs Google Function invocation.
     *
     * @param cmd               an action name to be called.
     * @param context 	(optional) execution context to trace execution through call chain.
     * @param args              action arguments
     * @return {any}            action result.
     */
    protected invoke<T>(cmd: string, context: IContext, args: any): Promise<T>;
    /**
     * Calls a Google Function action.
     *
     * @param cmd               an action name to be called.
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param params            (optional) action parameters.
     * @return {any}            action result.
     */
    protected call<T>(cmd: string, context: IContext, params?: any): Promise<T>;
}
