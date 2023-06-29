/** @module clients */

import { InstrumentTiming } from "pip-services4-rpc-node";

import { AzureFunctionConnectionParams } from '../connect/AzureFunctionConnectionParams';
import { AzureFunctionConnectionResolver } from '../connect/AzureFunctionConnectionResolver';
import { ConnectionException, UnknownException, ApplicationExceptionFactory } from "pip-services4-commons-node";
import { IOpenable, IConfigurable, IReferenceable, DependencyResolver, ConfigParams, IReferences, IContext, ContextResolver } from "pip-services4-components-node";
import { CompositeLogger, CompositeCounters, CompositeTracer } from "pip-services4-observability-node";
import { IdGenerator } from "pip-services4-data-node";


/**
 * Abstract client that calls Azure Functions.
 * 
 * When making calls "cmd" parameter determines which what action shall be called, while
 * other parameters are passed to the action itself.
 * 
 * ### Configuration parameters ###
 * 
 * - connections:                   
 *     - uri:                         (optional) full connection string or use protocol, app_name and function_name to build
 *     - protocol:                    (optional) connection protocol
 *     - app_name:                    (optional) Azure Function application name
 *     - function_name:               (optional) Azure Function name
 * - options:
 *      - retries:               number of retries (default: 3)
 *      - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *      - timeout:               invocation timeout in milliseconds (default: 10 sec)
 * - credentials:
 *     - auth_code:                   Azure Function auth code if use custom authorization provide empty string
 *  
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:credential-store:\*:\*:1.0</code>  (optional) Credential stores to resolve credentials
 * 
 * @see [[AzureFunction]]
 * @see [[CommandableAzureClient]]
 * 
 * ### Example ###
 * 
 *     class MyAzureFunctionClient extends AzureFunctionClient implements IMyClient {
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
 *     let client = new MyAzureFunctionClient();
 *     client.configure(ConfigParams.fromTuples(
 *         "connection.uri", "http://myapp.azurewebsites.net/api/myfunction",
 *         "connection.protocol", "http",
 *         "connection.app_name", "myapp",
 *         "connection.function_name", "myfunction"
 *         "credential.auth_code", "XXXX"
 *     ));
 *     
 *     const result = await client.getData("123", "1");
 */
export abstract class AzureFunctionClient implements IOpenable, IConfigurable, IReferenceable {
    /**
     * The HTTP client.
     */
    protected _client: any;
    /**
     * The Azure Function connection parameters
     */
    protected _connection: AzureFunctionConnectionParams;

    protected _retries = 3;
    /**
     * The default headers to be added to every request.
     */
    protected _headers: any = {};
    /**
     * The connection timeout in milliseconds.
     */
    protected _connectTimeout = 10000;
    /**
     * The invocation timeout in milliseconds.
     */
    protected _timeout = 10000;
    /**
     * The remote controller uri which is calculated on open.
     */
    protected _uri: string;

    /**
     * The dependencies resolver.
     */
    protected _dependencyResolver: DependencyResolver = new DependencyResolver();
    /**
     * The connection resolver.
     */
    protected _connectionResolver: AzureFunctionConnectionResolver = new AzureFunctionConnectionResolver();
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
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._connectionResolver.configure(config);
		this._dependencyResolver.configure(config);

        this._connectTimeout = config.getAsIntegerWithDefault('options.connect_timeout', this._connectTimeout);
        this._retries = config.getAsIntegerWithDefault("options.retries", this._retries);
        this._timeout = config.getAsIntegerWithDefault("options.timeout", this._timeout);
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._connectionResolver.setReferences(references);
        this._dependencyResolver.setReferences(references);
    }

    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a CounterTiming object that is used to end the time measurement.
     * 
     * @param context         (optional) transaction id to trace execution through call chain.
     * @param name                  a method name.
     * @returns {InstrumentTiming}  object to end the time measurement.
     */
    protected instrument(context: IContext, name: string): InstrumentTiming {
        this._logger.trace(context, "Executing %s method", name);
        this._counters.incrementOne(name + ".exec_count");

        const counterTiming = this._counters.beginTiming(name + ".exec_time");
        const traceTiming = this._tracer.beginTrace(context, name, null);
        return new InstrumentTiming(context, name, "exec",
            this._logger, this._counters, counterTiming, traceTiming);
    }

    /**
	 * Checks if the component is opened.
	 * 
	 * @returns {boolean} true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._client != null;
    }

    /**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     *
     */
    public async open(context: IContext): Promise<void> {
        if (this.isOpen()) {
            return;
        }

        this._connection = await this._connectionResolver.resolve(context);
        this._headers['x-functions-key'] = this._connection.getAuthCode();
        this._uri = this._connection.getFunctionUri();
        try {
            this._uri = this._connection.getFunctionUri();
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const restify = require('restify-clients');
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

            this._logger.debug(context, "Azure function client connected to %s", this._connection.getFunctionUri());

        } catch (err) {
            this._client = null;

            throw new ConnectionException(
                context != null ? ContextResolver.getTraceId(context) : null, "CANNOT_CONNECT", "Connection to Azure function controller failed"
            ).wrap(err).withDetails("url", this._uri);
        }
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async close(context: IContext): Promise<void> {
        if (!this.isOpen()) {
            return;
        }
        if (this._client != null) {
            // Eat exceptions
            try {
                this._logger.debug(context, "Closed Azure function controller at %s", this._uri);
            } catch (ex) {
                this._logger.warn(context, "Failed while closing Azure function controller: %s", ex);
            }

            this._client = null;
            this._uri = null;
        }
    }

    /**
     * Performs Azure Function invocation.
     * 
     * @param cmd               an action name to be called.
	 * @param context 	(optional) execution context to trace execution through call chain.
     * @param args              action arguments
     * @return {any}            action result.
     */
    protected async invoke<T>(cmd: string, context: IContext, args: any): Promise<T> {
        if (cmd == null) {
            throw new UnknownException(null, 'NO_COMMAND', 'Cmd parameter is missing');
        }

        args = Object.assign({}, args);
        args.cmd = cmd;
        args.trace_id = context || IdGenerator.nextShort();

        return new Promise((resolve, reject) => {
            const action = (err, req, res, data) => {
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

            this._client.post(this._uri, args, action);
        });

    }    

    /**
     * Calls a Azure Function action.
     * 
     * @param cmd               an action name to be called.
     * @param context     (optional) a context to trace execution through call chain.
     * @param params            (optional) action parameters.
     * @return {any}            action result.
     */
    protected async call<T>(cmd: string, context: IContext, params: any = {}): Promise<T> {
        return this.invoke<T>(cmd, context, params);
    }

}