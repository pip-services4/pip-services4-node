/** @module test */
import { IContext } from 'pip-services4-components-node';

import { CommandableGrpcClient } from "../clients/CommandableGrpcClient";

export class TestCommandableGrpcClient extends CommandableGrpcClient {
    /**
     * Creates a new instance of the client.
     * 
     * @param name     a controller name. 
     */
     public constructor(name: string) {
        super(name);
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
     public callCommand<T>(name: string, context: IContext, params: any): Promise<any> {
        return super.callCommand<T>(name, context, params);
    }
}