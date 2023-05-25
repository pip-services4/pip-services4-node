/** @module refer */
import { IReferences } from './IReferences';
/**
 * Helper class that sets and unsets references to components.
 *
 * @see [[IReferenceable]]
 * @see [[IUnreferenceable]]
 */
export declare class Referencer {
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
    static setReferencesForOne(references: IReferences, component: any): void;
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
    static setReferences(references: IReferences, components: any[]): void;
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
    static unsetReferencesForOne(component: any): void;
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
    static unsetReferences(components: any[]): void;
}
