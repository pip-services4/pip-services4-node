"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reference = void 0;
/** @module refer */
const Descriptor_1 = require("./Descriptor");
/**
 * Contains a reference to a component and locator to find it.
 * It is used by [[References]] to store registered component references.
 */
class Reference {
    /**
     * Create a new instance of the reference object and assigns its values.
     *
     * @param locator 		a locator to find the reference.
     * @param reference 	a reference to component.
     */
    constructor(locator, component) {
        if (component == null) {
            throw new Error("Component cannot be null");
        }
        this._locator = locator;
        this._component = component;
    }
    /**
     * Matches locator to this reference locator.
     *
     * Descriptors are matched using equal method.
     * All other locator types are matched using direct comparison.
     *
     * @param locator 	the locator to match.
     * @return true if locators are matching and false it they don't.
     *
     * @see [[Descriptor]]
     */
    match(locator) {
        // Locate by direct reference matching
        if (this._component == locator) {
            return true;
        }
        // Locate by direct locator matching
        else if (this._locator instanceof Descriptor_1.Descriptor) {
            return this._locator.equals(locator);
        }
        // Locate by direct locator matching
        else if (this._locator != null) {
            return this._locator == locator;
        }
        else {
            return false;
        }
    }
    /**
     * Gets the stored component reference.
     *
     * @return the component's references.
     */
    getComponent() {
        return this._component;
    }
    /**
     * Gets the stored component locator.
     *
     * @return the component's locator.
     */
    getLocator() {
        return this._locator;
    }
}
exports.Reference = Reference;
//# sourceMappingURL=Reference.js.map