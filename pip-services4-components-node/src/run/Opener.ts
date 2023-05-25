/** @module run */

import { IContext } from "../context/IContext";

/**
 * Helper class that opens components.
 * 
 * [[IOpenable]]
 */
export class Opener {
	/**
	 * Checks if specified component is opened.
	 * 
	 * To be checked components must implement [[IOpenable]] interface.
	 * If they don't the call to this method returns true.
	 * 
	 * @param component 	the component that is to be checked.
	 * @returns true if component is opened and false otherwise.
	 * 
	 * @see [[IOpenable]]
	 */
	public static isOpenOne(component: any): boolean {
		if (typeof component.isOpen === "function") {
			return component.isOpen();
		}
		return true;
	}	

	/**
	 * Checks if all components are opened.
	 * 
	 * To be checked components must implement [[IOpenable]] interface.
	 * If they don't the call to this method returns true.
	 * 
	 * @param components 	a list of components that are to be checked.
	 * @returns true if all components are opened and false if at least one component is closed.
	 * 
	 * @see [[isOpenOne]]
	 * @see [[IOpenable]]
	 */
	public static isOpen(components: any[]): boolean {
		if (components == null) return true;
		
		let result: boolean = true;
		for (let component of components) {
			result = result && Opener.isOpenOne(component);
		}
		
		return result;
	}

	/**
	 * Opens specific component.
	 * 
	 * To be opened components must implement [[IOpenable]] interface.
	 * If they don't the call to this method has no effect.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
	 * @param component 		the component that is to be opened.
	 * 
	 * @see [[IOpenable]]
	 */
	public static async openOne(context: IContext, component: any): Promise<void> {
        if (typeof component.open === "function") {
			await component.open(context);
		}
	}	

	/**
	 * Opens multiple components.
	 * 
	 * To be opened components must implement [[IOpenable]] interface.
	 * If they don't the call to this method has no effect.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
	 * @param components 		the list of components that are to be closed.
	 * 
	 * @see [[openOne]]
	 * @see [[IOpenable]]
	 */
	public static async open(context: IContext, components: any[]): Promise<void> {
		for (let component of components) {
			await Opener.openOne(context, component);
		}
	}

}
