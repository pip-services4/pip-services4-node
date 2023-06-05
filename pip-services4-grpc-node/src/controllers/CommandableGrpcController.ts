/** @module controllers */
import { Context, IContext } from 'pip-services4-components-node';
import { ICommandable } from 'pip-services4-rpc-node';
import { CommandSet } from 'pip-services4-rpc-node';
import { ErrorDescriptionFactory } from 'pip-services4-commons-node';
import { InvocationException } from 'pip-services4-commons-node';
import { Parameters } from 'pip-services4-components-node';
import { Schema } from 'pip-services4-data-node';

import { GrpcController } from './GrpcController';

/**
 * Abstract controller that receives commands via GRPC protocol
 * to operations automatically generated for commands defined in [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable components]].
 * Each command is exposed as invoke method that receives command name and parameters.
 * 
 * Commandable controllers require only 3 lines of code to implement a robust external
 * GRPC-based remote interface.
 * 
 * ### Configuration parameters ###
 * 
 * - dependencies:
 *   - endpoint:              override for HTTP Endpoint dependency
 *   - service:            override for Service dependency
 * - connection(s):           
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] controllers to resolve connection
 * - <code>\*:endpoint:grpc:\*:1.0</code>          (optional) [[GrpcEndpoint]] reference
 * 
 * @see [[CommandableGrpcClient]]
 * @see [[GrpcService]]
 * 
 * ### Example ###
 * 
 *     class MyCommandableGrpcController extends CommandableGrpcController {
 *        public constructor() {
 *           base();
 *           this._dependencyResolver.put(
 *               "service",
 *               new Descriptor("mygroup","service","*","*","1.0")
 *           );
 *        }
 *     }
 * 
 *     let controller = new MyCommandableGrpcController();
 *     controller.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *     controller.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","service","default","default","1.0"), service
 *     ));
 * 
 *     await controller.open(Context.fromTraceId("123"));
 *     console.log("The GRPC controller is running on port 8080");
 */
export abstract class CommandableGrpcController extends GrpcController {
    private _name: string;
    private _commandSet: CommandSet;

    /**
     * Creates a new instance of the service.
     * 
     * @param name a service name.
     */
    public constructor(name: string) {
        super(null);
        this._name = name;
        this._dependencyResolver.put('service', 'none');
    }

    private applyCommand(schema: Schema, action: (context: IContext, data: any) => Promise<any>): (call: any) => Promise<any> {
        const actionWrapper = async (call) => {
            const method = call.request.method;
            const traceId = call.request.trace_id;

            try {
                // Convert arguments
                const argsEmpty = call.request.args_empty;
                const argsJson = call.request.args_json;
                const args = !argsEmpty && argsJson ? Parameters.fromJson(argsJson) : new Parameters();

                // Todo: Validate schema
                if (schema) {
                    //...
                }

                // Call command action
                try {
                    const result = await action(Context.fromTraceId(traceId), args);

                    // Process result and generate response
                    return {
                        error: null,
                        result_empty: result == null,
                        result_json: result != null ? JSON.stringify(result): null 
                    };
                } catch (ex) {
                    return {
                        error: ErrorDescriptionFactory.create(ex),
                        result_empty: true,
                        result_json: null
                    };            
                }
            } catch (ex) {
                // Handle unexpected exception
                const err = new InvocationException(
                    traceId,
                    "METHOD_FAILED",
                    "Method " + method + " failed"
                ).wrap(ex).withDetails("method", method);
            
                return { 
                    error: ErrorDescriptionFactory.create(err),
                    result_empty: true,
                    result_json: null 
                };
            }
        };

        return actionWrapper;
    }

    /**
     * Registers a commandable method in this objects GRPC server (service) by the given name.,
     * 
     * @param method        the GRPC method name.
     * @param schema        the schema to use for parameter validation.
     * @param action        the action to perform at the given route.
     */
     protected registerCommadableMethod(method: string, schema: Schema,
        action: (context: IContext, data: any) => Promise<any>): void {

        let actionWrapper = this.applyCommand(schema, action);
        actionWrapper = this.applyInterceptors(actionWrapper);

        this._endpoint.registerCommadableMethod(method, schema, actionWrapper);
    }

    /**
     * Registers all service routes in HTTP endpoint.
     */
    public register(): void {
        const service: ICommandable = this._dependencyResolver.getOneRequired<ICommandable>('service');
        this._commandSet = service.getCommandSet();

        const commands = this._commandSet.getCommands();
        for (let index = 0; index < commands.length; index++) {
            const command = commands[index];

            const method = '' + this._name + '.' + command.getName();

            this.registerCommadableMethod(method, null, (context, args) => {
                const timing = this.instrument(context, method);
                try {
                    return command.execute(context, args);
                } catch (ex) {
                    timing.endFailure(ex);
                } finally {
                    timing.endTiming();
                }
            });
        }
    }
}