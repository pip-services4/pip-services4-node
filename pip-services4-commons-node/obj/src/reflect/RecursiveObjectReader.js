"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecursiveObjectReader = void 0;
/** @module reflect */
const TypeCode_1 = require("../convert/TypeCode");
const TypeConverter_1 = require("../convert/TypeConverter");
const ObjectReader_1 = require("./ObjectReader");
/**
 * Helper class to perform property introspection and dynamic reading.
 *
 * It is similar to [[ObjectReader]] but reads properties recursively
 * through the entire object graph. Nested property names are defined
 * using dot notation as "object.subobject.property"
 *
 * @see [[PropertyReflector]]
 * @see [[ObjectReader]]
 */
class RecursiveObjectReader {
    static performHasProperty(obj, names, nameIndex) {
        if (nameIndex < names.length - 1) {
            let value = ObjectReader_1.ObjectReader.getProperty(obj, names[nameIndex]);
            if (value != null) {
                return RecursiveObjectReader.performHasProperty(value, names, nameIndex + 1);
            }
            else {
                return false;
            }
        }
        else {
            return ObjectReader_1.ObjectReader.hasProperty(obj, names[nameIndex]);
        }
    }
    /**
     * Checks recursively if object or its subobjects has a property with specified name.
     *
     * The object can be a user defined object, map or array.
     * The property name correspondently must be object property,
     * map key or array index.
     *
     * @param obj 	an object to introspect.
     * @param name 	a name of the property to check.
     * @returns true if the object has the property and false if it doesn't.
     */
    static hasProperty(obj, name) {
        if (obj == null || name == null)
            return false;
        let names = name.split(".");
        if (names == null || names.length == 0) {
            return false;
        }
        return RecursiveObjectReader.performHasProperty(obj, names, 0);
    }
    static performGetProperty(obj, names, nameIndex) {
        if (nameIndex < names.length - 1) {
            let value = ObjectReader_1.ObjectReader.getProperty(obj, names[nameIndex]);
            if (value != null) {
                return RecursiveObjectReader.performGetProperty(value, names, nameIndex + 1);
            }
            else {
                return null;
            }
        }
        else {
            return ObjectReader_1.ObjectReader.getProperty(obj, names[nameIndex]);
        }
    }
    /**
     * Recursively gets value of object or its subobjects property specified by its name.
     *
     * The object can be a user defined object, map or array.
     * The property name correspondently must be object property,
     * map key or array index.
     *
     * @param obj 	an object to read property from.
     * @param name 	a name of the property to get.
     * @returns the property value or null if property doesn't exist or introspection failed.
     */
    static getProperty(obj, name) {
        if (obj == null || name == null)
            return null;
        let names = name.split(".");
        if (names == null || names.length == 0) {
            return null;
        }
        return RecursiveObjectReader.performGetProperty(obj, names, 0);
    }
    static isSimpleValue(value) {
        let code = TypeConverter_1.TypeConverter.toTypeCode(value);
        return code != TypeCode_1.TypeCode.Array && code != TypeCode_1.TypeCode.Map && code != TypeCode_1.TypeCode.Object;
    }
    static performGetPropertyNames(obj, path, result, cycleDetect) {
        let map = ObjectReader_1.ObjectReader.getProperties(obj);
        if (Object.keys(map).length > 0 && cycleDetect.length < 100) {
            cycleDetect.push(obj);
            try {
                for (let key in map) {
                    let value = map[key];
                    // Prevent cycles 
                    if (cycleDetect.indexOf(value) >= 0) {
                        continue;
                    }
                    let newPath = path != null ? path + "." + key : key;
                    // Add simple values directly
                    if (RecursiveObjectReader.isSimpleValue(value)) {
                        result.push(newPath);
                    }
                    // Recursively go to elements
                    else {
                        RecursiveObjectReader.performGetPropertyNames(value, newPath, result, cycleDetect);
                    }
                }
            }
            finally {
                let index = cycleDetect.indexOf(obj);
                if (index >= 0) {
                    cycleDetect.splice(index, 1);
                }
            }
        }
        else {
            if (path != null) {
                result.push(path);
            }
        }
    }
    /**
     * Recursively gets names of all properties implemented in specified object and its subobjects.
     *
     * The object can be a user defined object, map or array.
     * Returned property name correspondently are object properties,
     * map keys or array indexes.
     *
     * @param obj   an objec to introspect.
     * @returns a list with property names.
     */
    static getPropertyNames(obj) {
        let propertyNames = [];
        if (obj == null) {
            return propertyNames;
        }
        else {
            let cycleDetect = [];
            RecursiveObjectReader.performGetPropertyNames(obj, null, propertyNames, cycleDetect);
            return propertyNames;
        }
    }
    static performGetProperties(obj, path, result, cycleDetect) {
        let map = ObjectReader_1.ObjectReader.getProperties(obj);
        if (Object.keys(map).length > 0 && cycleDetect.length < 100) {
            cycleDetect.push(obj);
            try {
                for (let key in map) {
                    let value = map[key];
                    // Prevent cycles 
                    if (cycleDetect.indexOf(value) >= 0) {
                        continue;
                    }
                    let newPath = path != null ? path + "." + key : key;
                    // Add simple values directly
                    if (RecursiveObjectReader.isSimpleValue(value)) {
                        result[newPath] = value;
                    }
                    // Recursively go to elements
                    else {
                        RecursiveObjectReader.performGetProperties(value, newPath, result, cycleDetect);
                    }
                }
            }
            finally {
                let index = cycleDetect.indexOf(obj);
                if (index >= 0) {
                    cycleDetect.splice(index, 1);
                }
            }
        }
        else {
            if (path != null) {
                result[path] = obj;
            }
        }
    }
    /**
     * Get values of all properties in specified object and its subobjects
     * and returns them as a map.
     *
     * The object can be a user defined object, map or array.
     * Returned properties correspondently are object properties,
     * map key-pairs or array elements with their indexes.
     *
     * @param obj   an object to get properties from.
     * @returns a map, containing the names of the object's properties and their values.
     */
    static getProperties(obj) {
        let properties = {};
        if (obj != null) {
            let cycleDetect = [];
            RecursiveObjectReader.performGetProperties(obj, null, properties, cycleDetect);
        }
        return properties;
    }
}
exports.RecursiveObjectReader = RecursiveObjectReader;
//# sourceMappingURL=RecursiveObjectReader.js.map