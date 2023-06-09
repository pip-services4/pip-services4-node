/** @module clients */
import { ContextResolver, IContext } from 'pip-services4-components-node';
import { GrpcClient } from './GrpcClient';

import { ApplicationExceptionFactory } from 'pip-services4-commons-node';

/**
 * Abstract client that calls commandable GRPC controller.
 * 
 * Commandable controllers are generated automatically for [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable objects]].
 * Each command is exposed as Invoke method that receives all parameters as args.
 * 
 * ### Configuration parameters ###
 * 
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
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] controllers to resolve connection
 * 
 * ### Example ###
 * 
 *     class MyCommandableGrpcClient extends CommandableGrpcClient implements IMyClient {
 *        ...
 * 
 *         public async getData(context: IContext, id: string): Promise<MyData> {
 *        
 *            return await this.callCommand(
 *                "get_data",
 *                context,
 *                { id: id }
 *            );
 *         }
 *         ...
 *     }
 * 
 *     let client = new MyCommandableGrpcClient();
 *     client.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 * 
 *     let result = await client.getData("123", "1");
 */
export class CommandableGrpcClient extends GrpcClient {
    /**
     * The controller name
     */
    protected _name: string;

    /**
     * Creates a new instance of the client.
     * 
     * @param name     a controller name. 
     */
    public constructor(name: string) {
        super(__dirname + "../../../../src/protos/commandable.proto", "commandable.Commandable");
        this._name = name;
    }

    /**
     * Calls a remote method via GRPC commadable protocol.
     * The call is made via Invoke method and all parameters are sent in args object.
     * The complete route to remote method is defined as controllerName + "." + name.
     * 
     * @param name              a name of the command to call. 
     * @param context     (optional) a context to trace execution through call chain.
     * @param params            command parameters.
     * @returns the received result.
     */
    protected async callCommand<T>(name: string, context: IContext, params: any): Promise<T> {
        const method = this._name + '.' + name;
        const timing = this.instrument(context, method);
        const traceId = context != null ? ContextResolver.getTraceId(context) : null;
        const request = {
            method: method,
            trace_id: traceId,
            args_empty: params == null,
            args_json: params != null ? JSON.stringify(params) : null
        };

        try {
            const response = await this.call<any>("invoke", traceId, request);

            // Handle error response
            if (response.error != null) {
                const err = ApplicationExceptionFactory.create(response.error);
                throw err;
            }

            // Handle empty response
            if (response.result_empty || response.result_json == null) {
                return null;
            }

            // Handle regular response
            const result = JSON.parse(response.result_json);

            timing.endTiming();
            return result;
        } catch (ex) {
            timing.endFailure(ex);
            throw ex;
        }
    }
}