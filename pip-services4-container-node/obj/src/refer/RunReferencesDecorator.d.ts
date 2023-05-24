/** @module refer */
import { IReferences } from 'pip-services4-commons-node';
import { IOpenable } from 'pip-services4-commons-node';
import { ReferencesDecorator } from './ReferencesDecorator';
/**
 * References decorator that automatically opens to newly added components
 * that implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/run.iopenable.html IOpenable interface]] and closes removed components
 * that implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/run.iclosable.html ICloseable interface]].
 */
export declare class RunReferencesDecorator extends ReferencesDecorator implements IOpenable {
    _opened: boolean;
    /**
     * Creates a new instance of the decorator.
     *
     * @param nextReferences 		the next references or decorator in the chain.
     * @param topReferences 		the decorator at the top of the chain.
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
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    open(correlationId: string): Promise<void>;
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    close(correlationId: string): Promise<void>;
    /**
     * Puts a new reference into this reference map.
     *
     * @param locator 	a locator to find the reference by.
     * @param component a component reference to be added.
     */
    put(locator: any, component: any): void;
    /**
     * Removes a previously added reference that matches specified locator.
     * If many references match the locator, it removes only the first one.
     * When all references shall be removed, use [[removeAll]] method instead.
     *
     * @param locator 	a locator to remove reference
     * @returns the removed component reference.
     *
     * @see [[removeAll]]
     */
    remove(locator: any): any;
    /**
     * Removes all component references that match the specified locator.
     *
     * @param locator 	the locator to remove references by.
     * @returns a list, containing all removed references.
     */
    removeAll(locator: any): any[];
}
