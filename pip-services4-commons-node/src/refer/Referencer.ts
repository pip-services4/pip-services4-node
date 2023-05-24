/** @module refer */
import { IReferences } from './IReferences';

/**
 * Helper class that sets and unsets references to components.
 * 
 * @see [[IReferenceable]]
 * @see [[IUnreferenceable]]
 */
export class Referencer {
	/**
	 * Sets references to specific component.
	 * 
	 * To set references components must implement [[IReferenceable]] interface.
	 * If they don't the call to this method has no effect.
	 * 
	 * @param references 	the references to be set.
	 * @param component 	the component to set references to.
	 * 
	 * @see [[IReferenceable]]
	 */
	public static setReferencesForOne(references: IReferences, component: any): void {
        if (typeof component.setReferences === "function") {
			component.setReferences(references);
		}
	}

	/**
	 * Sets references to multiple components.
	 * 
	 * To set references components must implement [[IReferenceable]] interface.
	 * If they don't the call to this method has no effect.
	 * 
	 * @param references 	the references to be set.
	 * @param components 	a list of components to set the references to.
	 * 
	 * @see [[IReferenceable]]
	 */
	public static setReferences(references: IReferences, components: any[]): void {
		for (let index = 0; index < components.length; index++) {
			Referencer.setReferencesForOne(references, components[index]);
		}
	}

	/**
	 * Unsets references in specific component.
	 * 
	 * To unset references components must implement [[IUnreferenceable]] interface.
	 * If they don't the call to this method has no effect.
	 * 
	 * @param component 	the component to unset references.
	 * 
	 * @see [[IUnreferenceable]]
	 */
	public static unsetReferencesForOne(component: any): void {
        if (typeof component.unsetReferences === "function") {
			component.unsetReferences();
		}
	}

	/**
	 * Unsets references in multiple components.
	 * 
	 * To unset references components must implement [[IUnreferenceable]] interface.
	 * If they don't the call to this method has no effect.
	 * 
	 * @param components 	the list of components, whose references must be cleared.
	 * 
	 * @see [[IUnreferenceable]]
	 */
	public static unsetReferences(components: any[]): void {
		for (let index = 0; index < components.length; index++) {
			Referencer.unsetReferencesForOne(components[index]);
		}
	}
}
