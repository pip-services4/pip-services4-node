"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildReferencesDecorator = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const ReferencesDecorator_1 = require("./ReferencesDecorator");
/**
 * References decorator that automatically creates missing components using
 * available component factories upon component retrival.
 */
class BuildReferencesDecorator extends ReferencesDecorator_1.ReferencesDecorator {
    /**
     * Creates a new instance of the decorator.
     *
     * @param nextReferences         the next references or decorator in the chain.
     * @param topReferences         the decorator at the top of the chain.
     */
    constructor(nextReferences, topReferences) {
        super(nextReferences, topReferences);
    }
    /**
     * Finds a factory capable creating component by given descriptor
     * from the components registered in the references.
     *
     * @param locator   a locator of component to be created.
     * @returns found factory or null if factory was not found.
     */
    findFactory(locator) {
        const components = this.getAll();
        for (let index = 0; index < components.length; index++) {
            const component = components[index];
            if (typeof component.canCreate === "function" && typeof component.create === "function") {
                if (component.canCreate(locator)) {
                    return component;
                }
            }
        }
        return null;
    }
    /**
     * Creates a component identified by given locator.
     *
     * @param locator     a locator to identify component to be created.
     * @param factory   a factory that shall create the component.
     * @returns the created component.
     *
     * @throws a CreateException if the factory is not able to create the component.
     *
     * @see [[findFactory]]
     */
    create(locator, factory) {
        if (factory == null)
            return null;
        try {
            // Create component
            return factory.create(locator);
        }
        catch (ex) {
            return null;
        }
    }
    /**
     * Clarifies a component locator by merging two descriptors into one to replace missing fields.
     * That allows to get a more complete descriptor that includes all possible fields.
     *
     * @param locator   a component locator to clarify.
     * @param factory   a factory that shall create the component.
     * @returns clarified component descriptor (locator)
     */
    clarifyLocator(locator, factory) {
        if (factory == null)
            return locator;
        if (!(locator instanceof pip_services4_components_node_2.Descriptor))
            return locator;
        const anotherLocator = factory.canCreate(locator);
        if (anotherLocator == null)
            return locator;
        if (!(anotherLocator instanceof pip_services4_components_node_2.Descriptor))
            return locator;
        const descriptor = locator;
        const anotherDescriptor = anotherLocator;
        return new pip_services4_components_node_2.Descriptor(descriptor.getGroup() != null ? descriptor.getGroup() : anotherDescriptor.getGroup(), descriptor.getType() != null ? descriptor.getType() : anotherDescriptor.getType(), descriptor.getKind() != null ? descriptor.getKind() : anotherDescriptor.getKind(), descriptor.getName() != null ? descriptor.getName() : anotherDescriptor.getName(), descriptor.getVersion() != null ? descriptor.getVersion() : anotherDescriptor.getVersion());
    }
    /**
     * Gets all component references that match specified locator.
     *
     * @param locator     the locator to find a reference by.
     * @param required     forces to raise an exception if no reference is found.
     * @returns a list with matching component references.
     *
     * @throws a [[ReferenceException]] when required is set to true but no references found.
     */
    find(locator, required) {
        const components = super.find(locator, false);
        // Try to create the component
        if (required && components.length == 0) {
            const factory = this.findFactory(locator);
            const component = this.create(locator, factory);
            if (component != null) {
                try {
                    locator = this.clarifyLocator(locator, factory);
                    this.topReferences.put(locator, component);
                    components.push(component);
                }
                catch (ex) {
                    // Ignore exception
                }
            }
        }
        // Throw exception is no required components found
        if (required && components.length == 0) {
            throw new pip_services4_components_node_1.ReferenceException(null, locator);
        }
        return components;
    }
}
exports.BuildReferencesDecorator = BuildReferencesDecorator;
//# sourceMappingURL=BuildReferencesDecorator.js.map