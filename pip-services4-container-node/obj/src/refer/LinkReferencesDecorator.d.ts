/** @module refer */
import { IContext } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { IOpenable } from 'pip-services4-components-node';
import { ReferencesDecorator } from './ReferencesDecorator';
/**
 * References decorator that automatically sets references to newly added components
 * that implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/refer.ireferenceable.html IReferenceable interface]] and unsets references from removed components
 * that implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/refer.iunreferenceable.html IUnreferenceable interface]].
 */
export declare class LinkReferencesDecorator extends ReferencesDecorator implements IOpenable {
    private _opened;
    /**
     * Creates a new instance of the decorator.
     *
     * @param nextReferences         the next references or decorator in the chain.
     * @param topReferences         the decorator at the top of the chain.
     */
    constructor(nextReferences: IReferences, topReferences: IReferences);
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen(): boolean;
    /**
     * Opens the component.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    open(context: IContext): Promise<void>;
    /**
     * Closes component and frees used resources.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    close(context: IContext): Promise<void>;
    /**
     * Puts a new reference into this reference map.
     *
     * @param locator     a locator to find the reference by.
     * @param component a component reference to be added.
     */
    put(locator: any, component: any): any;
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
    remove(locator: any): any;
    /**
     * Removes all component references that match the specified locator.
     *
     * @param locator     the locator to remove references by.
     * @returns a list, containing all removed references.
     */
    removeAll(locator: any): any[];
}
