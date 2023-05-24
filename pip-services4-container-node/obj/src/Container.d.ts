import { IOpenable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { IReferenceable } from 'pip-services4-commons-node';
import { IUnreferenceable } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { ILogger } from 'pip-services4-components-node';
import { IFactory } from 'pip-services4-components-node';
import { ContextInfo } from 'pip-services4-components-node';
import { DefaultContainerFactory } from './build/DefaultContainerFactory';
import { ContainerConfig } from './config/ContainerConfig';
import { ContainerReferences } from './refer/ContainerReferences';
/**
 * Inversion of control (IoC) container that creates components and manages their lifecycle.
 *
 * The container is driven by configuration, that usually stored in JSON or YAML file.
 * The configuration contains a list of components identified by type or locator, followed
 * by component configuration.
 *
 * On container start it performs the following actions:
 * - Creates components using their types or calls registered factories to create components using their locators
 * - Configures components that implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/config.iconfigurable.html IConfigurable interface]] and passes them their configuration parameters
 * - Sets references to components that implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/refer.ireferenceable.html IReferenceable interface]] and passes them references of all components in the container
 * - Opens components that implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/run.iopenable.html IOpenable interface]]
 *
 * On container stop actions are performed in reversed order:
 * - Closes components that implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/run.iclosable.html ICloseable interface]]
 * - Unsets references in components that implement [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/refer.iunreferenceable.html IUnreferenceable interface]]
 * - Destroys components in the container.
 *
 * The component configuration can be parameterized by dynamic values. That allows specialized containers
 * to inject parameters from command line or from environment variables.
 *
 * The container automatically creates a ContextInfo component that carries detail information
 * about the container and makes it available for other components.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/config.iconfigurable.html IConfigurable]] (in the PipServices "Commons" package)
 * @see [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/refer.ireferenceable.html IReferenceable]] (in the PipServices "Commons" package)
 * @see [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/run.iopenable.html IOpenable]] (in the PipServices "Commons" package)
 *
 * ### Configuration parameters ###
 *
 * - name: 					the context (container or process) name
 * - description: 		   	human-readable description of the context
 * - properties: 			    entire section of additional descriptive properties
 * 	   - ...
 *
 * ### Example ###
 *
 *     ======= config.yml ========
 *     - descriptor: mygroup:mycomponent1:default:default:1.0
 *       param1: 123
 *       param2: ABC
 *
 *     - type: mycomponent2,mypackage
 *       param1: 321
 *       param2: XYZ
 *     ============================
 *
 *     let container = new Container();
 *     container.addFactory(new MyComponentFactory());
 *
 *     let parameters = ConfigParams.fromValue(process.env);
 *     container.readConfigFromFile("123", "./config/config.yml", parameters);
 *
 *     await container.open("123");
 *     console.log("Container is opened");
 *     ...
 *     await container.close("123");
 *     console.log("Container is closed");
 */
export declare class Container implements IConfigurable, IReferenceable, IUnreferenceable, IOpenable {
    protected _logger: ILogger;
    protected _factories: DefaultContainerFactory;
    protected _info: ContextInfo;
    protected _config: ContainerConfig;
    protected _references: ContainerReferences;
    /**
     * Creates a new instance of the container.
     *
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    constructor(name?: string, description?: string);
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Reads container configuration from JSON or YAML file
     * and parameterizes it with given values.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param path              a path to configuration file
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     */
    readConfigFromFile(correlationId: string, path: string, parameters: ConfigParams): void;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Unsets (clears) previously set references to dependent components.
     */
    unsetReferences(): void;
    private initReferences;
    /**
     * Adds a factory to the container. The factory is used to create components
     * added to the container by their locators (descriptors).
     *
     * @param factory a component factory to be added.
     */
    addFactory(factory: IFactory): void;
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
}
