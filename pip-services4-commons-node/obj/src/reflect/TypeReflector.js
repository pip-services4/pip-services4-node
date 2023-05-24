"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeReflector = void 0;
/** @module reflect */
/** @hidden */
const path = require("path");
const NotFoundException_1 = require("../errors/NotFoundException");
const TypeCode_1 = require("../convert/TypeCode");
const TypeConverter_1 = require("../convert/TypeConverter");
/**
 * Helper class to perform object type introspection and object instantiation.
 *
 * This class has symmetric implementation across all languages supported
 * by Pip.Services toolkit and used to support dynamic data processing.
 *
 * Because all languages have different casing and case sensitivity rules,
 * this TypeReflector treats all type names as case insensitive.
 *
 * @see [[TypeDescriptor]]
 *
 * ### Example ###
 *
 *     let descriptor = new TypeDescriptor("MyObject", "mylibrary");
 *     Typeeflector.getTypeByDescriptor(descriptor);
 *     let myObj = TypeReflector.createInstanceByDescriptor(descriptor);
 *
 *     TypeDescriptor.isPrimitive(myObject); 		// Result: false
 *     TypeDescriptor.isPrimitive(123);				// Result: true
 */
class TypeReflector {
    /**
     * Gets object type by its name and library where it is defined.
     *
     * @param name 		an object type name.
     * @param library 	a library where the type is defined
     * @returns the object type or null is the type wasn't found.
     */
    static getType(name, library) {
        try {
            if (!library) {
                library = name;
            }
            let absPath = library;
            if (absPath.startsWith('.')) {
                absPath = path.resolve(absPath);
            }
            // Load module
            let type = require(absPath);
            if (type == null)
                return null;
            // Get exported type by name
            if (name != null && name.length > 0) {
                type = type[name];
            }
            return type;
        }
        catch (ex) {
            return null;
        }
    }
    /**
     * Gets object type by type descriptor.
     *
     * @param descriptor 	a type descriptor that points to an object type
     * @returns the object type or null is the type wasn't found.
     *
     * @see [[getType]]
     * @see [[TypeDescriptor]]
     */
    static getTypeByDescriptor(descriptor) {
        if (descriptor == null) {
            throw new Error("Type descriptor cannot be null");
        }
        return TypeReflector.getType(descriptor.getName(), descriptor.getLibrary());
    }
    /**
     * Creates an instance of an object type.
     *
     * @param type 		an object type (factory function) to create.
     * @param args		arguments for the object constructor.
     * @returns the created object instance.
     */
    static createInstanceByType(type, ...args) {
        if (type == null) {
            throw new Error("Type constructor cannot be null");
        }
        if (typeof type !== "function") {
            throw new Error("Type contructor has to be a function");
        }
        return new type(...args);
    }
    /**
     * Creates an instance of an object type specified by its name
     * and library where it is defined.
     *
     * @param name 		an object type name.
     * @param library 	a library (module) where object type is defined.
     * @param args		arguments for the object constructor.
     * @returns the created object instance.
     *
     * @see [[getType]]
     * @see [[createInstanceByType]]
     */
    static createInstance(name, library, ...args) {
        let type = TypeReflector.getType(name, library);
        if (type == null) {
            throw new NotFoundException_1.NotFoundException(null, "TYPE_NOT_FOUND", "Type " + name + "," + library + " was not found").withDetails("type", name).withDetails("library", library);
        }
        return TypeReflector.createInstanceByType(type, ...args);
    }
    /**
     * Creates an instance of an object type specified by type descriptor.
     *
     * @param descriptor 	a type descriptor that points to an object type
     * @param args		arguments for the object constructor.
     * @returns the created object instance.
     *
     * @see [[createInstance]]
     * @see [[TypeDescriptor]]
     */
    static createInstanceByDescriptor(descriptor, ...args) {
        if (descriptor == null) {
            throw new Error("Type descriptor cannot be null");
        }
        return TypeReflector.createInstance(descriptor.getName(), descriptor.getLibrary(), ...args);
    }
    /**
     * Checks if value has primitive type.
     *
     * Primitive types are: numbers, strings, booleans, date and time.
     * Complex (non-primitive types are): objects, maps and arrays
     *
     * @param value 	a value to check
     * @returns true if the value has primitive type and false if value type is complex.
     *
     * @see [[TypeConverter.toTypeCode]]
     * @see [[TypeCode]]
     */
    static isPrimitive(value) {
        let typeCode = TypeConverter_1.TypeConverter.toTypeCode(value);
        return typeCode == TypeCode_1.TypeCode.String || typeCode == TypeCode_1.TypeCode.Enum
            || typeCode == TypeCode_1.TypeCode.Boolean || typeCode == TypeCode_1.TypeCode.Integer
            || typeCode == TypeCode_1.TypeCode.Long || typeCode == TypeCode_1.TypeCode.Float
            || typeCode == TypeCode_1.TypeCode.Double || typeCode == TypeCode_1.TypeCode.DateTime
            || typeCode == TypeCode_1.TypeCode.Duration;
    }
}
exports.TypeReflector = TypeReflector;
//# sourceMappingURL=TypeReflector.js.map