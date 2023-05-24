/** @module build */
import { IFactory } from './IFactory';
/**
 * Aggregates multiple factories into a single factory component.
 * When a new component is requested, it iterates through
 * factories to locate the one able to create the requested component.
 *
 * This component is used to conveniently keep all supported factories in a single place.
 *
 * ### Example ###
 *
 *     let factory = new CompositeFactory();
 *     factory.add(new DefaultLoggerFactory());
 *     factory.add(new DefaultCountersFactory());
 *
 *     let loggerLocator = new Descriptor("*", "logger", "*", "*", "1.0");
 *     factory.canCreate(loggerLocator); 		// Result: Descriptor("pip-service", "logger", "null", "default", "1.0")
 *     factory.create(loggerLocator); 			// Result: created NullLogger
 */
export declare class CompositeFactory implements IFactory {
    private _factories;
    /**
     * Creates a new instance of the factory.
     *
     * @param factories 	a list of factories to embed into this factory.
     */
    constructor(...factories: IFactory[]);
    /**
     * Adds a factory into the list of embedded factories.
     *
     * @param factory 	a factory to be added.
     */
    add(factory: IFactory): void;
    /**
     * Removes a factory from the list of embedded factories.
     *
     * @param factory 	the factory to remove.
     */
    remove(factory: IFactory): void;
    /**
     * Checks if this factory is able to create component by given locator.
     *
     * This method searches for all registered components and returns
     * a locator for component it is able to create that matches the given locator.
     * If the factory is not able to create a requested component is returns null.
     *
     * @param locator 	a locator to identify component to be created.
     * @returns			a locator for a component that the factory is able to create.
     */
    canCreate(locator: any): any;
    /**
     * Creates a component identified by given locator.
     *
     * @param locator 	a locator to identify component to be created.
     * @returns the created component.
     *
     * @throws a CreateException if the factory is not able to create the component.
     */
    create(locator: any): any;
}
