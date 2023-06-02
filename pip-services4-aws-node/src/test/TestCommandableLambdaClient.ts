/** @module test */
import { IContext } from "pip-services4-components-node";
import { CommandableLambdaClient } from "../clients/CommandableLambdaClient";

export class TestCommandableLambdaClient extends CommandableLambdaClient {
    public constructor(baseRoute: string) {
        super(baseRoute);
    }

    /**
     * Calls a remote action in AWS Lambda function.
     * The name of the action is added as "cmd" parameter
     * to the action parameters. 
     * 
     * @param cmd               an action name
     * @param context     (optional) a context to trace execution through call chain.
     * @param params            command parameters.
     * @return {any}            action result.
     */
    public async callCommand<T>(name: string, context: IContext, params: any): Promise<T> {
        return super.callCommand(name, context, params);
    }
}