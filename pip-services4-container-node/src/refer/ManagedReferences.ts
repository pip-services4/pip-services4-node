/** @module refer */
import { IOpenable } from 'pip-services4-commons-node';
import { References } from 'pip-services4-commons-node';

import { ReferencesDecorator } from './ReferencesDecorator';
import { BuildReferencesDecorator } from './BuildReferencesDecorator';
import { LinkReferencesDecorator } from './LinkReferencesDecorator';
import { RunReferencesDecorator } from './RunReferencesDecorator';

/**
 * Managed references that in addition to keeping and locating references can also 
 * manage their lifecycle:
 * - Auto-creation of missing component using available factories
 * - Auto-linking newly added components
 * - Auto-opening newly added components
 * - Auto-closing removed components
 * 
 * @see [[RunReferencesDecorator]]
 * @see [[LinkReferencesDecorator]]
 * @see [[BuildReferencesDecorator]]
 * @see [[https://pip-services4-node.github.io/pip-services4-commons-node/classes/refer.reference.html References]] (in the PipServices "Commons" package)
 */
export class ManagedReferences extends ReferencesDecorator implements IOpenable {
    protected _references: References;
    protected _builder: BuildReferencesDecorator;
    protected _linker: LinkReferencesDecorator;
    protected _runner: RunReferencesDecorator;

    /**
     * Creates a new instance of the references
     * 
     * @param tuples    tuples where odd values are component locators (descriptors) and even values are component references
     */
    public constructor(tuples: any[] = null) {
        super(null, null);

        this._references = new References(tuples);
        this._builder = new BuildReferencesDecorator(this._references, this);
        this._linker = new LinkReferencesDecorator(this._builder, this);
        this._runner = new RunReferencesDecorator(this._linker, this);

        this.nextReferences = this._runner;
    }

    /** 
	 * Checks if the component is opened.
	 * 
	 * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._linker.isOpen() && this._runner.isOpen();
    }
    
    /**
	 * Opens the component.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    public async open(correlationId: string): Promise<void> {
        await this._linker.open(correlationId);
        await this._runner.open(correlationId);
    }


    /**
	 * Closes component and frees used resources.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    public async close(correlationId: string): Promise<void> {
        await this._runner.close(correlationId);
        await this._linker.close(correlationId);
    }

    /**
	 * Creates a new ManagedReferences object filled with provided key-value pairs called tuples.
	 * Tuples parameters contain a sequence of locator1, component1, locator2, component2, ... pairs.
	 * 
	 * @param tuples	the tuples to fill a new ManagedReferences object.
	 * @returns			a new ManagedReferences object.
     */
	public static fromTuples(...tuples: any[]): ManagedReferences {
		return new ManagedReferences(tuples);
	}
}
