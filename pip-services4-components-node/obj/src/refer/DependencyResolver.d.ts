import { ConfigParams } from '../config/ConfigParams';
import { IReconfigurable } from '../config/IReconfigurable';
import { IReferenceable } from './IReferenceable';
import { IReferences } from './IReferences';
/**
 * Helper class for resolving component dependencies.
 *
 * The resolver is configured to resolve named dependencies by specific locator.
 * During deployment the dependency locator can be changed.
 *
 * This mechanism can be used to clarify specific dependency among several alternatives.
 * Typically components are configured to retrieve the first dependency that matches
 * logical group, type and version. But if container contains more than one instance
 * and resolution has to be specific about those instances, they can be given a unique
 * name and dependency resolvers can be reconfigured to retrieve dependencies by their name.
 *
 * ### Configuration parameters ###
 *
 * dependencies:
 * - [dependency name 1]: Dependency 1 locator (descriptor)
 * - ...
 * - [dependency name N]: Dependency N locator (descriptor)
 *
 * ### References ###
 *
 * References must match configured dependencies.
 *
 * ### Example ###
 *
 *     class MyComponent: IConfigurable, IReferenceable {
 *         private _dependencyResolver: DependencyResolver = new DependencyResolver();
 *         private _persistence: IMyPersistence;
 *         ...
 *
 *         public constructor() {
 *             this._dependencyResolver.put("persistence", new Descriptor("mygroup", "persistence", "*", "*", "1.0"));
 *         }
 *
 *         public configure(config: ConfigParams): void {
 *             this._dependencyResolver.configure(config);
 *         }
 *
 *         public setReferences(references: IReferences): void {
 *             this._dependencyResolver.setReferences(references);
 *             this._persistence = this._dependencyResolver.getOneRequired<IMyPersistence>("persistence");
 *         }
 *     }
 *
 *     // Create mycomponent and set specific dependency out of many
 *     let component = new MyComponent();
 *     component.configure(ConfigParams.fromTuples(
 *         "dependencies.persistence", "mygroup:persistence:*:persistence2:1.0"
 *     // Override default persistence dependency
 *     ));
 *     component.setReferences(References.fromTuples(
 *         new Descriptor("mygroup","persistence","*","persistence1","1.0"), new MyPersistence(),
 *         new Descriptor("mygroup","persistence","*","persistence2","1.0"), new MyPersistence()
 *     // This dependency shall be set
 *     ));
 *
 * @see [[IReferences]]
 */
export declare class DependencyResolver implements IReferenceable, IReconfigurable {
    private _dependencies;
    private _references;
    /**
     * Creates a new instance of the dependency resolver.
     *
     * @param config		(optional) default configuration where key is dependency name and value is locator (descriptor)
     * @param references	(optional) default component references
     *
     * @see [[ConfigParams]]
     * @see [[configure]]
     * @see [[IReferences]]
     * @see [[setReferences]]
     */
    constructor(config?: ConfigParams, references?: IReferences);
    /**
     * Configures the component with specified parameters.
     *
     * @param config 	configuration parameters to set.
     *
     * @see [[ConfigParams]]
     */
    configure(config: ConfigParams): void;
    /**
     * Sets the component references. References must match configured dependencies.
     *
     * @param references 	references to set.
     */
    setReferences(references: IReferences): void;
    /**
     * Adds a new dependency into this resolver.
     *
     * @param name 		the dependency's name.
     * @param locator 	the locator to find the dependency by.
     */
    put(name: string, locator: any): void;
    /**
     * Gets a dependency locator by its name.
     *
     * @param name 	the name of the dependency to locate.
     * @returns the dependency locator or null if locator was not configured.
     */
    private locate;
    /**
     * Gets all optional dependencies by their name.
     *
     * @param name 		the dependency name to locate.
     * @returns a list with found dependencies or empty list of no dependencies was found.
     */
    getOptional<T>(name: string): T[];
    /**
     * Gets all required dependencies by their name.
     * At least one dependency must be present.
     * If no dependencies was found it throws a [[ReferenceException]]
     *
     * @param name 		the dependency name to locate.
     * @returns a list with found dependencies.
     *
     * @throws a [[ReferenceException]] if no dependencies were found.
     */
    getRequired<T>(name: string): T[];
    /**
     * Gets one optional dependency by its name.
     *
     * @param name 		the dependency name to locate.
     * @returns a dependency reference or null of the dependency was not found
     */
    getOneOptional<T>(name: string): T;
    /**
     * Gets one required dependency by its name.
     * At least one dependency must present.
     * If the dependency was found it throws a [[ReferenceException]]
     *
     * @param name 		the dependency name to locate.
     * @returns a dependency reference
     *
     * @throws a [[ReferenceException]] if dependency was not found.
     */
    getOneRequired<T>(name: string): T;
    /**
     * Finds all matching dependencies by their name.
     *
     * @param name 		the dependency name to locate.
     * @param required 	true to raise an exception when no dependencies are found.
     * @returns a list of found dependencies
     *
     * @throws a [[ReferenceException]] of required is true and no dependencies found.
     */
    find<T>(name: string, required: boolean): T[];
    /**
     * Creates a new DependencyResolver from a list of key-value pairs called tuples
     * where key is dependency name and value the depedency locator (descriptor).
     *
     * @param tuples    a list of values where odd elements are dependency name and the following even elements are dependency locator (descriptor)
     * @returns         a newly created DependencyResolver.
     *
     * @see [[fromTuplesArray]]
     */
    static fromTuples(...tuples: any[]): DependencyResolver;
}
