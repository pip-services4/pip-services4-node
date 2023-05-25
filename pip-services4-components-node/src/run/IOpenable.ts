/** @module run */

import { IContext } from "./IContext";
import { IClosable } from './IClosable'

/**
 * Interface for components that require explicit opening and closing.
 * 
 * For components that perform opening on demand consider using
 * [[IClosable]] interface instead.
 * 
 * @see [[IOpenable]]
 * @see [[Opener]]
 * 
 * ### Example ###
 * 
 *     class MyPersistence implements IOpenable {
 *         private _client: any;
 *         ...
 *         public isOpen(): boolean {
 *             return this._client != null;
 *         } 
 *         
 *         public async open(context: IContext): Promise<void> {
 *             if (this.isOpen()) {
 *                 return;
 *             }
 *             ...
 *         }
 *         
 *         public async close(context: IContext): Promise<void> {
 *             if (this._client != null) {
 *                 this._client.close();
 *                 this._client = null;
 *             }
 *         }
 *        
 *         ...
 *     }
 */
export interface IOpenable extends IClosable {
	/**
	 * Checks if the component is opened.
	 * 
	 * @returns true if the component has been opened and false otherwise.
	 */
	isOpen(): boolean;

	/**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
	 */
	open(context: IContext): Promise<void>;
}
