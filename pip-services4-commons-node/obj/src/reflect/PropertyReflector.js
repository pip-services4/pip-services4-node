"use strict";
/** @module reflect */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyReflector = void 0;
/**
 * Helper class to perform property introspection and dynamic reading and writing.
 *
 * This class has symmetric implementation across all languages supported
 * by Pip.Services toolkit and used to support dynamic data processing.
 *
 * Because all languages have different casing and case sensitivity rules,
 * this PropertyReflector treats all property names as case insensitive.
 *
 * ### Example ###
 *
 *     let myObj = new MyObject();
 *
 *     let properties = PropertyReflector.getPropertyNames();
 *     PropertyReflector.hasProperty(myObj, "myProperty");
 *     let value = PropertyReflector.getProperty(myObj, "myProperty");
 *     PropertyReflector.setProperty(myObj, "myProperty", 123);
 */
class PropertyReflector {
    static matchField(fieldName, fieldValue, expectedName) {
        if (typeof fieldValue === "function")
            return false;
        if (fieldName.startsWith('_'))
            return false;
        if (expectedName == null)
            return true;
        return fieldName.toLowerCase() == expectedName;
    }
    /**
     * Checks if object has a property with specified name..
     *
     * @param obj 	an object to introspect.
     * @param name 	a name of the property to check.
     * @returns true if the object has the property and false if it doesn't.
     */
    static hasProperty(obj, name) {
        if (obj == null) {
            throw new Error("Object cannot be null");
        }
        if (name == null) {
            throw new Error("Property name cannot be null");
        }
        name = name.toLowerCase();
        for (let field in obj) {
            let fieldValue = obj[field];
            if (PropertyReflector.matchField(field, fieldValue, name)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Gets value of object property specified by its name.
     *
     * @param obj 	an object to read property from.
     * @param name 	a name of the property to get.
     * @returns the property value or null if property doesn't exist or introspection failed.
     */
    static getProperty(obj, name) {
        if (obj == null) {
            throw new Error("Object cannot be null");
        }
        if (name == null) {
            throw new Error("Property name cannot be null");
        }
        name = name.toLowerCase();
        let fields = this.getAllFieldsOfObject(obj);
        for (let index = 0; index < fields.length; index++) {
            let fieldValue = obj[fields[index]];
            try {
                if (PropertyReflector.matchField(fields[index], fieldValue, name)) {
                    return fieldValue;
                }
            }
            catch (ex) {
                // Ignore exceptions
            }
        }
        return null;
    }
    static getAllFieldsOfObject(obj) {
        let properties = [];
        while (obj != null && Object.getPrototypeOf(obj) != null) {
            // enumerable props
            for (let prop in obj) {
                properties.push(prop.toString());
            }
            // non-enumerable props
            Object.entries(Object.getOwnPropertyDescriptors(obj.constructor.prototype)).forEach(prop => {
                if (prop[1].get != undefined || prop[1].set != undefined) {
                    properties.push(prop[0]);
                }
            });
            obj = Object.getPrototypeOf(obj);
        }
        return properties;
    }
    /**
     * Gets names of all properties implemented in specified object.
     *
     * @param obj   an objec to introspect.
     * @returns a list with property names.
     */
    static getPropertyNames(obj) {
        let properties = [];
        let fields = this.getAllFieldsOfObject(obj);
        for (let index = 0; index < fields.length; index++) {
            let fieldValue = obj[fields[index]];
            if (PropertyReflector.matchField(fields[index], fieldValue, null)) {
                properties.push(fields[index]);
            }
        }
        return properties;
    }
    /**
     * Get values of all properties in specified object
     * and returns them as a map.
     *
     * @param obj   an object to get properties from.
     * @returns a map, containing the names of the object's properties and their values.
     */
    static getProperties(obj) {
        let map = {};
        let fields = this.getAllFieldsOfObject(obj);
        for (let index = 0; index < fields.length; index++) {
            let fieldValue = obj[fields[index]];
            try {
                if (PropertyReflector.matchField(fields[index], fieldValue, null)) {
                    map[fields[index]] = fieldValue;
                }
            }
            catch (ex) {
                // Ignore exception
            }
        }
        return map;
    }
    /**
     * Sets value of object property specified by its name.
     *
     * If the property does not exist or introspection fails
     * this method doesn't do anything and doesn't any throw errors.
     *
     * @param obj 	an object to write property to.
     * @param name 	a name of the property to set.
     * @param value a new value for the property to set.
     */
    static setProperty(obj, name, value) {
        if (obj == null) {
            throw new Error("Object cannot be null");
        }
        if (name == null) {
            throw new Error("Property name cannot be null");
        }
        let expectedName = name.toLowerCase();
        let fields = this.getAllFieldsOfObject(obj);
        for (let index = 0; index < fields.length; index++) {
            let fieldValue = obj[fields[index]];
            try {
                if (PropertyReflector.matchField(fields[index], fieldValue, expectedName)) {
                    obj[fields[index]] = value;
                    return;
                }
            }
            catch (ex) {
                // Ignore exception
            }
        }
        // If no existing properties found set it directly
        obj[name] = value;
    }
    /**
     * Sets values of some (all) object properties.
     *
     * If some properties do not exist or introspection fails
     * they are just silently skipped and no errors thrown.
     *
     * @param obj 		 an object to write properties to.
     * @param values 	a map, containing property names and their values.
     *
     * @see [[setProperty]]
     */
    static setProperties(obj, values) {
        if (values == null)
            return;
        for (let field in values) {
            let fieldValue = values[field];
            PropertyReflector.setProperty(obj, field, fieldValue);
        }
    }
}
exports.PropertyReflector = PropertyReflector;
//# sourceMappingURL=PropertyReflector.js.map