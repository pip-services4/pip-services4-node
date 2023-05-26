"use strict";
/** @module refer */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkReferencesDecorator = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const ReferencesDecorator_1 = require("./ReferencesDecorator");
/**
 * References decorator that automatically sets references to newly added components
 * that implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/refer.ireferenceable.html IReferenceable interface]] and unsets references from removed components
 * that implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/refer.iunreferenceable.html IUnreferenceable interface]].
 */
class LinkReferencesDecorator extends ReferencesDecorator_1.ReferencesDecorator {
    /**
     * Creates a new instance of the decorator.
     *
     * @param nextReferences         the next references or decorator in the chain.
     * @param topReferences         the decorator at the top of the chain.
     */
    constructor(nextReferences, topReferences) {
        super(nextReferences, topReferences);
        this._opened = false;
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._opened;
    }
    /**
     * Opens the component.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._opened) {
                this._opened = true;
                const components = this.getAll();
                pip_services4_components_node_1.Referencer.setReferences(this.topReferences, components);
            }
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    close(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._opened) {
                this._opened = false;
                const components = this.getAll();
                pip_services4_components_node_1.Referencer.unsetReferences(components);
            }
        });
    }
    /**
     * Puts a new reference into this reference map.
     *
     * @param locator     a locator to find the reference by.
     * @param component a component reference to be added.
     */
    put(locator, component) {
        super.put(locator, component);
        if (this._opened) {
            pip_services4_components_node_1.Referencer.setReferencesForOne(this.topReferences, component);
        }
    }
    /**
     * Removes a previously added reference that matches specified locator.
     * If many references match the locator, it removes only the first one.
     * When all references shall be removed, use [[removeAll]] method instead.
     *
     * @param locator     a locator to remove reference
     * @returns the removed component reference.
     *
     * @see [[removeAll]]
     */
    remove(locator) {
        const component = super.remove(locator);
        if (this._opened) {
            pip_services4_components_node_1.Referencer.unsetReferencesForOne(component);
        }
        return component;
    }
    /**
     * Removes all component references that match the specified locator.
     *
     * @param locator     the locator to remove references by.
     * @returns a list, containing all removed references.
     */
    removeAll(locator) {
        const components = super.removeAll(locator);
        if (this._opened) {
            pip_services4_components_node_1.Referencer.unsetReferences(components);
        }
        return components;
    }
}
exports.LinkReferencesDecorator = LinkReferencesDecorator;
//# sourceMappingURL=LinkReferencesDecorator.js.map