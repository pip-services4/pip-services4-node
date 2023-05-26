/** @module clients */
import { IContext } from 'pip-services4-components-node';

import { RestClient } from './RestClient';

/**
 * Abstract client that calls commandable HTTP service.
 * 
 * Commandable services are generated automatically for [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable objects]].
 * Each command is exposed as POST operation that receives all parameters
 * in body object.
 * 
 * ### Configuration parameters ###
 * 
 * base_route:              base route for remote URI
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
 * - <code>\*:traces:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/trace.itracer.html ITracer]] components to record traces
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * 
 * ### Example ###
 * 
 *     class MyCommandableHttpClient extends CommandableHttpClient implements IMyClient {
 *        ...
 * 
 *         public async getData(context: IContext, id: string): Promise<MyData> {
 *            return await this.callCommand(
 *                "get_data",
 *                context,
 *                { id: id }
 *            );        
 *         }
 *         ...
 *     }
 * 
 *     let client = new MyCommandableHttpClient();
 *     client.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 * 
 *     let result = await client.getData("123", "1");
 *     ...
 */
export abstract class CommandableHttpClient extends RestClient {
    /**
     * Creates a new instance of the client.
     * 
     * @param baseRoute     a base route for remote service. 
     */
    public constructor(baseRoute: string) {
        super();
        this._baseRoute = baseRoute;
    }

    /**
     * Calls a remote method via HTTP commadable protocol.
     * The call is made via POST operation and all parameters are sent in body object.
     * The complete route to remote method is defined as baseRoute + "/" + name.
     * 
     * @param name              a name of the command to call. 
     * @param context     (optional) a context to trace execution through the call chain.
     * @param params            command parameters.
     * @returns                 a command execution result.
     */
    protected async callCommand<T>(name: string, context: IContext, params: any): Promise<T> {
        const timing = this.instrument(context, this._baseRoute + '.' + name);
        try {
            const response = await this.call<T>('post', name, context, {}, params || {});
            timing.endTiming();
            return response;
        } catch (ex) {
            timing.endFailure(ex);
            throw ex;
        }
    }
}