"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
/** @module core */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_components_node_2 = require("pip-services4-components-node");
const pip_services3_components_node_3 = require("pip-services4-components-node");
const DefaultContainerFactory_1 = require("./build/DefaultContainerFactory");
const ContainerConfig_1 = require("./config/ContainerConfig");
const ContainerConfigReader_1 = require("./config/ContainerConfigReader");
const ContainerReferences_1 = require("./refer/ContainerReferences");
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
class Container {
    /**
     * Creates a new instance of the container.
     *
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    constructor(name, description) {
        this._logger = new pip_services3_components_node_1.NullLogger();
        this._factories = new DefaultContainerFactory_1.DefaultContainerFactory();
        // Override in child classes
        this._info = new pip_services3_components_node_3.ContextInfo(name, description);
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._config = ContainerConfig_1.ContainerConfig.fromConfig(config);
    }
    /**
     * Reads container configuration from JSON or YAML file
     * and parameterizes it with given values.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param path              a path to configuration file
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     */
    readConfigFromFile(correlationId, path, parameters) {
        this._config = ContainerConfigReader_1.ContainerConfigReader.readFromFile(correlationId, path, parameters);
        this._logger.trace(correlationId, this._config.toString());
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        // Override in child classes
    }
    /**
     * Unsets (clears) previously set references to dependent components.
     */
    unsetReferences() {
        // Override in child classes
    }
    initReferences(references) {
        let existingInfo = references.getOneOptional(new pip_services3_commons_node_1.Descriptor("*", "context-info", "*", "*", "1.0"));
        if (existingInfo == null) {
            references.put(new pip_services3_commons_node_1.Descriptor("pip-services", "context-info", "default", "default", "1.0"), this._info);
        }
        else {
            this._info = existingInfo;
        }
        references.put(new pip_services3_commons_node_1.Descriptor("pip-services", "factory", "container", "default", "1.0"), this._factories);
    }
    /**
     * Adds a factory to the container. The factory is used to create components
     * added to the container by their locators (descriptors).
     *
     * @param factory a component factory to be added.
     */
    addFactory(factory) {
        this._factories.add(factory);
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._references != null;
    }
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    open(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._references != null) {
                throw new pip_services3_commons_node_2.InvalidStateException(correlationId, "ALREADY_OPENED", "Container was already opened");
            }
            try {
                this._logger.trace(correlationId, "Starting container.");
                // Create references with configured components
                this._references = new ContainerReferences_1.ContainerReferences();
                this.initReferences(this._references);
                this._references.putFromConfig(this._config);
                this.setReferences(this._references);
                // Get custom description if available
                let infoDescriptor = new pip_services3_commons_node_1.Descriptor("*", "context-info", "*", "*", "*");
                this._info = this._references.getOneOptional(infoDescriptor);
                yield this._references.open(correlationId);
                // Get reference to logger
                this._logger = new pip_services3_components_node_2.CompositeLogger(this._references);
                this._logger.info(correlationId, "Container %s started.", this._info.name);
            }
            catch (ex) {
                this._logger.fatal(correlationId, ex, "Failed to start container");
                yield this.close(correlationId);
                throw ex;
            }
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    close(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Skip if container wasn't opened
            if (this._references == null) {
                return null;
            }
            try {
                this._logger.trace(correlationId, "Stopping %s container", this._info.name);
                // Unset references for child container
                this.unsetReferences();
                // Close and dereference components
                yield this._references.close(correlationId);
                this._references = null;
                this._logger.info(correlationId, "Container %s stopped", this._info.name);
            }
            catch (ex) {
                this._logger.error(correlationId, ex, "Failed to stop container");
                throw ex;
            }
        });
    }
}
exports.Container = Container;
//# sourceMappingURL=Container.js.map