"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
const CreateException_1 = require("./CreateException");
class Registration {
}
/**
 * Basic component factory that creates components using registered types and factory functions.
 *
 * #### Example ###
 *
 *     let factory = new Factory();
 *
 *     factory.registerAsType(
 *         new Descriptor("mygroup", "mycomponent1", "default", "*", "1.0"),
 *         MyComponent1
 *     );
 *     factory.register(
 *         new Descriptor("mygroup", "mycomponent2", "default", "*", "1.0"),
 *         (locator) => {
 *             return new MyComponent2();
 *         }
 *     );
 *
 *     factory.create(new Descriptor("mygroup", "mycomponent1", "default", "name1", "1.0"))
 *     factory.create(new Descriptor("mygroup", "mycomponent2", "default", "name2", "1.0"))
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/refer.descriptor.html Descriptor]]
 * @see [[IFactory]]
 */
class Factory {
    constructor() {
        this._registrations = [];
    }
    /**
     * Registers a component using a factory method.
     *
     * @param locator     a locator to identify component to be created.
     * @param factory   a factory function that receives a locator and returns a created component.
     */
    register(locator, factory) {
        if (locator == null) {
            throw new Error("Locator cannot be null");
        }
        if (factory == null) {
            throw new Error("Factory cannot be null");
        }
        this._registrations.push({
            locator: locator,
            factory: factory
        });
    }
    /**
     * Registers a component using its type (a constructor function).
     *
     * @param locator         a locator to identify component to be created.
     * @param type             a component type.
     */
    registerAsType(locator, type) {
        if (locator == null) {
            throw new Error("Locator cannot be null");
        }
        if (type == null) {
            throw new Error("Factory cannot be null");
        }
        this._registrations.push({
            locator: locator,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            factory: (locator) => { return new type(); }
        });
    }
    /**
     * Checks if this factory is able to create component by given locator.
     *
     * This method searches for all registered components and returns
     * a locator for component it is able to create that matches the given locator.
     * If the factory is not able to create a requested component is returns null.
     *
     * @param locator     a locator to identify component to be created.
     * @returns            a locator for a component that the factory is able to create.
     */
    canCreate(locator) {
        for (const registration of this._registrations) {
            const thisLocator = registration.locator;
            if (thisLocator == locator || (typeof thisLocator.equals === "function" && thisLocator.equals(locator))) {
                return thisLocator;
            }
        }
        return null;
    }
    /**
     * Creates a component identified by given locator.
     *
     * @param locator     a locator to identify component to be created.
     * @returns the created component.
     *
     * @throws a CreateException if the factory is not able to create the component.
     */
    create(locator) {
        for (const registration of this._registrations) {
            const thisLocator = registration.locator;
            if (thisLocator == locator || (typeof thisLocator.equals === "function" && thisLocator.equals(locator)))
                try {
                    return registration.factory(locator);
                }
                catch (ex) {
                    if (ex instanceof CreateException_1.CreateException) {
                        throw ex;
                    }
                    throw new CreateException_1.CreateException(null, "Failed to create object for " + locator).withCause(ex);
                }
        }
        return null;
    }
}
exports.Factory = Factory;
//# sourceMappingURL=Factory.js.map