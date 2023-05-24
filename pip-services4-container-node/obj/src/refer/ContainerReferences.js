"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerReferences = void 0;
/** @module refer */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const pip_services3_components_node_1 = require("pip-services4-components-node");
const ManagedReferences_1 = require("./ManagedReferences");
/**
 * Container managed references that can be created from container configuration.
 *
 * @see [[ManagedReferences]]
 */
class ContainerReferences extends ManagedReferences_1.ManagedReferences {
    /**
     * Puts components into the references from container configuration.
     *
     * @param   config  a container configuration with information of components to be added.
     *
     * @throws CreateException when one of component cannot be created.
     */
    putFromConfig(config) {
        for (let i = 0; i < config.length; i++) {
            let componentConfig = config[i];
            let component;
            let locator;
            try {
                // Create component dynamically
                if (componentConfig.type != null) {
                    locator = componentConfig.type;
                    component = pip_services3_commons_node_1.TypeReflector.createInstanceByDescriptor(componentConfig.type);
                }
                // Or create component statically
                else if (componentConfig.descriptor != null) {
                    locator = componentConfig.descriptor;
                    let factory = this._builder.findFactory(locator);
                    component = this._builder.create(locator, factory);
                    if (component == null) {
                        throw new pip_services3_commons_node_2.ReferenceException(null, locator);
                    }
                    locator = this._builder.clarifyLocator(locator, factory);
                }
                // Check that component was created
                if (component == null) {
                    throw new pip_services3_components_node_1.CreateException("CANNOT_CREATE_COMPONENT", "Cannot create component")
                        .withDetails("config", config);
                }
                // Add component to the list
                this._references.put(locator, component);
                if (component.configure) {
                    // Configure component
                    let configurable = component;
                    configurable.configure(componentConfig.config);
                }
                // Set references to factories
                if (component.canCreate && component.create) {
                    let referenceable = component;
                    referenceable.setReferences(this);
                }
            }
            catch (ex) {
                throw new pip_services3_commons_node_2.ReferenceException(null, locator)
                    .withCause(ex);
            }
        }
    }
}
exports.ContainerReferences = ContainerReferences;
//# sourceMappingURL=ContainerReferences.js.map