/** @module test */
import { CommandableHttpClient } from "../clients/CommandableHttpClient";

export class TestCommandableHttpClient extends CommandableHttpClient {
    public constructor(baseRoute: string) {
        super(baseRoute);
    }

    /**
     * Calls a remote method via HTTP commadable protocol.
     * The call is made via POST operation and all parameters are sent in body object.
     * The complete route to remote method is defined as baseRoute + "/" + name.
     * 
     * @param name              a name of the command to call. 
     * @param context     (optional) transaction id to trace execution through the call chain.
     * @param params            command parameters.
     * @returns                 a command execution result.
     */
    public callCommand<T>(name: string, context: IContext, params: any): Promise<T> {
        return super.callCommand(name, context, params);
    }
}