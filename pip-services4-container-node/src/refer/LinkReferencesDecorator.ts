/** @module refer */

import { IContext } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { Referencer } from 'pip-services4-components-node';
import { IOpenable } from 'pip-services4-components-node';

import { ReferencesDecorator } from './ReferencesDecorator'

/**
 * References decorator that automatically sets references to newly added components
 * that implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/refer.ireferenceable.html IReferenceable interface]] and unsets references from removed components
 * that implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/refer.iunreferenceable.html IUnreferenceable interface]].
 */
export class LinkReferencesDecorator extends ReferencesDecorator implements IOpenable {
    private _opened = false;

    /**
     * Creates a new instance of the decorator.
     * 
     * @param nextReferences         the next references or decorator in the chain.
     * @param topReferences         the decorator at the top of the chain.
     */
    public constructor(nextReferences: IReferences, topReferences: IReferences) {
        super(nextReferences, topReferences);
    }

    /**
     * Checks if the component is opened.
     * 
     * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._opened;
    }

    /**
     * Opens the component.
     * 
     * @param context     (optional) execution context to trace execution through call chain.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async open(context: IContext): Promise<void> {
        if (!this._opened) {
            this._opened = true;
            const components = this.getAll();
            Referencer.setReferences(this.topReferences, components);
        }
    }

    /**
     * Closes component and frees used resources.
     * 
     * @param context     (optional) execution context to trace execution through call chain.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async close(context: IContext): Promise<void> {
        if (this._opened) {
            this._opened = false;
            const components = this.getAll();
            Referencer.unsetReferences(components);
        }
    }

    /**
     * Puts a new reference into this reference map.
     * 
     * @param locator     a locator to find the reference by.
     * @param component a component reference to be added.
     */
    public put(locator: any, component: any): any {
        super.put(locator, component);

        if (this._opened) {
            Referencer.setReferencesForOne(this.topReferences, component);
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
    public remove(locator: any): any {
        const component = super.remove(locator);

        if (this._opened) {
            Referencer.unsetReferencesForOne(component);
        }

        return component;
    }

    /**
     * Removes all component references that match the specified locator. 
     * 
     * @param locator     the locator to remove references by.
     * @returns a list, containing all removed references.
     */
    public removeAll(locator: any): any[] {
        const components = super.removeAll(locator);

        if (this._opened) {
            Referencer.unsetReferences(components);
        }

        return components;
    }
}
