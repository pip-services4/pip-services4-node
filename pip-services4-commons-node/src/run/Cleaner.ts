/** @module run */

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
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
	 * @param component 		the component that is to be cleaned.
	 * 
	 * @see [[ICleanable]]
	 */
	public static async clearOne(correlationId: string, component: any): Promise<void> {
        if (typeof component.clear === "function") {
			await component.clear(correlationId);
		}
	}

	/**
	 * Clears state of multiple components.
	 * 
	 * To be cleaned state components must implement [[ICleanable]] interface.
	 * If they don't the call to this method has no effect.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
	 * @param components 		the list of components that are to be cleaned.
	 * 
	 * @see [[clearOne]]
	 * @see [[ICleanable]]
	 */
	public static async clear(correlationId: string, components: any[]): Promise<void> {		
		for (let component of components) {
			await Cleaner.clearOne(correlationId, component);
		}
	}
}
