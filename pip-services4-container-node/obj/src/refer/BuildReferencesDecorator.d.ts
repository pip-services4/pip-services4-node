/** @module refer */
import { IReferences } from 'pip-services4-commons-node';
import { IFactory } from 'pip-services4-components-node';
import { ReferencesDecorator } from './ReferencesDecorator';
/**
 * References decorator that automatically creates missing components using
 * available component factories upon component retrival.
 */
export declare class BuildReferencesDecorator extends ReferencesDecorator {
    /**
     * Creates a new instance of the decorator.
     *
     * @param nextReferences 		the next references or decorator in the chain.
     * @param topReferences 		the decorator at the top of the chain.
     */
    constructor(nextReferences: IReferences, topReferences: IReferences);
    /**
     * Finds a factory capable creating component by given descriptor
     * from the components registered in the references.
     *
     * @param locator   a locator of component to be created.
     * @returns found factory or null if factory was not found.
     */
    findFactory(locator: any): IFactory;
    /**
     * Creates a component identified by given locator.
     *
     * @param locator 	a locator to identify component to be created.
     * @param factory   a factory that shall create the component.
     * @returns the created component.
     *
     * @throws a CreateException if the factory is not able to create the component.
     *
     * @see [[findFactory]]
     */
    create(locator: any, factory: IFactory): any;
    /**
     * Clarifies a component locator by merging two descriptors into one to replace missing fields.
     * That allows to get a more complete descriptor that includes all possible fields.
     *
     * @param locator   a component locator to clarify.
     * @param factory   a factory that shall create the component.
     * @returns clarified component descriptor (locator)
     */
    clarifyLocator(locator: any, factory: IFactory): any;
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
}
