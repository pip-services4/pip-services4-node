/** @module refer */
import { IReferences } from 'pip-services4-components-node';
/**
 * Chainable decorator for IReferences that allows to inject additional capabilities
 * such as automatic component creation, automatic registration and opening.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/refer.ireferenceable.html IReferences]] (in the PipServices "Commons" package)
 */
export declare class ReferencesDecorator implements IReferences {
    /**
     * Creates a new instance of the decorator.
     *
     * @param nextReferences         the next references or decorator in the chain.
     * @param topReferences         the decorator at the top of the chain.
     */
    constructor(nextReferences: IReferences, topReferences: IReferences);
    /**
     * The next references or decorator in the chain.
     */
    nextReferences: IReferences;
    /**
     * The decorator at the top of the chain.
     */
    topReferences: IReferences;
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
     * @param locator     the locator to find references by.
     * @returns a matching component reference or null if nothing was found.
     */
    getOneOptional<T>(locator: any): T;
    /**
     * Gets a required component reference that matches specified locator.
     *
     * @param locator     the locator to find a reference by.
     * @returns a matching component reference.
     * @throws a [[ReferenceException]] when no references found.
     */
    getOneRequired<T>(locator: any): T;
    /**
     * Gets all component references that match specified locator.
     *
     * @param locator     the locator to find references by.
     * @returns a list with matching component references or empty list if nothing was found.
     */
    getOptional<T>(locator: any): T[];
    /**
     * Gets all component references that match specified locator.
     * At least one component reference must be present.
     * If it doesn't the method throws an error.
     *
     * @param locator     the locator to find references by.
     * @returns a list with matching component references.
     *
     * @throws a [[ReferenceException]] when no references found.
     */
    getRequired<T>(locator: any): T[];
    /**
     * Gets all component references that match specified locator.
     *
     * @param locator     the locator to find a reference by.
     * @param required     forces to raise an exception if no reference is found.
     * @returns a list with matching component references.
     *
     * @throws a [[ReferenceException]] when required is set to true but no references found.
     */
    find<T>(locator: any, required: boolean): T[];
}
