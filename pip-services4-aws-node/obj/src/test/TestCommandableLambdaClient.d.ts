/** @module test */
import { CommandableLambdaClient } from "../clients/CommandableLambdaClient";
export declare class TestCommandableLambdaClient extends CommandableLambdaClient {
    constructor(baseRoute: string);
    /**
     * Calls a remote action in AWS Lambda function.
     * The name of the action is added as "cmd" parameter
     * to the action parameters.
     *
     * @param cmd               an action name
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param params            command parameters.
     * @return {any}            action result.
     */
    callCommand<T>(name: string, context: IContext, params: any): Promise<T>;
}
