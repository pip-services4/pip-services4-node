/** @module clients */
import { IOpenable } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { IdGenerator } from 'pip-services4-commons-node';
import { UnknownException } from 'pip-services4-commons-node';
import { InvocationException } from 'pip-services4-commons-node';
import { DependencyResolver } from 'pip-services4-commons-node';
import { CompositeLogger } from 'pip-services4-components-node';
import { CompositeTracer } from 'pip-services4-components-node';
import { CompositeCounters } from 'pip-services4-components-node';
import { InstrumentTiming } from "pip-services4-rpc-node";

import { Lambda } from 'aws-sdk';
import { config } from 'aws-sdk';

import { AwsConnectionParams } from '../connect/AwsConnectionParams';
import { AwsConnectionResolver } from '../connect/AwsConnectionResolver';


/**
 * Abstract client that calls AWS Lambda Functions.
 * 
 * When making calls "cmd" parameter determines which what action shall be called, while
 * other parameters are passed to the action itself.
 * 
 * ### Configuration parameters ###
 * 
 * - connections:                   
 *     - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *     - region:                      (optional) AWS region
 * - credentials:    
 *     - store_key:                   (optional) a key to retrieve the credentials from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/auth.icredentialstore.html ICredentialStore]]
 *     - access_id:                   AWS access/client id
 *     - access_key:                  AWS access/client id
 * - options:
 *     - connect_timeout:             (optional) connection timeout in milliseconds (default: 10 sec)
 *  
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:credential-store:\*:\*:1.0</code>  (optional) Credential stores to resolve credentials
 * 
 * @see [[LambdaFunction]]
 * @see [[CommandableLambdaClient]]
 * 
 * ### Example ###
 * 
 *     class MyLambdaClient extends LambdaClient implements IMyClient {
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
 *     let client = new MyLambdaClient();
 *     client.configure(ConfigParams.fromTuples(
 *         "connection.region", "us-east-1",
 *         "connection.access_id", "XXXXXXXXXXX",
 *         "connection.access_key", "XXXXXXXXXXX",
 *         "connection.arn", "YYYYYYYYYYYYY"
 *     ));
 *     
 *     const result = await client.getData("123", "1");
 */
export abstract class LambdaClient implements IOpenable, IConfigurable, IReferenceable {
    /**
     * The reference to AWS Lambda Function.
     */
    protected _lambda: any;
    /**
     * The opened flag.
     */
    protected _opened: boolean = false;
    /**
     * The AWS connection parameters
     */
    protected _connection: AwsConnectionParams;
    private _connectTimeout: number = 10000;

    /**
     * The dependencies resolver.
     */
    protected _dependencyResolver: DependencyResolver = new DependencyResolver();
    /**
     * The connection resolver.
     */
    protected _connectionResolver: AwsConnectionResolver = new AwsConnectionResolver();
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

        let counterTiming = this._counters.beginTiming(name + ".exec_time");
        let traceTiming = this._tracer.beginTrace(context, name, null);
        return new InstrumentTiming(context, name, "exec",
            this._logger, this._counters, counterTiming, traceTiming);
    }

    /**
	 * Checks if the component is opened.
	 * 
	 * @returns {boolean} true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._opened;
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

        config.update({
            accessKeyId: this._connection.getAccessId(),
            secretAccessKey: this._connection.getAccessKey(),
            region: this._connection.getRegion()
        });

        config.httpOptions = {
            timeout: this._connectTimeout
        };

        this._lambda = new Lambda();

        this._opened = true;
        this._logger.debug(context, "Lambda client connected to %s", this._connection.getArn());
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async close(context: IContext): Promise<void> {
        // Todo: close listening?
        if (!this.isOpen()) {
            return;
        }
        this._opened = false;
    }

    /**
     * Performs AWS Lambda Function invocation.
     * 
     * @param invocationType    an invocation type: "RequestResponse" or "Event"
     * @param cmd               an action name to be called.
	 * @param context 	(optional) execution context to trace execution through call chain.
     * @param args              action arguments
     * @return {any}            action result.
     */
    protected async invoke(invocationType: string, cmd: string, context: IContext, args: any): Promise<any> {
        if (cmd == null) {
            throw new UnknownException(null, 'NO_COMMAND', 'Missing Seneca pattern cmd');
        }

        args = Object.assign({}, args);
        args.cmd = cmd;
        args.trace_id = context || IdGenerator.nextShort();

        let params = {
            FunctionName: this._connection.getArn(),
            InvocationType: invocationType,
            LogType: 'None',
            Payload: JSON.stringify(args)
        }                        

        try {
            const data = await this._lambda.invoke(params).promise();

            let result: any = data.Payload;

            if (typeof result === "string") {
                try {
                    result = JSON.parse(result);
                } catch (err) {
                    throw new InvocationException(
                        context,
                        'DESERIALIZATION_FAILED',
                        'Failed to deserialize result'
                    ).withCause(err);
                }
            }
            return result;
        } catch (err) {
            throw new InvocationException(
                context,
                'CALL_FAILED',
                'Failed to invoke lambda function'
            ).withCause(err);
        }
    }    

    /**
     * Calls a AWS Lambda Function action.
     * 
     * @param cmd               an action name to be called.
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param params            (optional) action parameters.
     * @return {any}            action result.
     */
    protected async call(cmd: string, context: IContext, params: any = {}): Promise<any> {
        return this.invoke('RequestResponse', cmd, context, params);
    }

    /**
     * Calls a AWS Lambda Function action asynchronously without waiting for response.
     * 
     * @param cmd               an action name to be called.
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param params            (optional) action parameters.
     * @return {any}            action result.
     */
    protected callOneWay(cmd: string, context: IContext, params: any = {}): Promise<any> {
        return this.invoke('Event', cmd, context, params);
    }

}