/** @module run */
import { IContext } from "../context/IContext";
/**
 * Interface for components that require explicit closure.
 *
 * For components that require opening as well as closing
 * use [[IOpenable]] interface instead.
 *
 * @see [[IOpenable]]
 * @see [[Closer]]
 *
 * ### Example ###
 *
 *     class MyConnector implements ICloseable {
 *         private _client: any = null;
 *
 *         ... // The _client can be lazy created
 *
 *         public async close(context: IContext): Promise<void> {
 *             if (this._client != null) {
 *                 this._client.close();
 *                 this._client = null;
 *             }
 *         }
 *     }
 *
 */
export interface IClosable {
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(context: IContext): Promise<void>;
}
