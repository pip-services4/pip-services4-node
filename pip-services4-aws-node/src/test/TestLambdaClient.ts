/** @module test */
import { LambdaClient } from "../clients/LambdaClient";

/**
 * AWS Lambda client used for automated testing.
 */
export class TestLambdaClient extends LambdaClient {
    public constructor() {
        super();
    }

    /**
     * Calls a AWS Lambda Function action.
     * 
     * @param cmd               an action name to be called.
     * @param context     (optional) a context to trace execution through call chain.
     * @param params            (optional) action parameters.
     * @return {any}            action result.
     */
     public async call(cmd: string, context: IContext, params: any = {}): Promise<any> {
        return super.call(cmd, context, params);
    }

    /**
     * Calls a AWS Lambda Function action asynchronously without waiting for response.
     * 
     * @param cmd               an action name to be called.
     * @param context     (optional) a context to trace execution through call chain.
     * @param params            (optional) action parameters.
     * @return {any}            action result.
     */
    public callOneWay(cmd: string, context: IContext, params: any = {}): Promise<any> {
        return super.callOneWay(cmd, context, params);
    }
}