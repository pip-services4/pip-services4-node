/** @module test */
import { LambdaClient } from "../clients/LambdaClient";
/**
 * AWS Lambda client used for automated testing.
 */
export declare class TestLambdaClient extends LambdaClient {
    constructor();
    /**
     * Calls a AWS Lambda Function action.
     *
     * @param cmd               an action name to be called.
     * @param context     (optional) a context to trace execution through call chain.
     * @param params            (optional) action parameters.
     * @return {any}            action result.
     */
    call(cmd: string, context: IContext, params?: any): Promise<any>;
    /**
     * Calls a AWS Lambda Function action asynchronously without waiting for response.
     *
     * @param cmd               an action name to be called.
     * @param context     (optional) a context to trace execution through call chain.
     * @param params            (optional) action parameters.
     * @return {any}            action result.
     */
    callOneWay(cmd: string, context: IContext, params?: any): Promise<any>;
}
