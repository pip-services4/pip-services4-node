/** @module run */
import { IContext } from "../context/IContext";
/**
 * Interface for components that should clean their state.
 *
 * Cleaning state most often is used during testing.
 * But there may be situations when it can be done in production.
 *
 * @see [[Cleaner]]
 *
 * ### Example ###
 *
 *     class MyObjectWithState implements ICleanable {
 *         private _state: any = {};
 *         ...
 *         public async clear(context: IContext): void {
 *             this._state = {};
 *         }
 *     }
 *
 */
export interface ICleanable {
    /**
     * Clears component state.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     * @param callback             callback function that receives error or null no errors occured.
     */
    clear(context: IContext): Promise<void>;
}
