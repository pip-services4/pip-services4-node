/** @module refer */
import { IReferences } from 'pip-services4-commons-node';
import { Opener } from 'pip-services4-commons-node';
import { Closer } from 'pip-services4-commons-node';
import { IOpenable } from 'pip-services4-commons-node';

import { ReferencesDecorator } from './ReferencesDecorator';

/**
 * References decorator that automatically opens to newly added components
 * that implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/run.iopenable.html IOpenable interface]] and closes removed components
 * that implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/run.iclosable.html ICloseable interface]].
 */
export class RunReferencesDecorator extends ReferencesDecorator implements IOpenable {
    public _opened: boolean = false;

    /**
	 * Creates a new instance of the decorator.
	 * 
	 * @param nextReferences 		the next references or decorator in the chain.
	 * @param topReferences 		the decorator at the top of the chain.
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
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
        if (!this._opened) {
            let components = this.getAll();
            await Opener.open(context, components);
            this._opened = true;
        }
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async close(context: IContext): Promise<void> {
        if (this._opened) {
            let components = this.getAll();
            await Closer.close(context, components);
            this._opened = false;
        }
    }

    /**
	 * Puts a new reference into this reference map.
	 * 
	 * @param locator 	a locator to find the reference by.
	 * @param component a component reference to be added.
	 */
    public put(locator: any, component: any): void {
        super.put(locator, component);

        if (this._opened) {
            Opener.openOne(null, component);
        }
    }

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
    public remove(locator: any): any {
        let component = super.remove(locator);

        if (this._opened) {
            Closer.closeOne(null, component);
        }

        return component;
    }

    /**
	 * Removes all component references that match the specified locator. 
	 * 
	 * @param locator 	the locator to remove references by.
	 * @returns a list, containing all removed references.
	 */
    public removeAll(locator: any): any[] {
        let components = super.removeAll(locator);

        if (this._opened) {
            Closer.close(null, components);
        }

        return components;
    }

}