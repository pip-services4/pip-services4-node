"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Referencer = void 0;
/**
 * Helper class that sets and unsets references to components.
 *
 * @see [[IReferenceable]]
 * @see [[IUnreferenceable]]
 */
class Referencer {
    /**
     * Sets references to specific component.
     *
     * To set references components must implement [[IReferenceable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param references     the references to be set.
     * @param component     the component to set references to.
     *
     * @see [[IReferenceable]]
     */
    static setReferencesForOne(references, component) {
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
     * @param references     the references to be set.
     * @param components     a list of components to set the references to.
     *
     * @see [[IReferenceable]]
     */
    static setReferences(references, components) {
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
     * @param component     the component to unset references.
     *
     * @see [[IUnreferenceable]]
     */
    static unsetReferencesForOne(component) {
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
     * @param components     the list of components, whose references must be cleared.
     *
     * @see [[IUnreferenceable]]
     */
    static unsetReferences(components) {
        for (let index = 0; index < components.length; index++) {
            Referencer.unsetReferencesForOne(components[index]);
        }
    }
}
exports.Referencer = Referencer;
//# sourceMappingURL=Referencer.js.map