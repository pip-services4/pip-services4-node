/** @module test */
import { IContext } from 'pip-services4-components-node';
import { RestClient } from "../clients/RestClient";
/**
 * REST client used for automated testing.
 */
export declare class TestRestClient extends RestClient {
    constructor(baseRoute: string);
    /**
     * Calls a remote method via HTTP/REST protocol.
     *
     * @param method            HTTP method: "get", "head", "post", "put", "delete"
     * @param route             a command route. Base route will be added to this route
     * @param context           (optional) a context to trace execution through call chain.
     * @param params            (optional) query parameters.
     * @param data              (optional) body object.
     * @returns                 a result object.
     */
    call<T>(method: string, route: string, context?: IContext, params?: any, data?: any): Promise<T>;
}
