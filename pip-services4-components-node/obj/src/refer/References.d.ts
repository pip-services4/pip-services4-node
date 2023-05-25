/** @module refer */
import { Reference } from './Reference';
import { IReferences } from './IReferences';
/**
 * The most basic implementation of [[IReferences]] to store and locate component references.
 *
 * @see [[IReferences]]
 *
 * ### Example ###
 *
 *     export class MyController implements IReferenceable {
 *         public _persistence: IMyPersistence;
 *         ...
 *         public setReferences(references: IReferences): void {
 *             this._persistence = references.getOneRequired<IMyPersistence>(
 *                 new Descriptor("mygroup", "persistence", "*", "*", "1.0")
 *             );
 *         }
 *         ...
 *     }
 *
 *     let persistence = new MyMongoDbPersistence();
 *
 *     let controller = new MyController();
 *
 *     let references = References.fromTuples(
 *         new Descriptor("mygroup", "persistence", "mongodb", "default", "1.0"), persistence,
 *         new Descriptor("mygroup", "controller", "default", "default", "1.0"), controller
 *     );
 *     controller.setReferences(references);
 */
export declare class References implements IReferences {
    protected _references: Reference[];
    /**
     * Creates a new instance of references and initializes it with references.
     *
     * @param tuples    (optional) a list of values where odd elements are locators and the following even elements are component references
     */
    constructor(tuples?: any[]);
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
    /**
     * Gets locators for all registered component references in this reference map.
     *
     * @returns a list with component locators.
     */
    getAllLocators(): any[];
    /**
     * Gets all component references registered in this reference map.
     *
     * @returns a list with component references.
     */
    getAll(): any[];
    /**
     * Gets an optional component reference that matches specified locator.
     *
     * @param locator 	the locator to find references by.
     * @returns a matching component reference or null if nothing was found.
     */
    getOneOptional<T>(locator: any): T;
    /**
     * Gets a required component reference that matches specified locator.
     *
     * @param locator 	the locator to find a reference by.
     * @returns a matching component reference.
     * @throws a [[ReferenceException]] when no references found.
     */
    getOneRequired<T>(locator: any): T;
    /**
     * Gets all component references that match specified locator.
     *
     * @param locator 	the locator to find references by.
     * @returns a list with matching component references or empty list if nothing was found.
     */
    getOptional<T>(locator: any): T[];
    /**
     * Gets all component references that match specified locator.
     * At least one component reference must be present.
     * If it doesn't the method throws an error.
     *
     * @param locator 	the locator to find references by.
     * @returns a list with matching component references.
     *
     * @throws a [[ReferenceException]] when no references found.
     */
    getRequired<T>(locator: any): T[];
    /**
     * Gets all component references that match specified locator.
     *
     * @param locator 	the locator to find a reference by.
     * @param required 	forces to raise an exception if no reference is found.
     * @returns a list with matching component references.
     *
     * @throws a [[ReferenceException]] when required is set to true but no references found.
     */
    find<T>(locator: any, required: boolean): T[];
    /**
     * Creates a new References from a list of key-value pairs called tuples.
     *
     * @param tuples    a list of values where odd elements are locators and the following even elements are component references
     * @returns         a newly created References.
     *
     * @see [[fromTuplesArray]]
     */
    static fromTuples(...tuples: any[]): References;
}
