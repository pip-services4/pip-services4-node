/** @module run */

import { IContext } from "./IContext";

/**
 * Helper class that cleans stored object state.
 * 
 * @see [[ICleanable]]
 */
export class Cleaner {
	/**
	 * Clears state of specific component.
	 * 
	 * To be cleaned state components must implement [[ICleanable]] interface.
	 * If they don't the call to this method has no effect.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
	 * @param component 		the component that is to be cleaned.
	 * 
	 * @see [[ICleanable]]
	 */
	public static async clearOne(context: IContext, component: any): Promise<void> {
        if (typeof component.clear === "function") {
			await component.clear(context);
		}
	}

	/**
	 * Clears state of multiple components.
	 * 
	 * To be cleaned state components must implement [[ICleanable]] interface.
	 * If they don't the call to this method has no effect.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
	 * @param components 		the list of components that are to be cleaned.
	 * 
	 * @see [[clearOne]]
	 * @see [[ICleanable]]
	 */
	public static async clear(context: IContext, components: any[]): Promise<void> {		
		for (let component of components) {
			await Cleaner.clearOne(context, component);
		}
	}
}
