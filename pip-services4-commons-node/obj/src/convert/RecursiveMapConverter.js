"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecursiveMapConverter = void 0;
/** @module convert */
const TypeCode_1 = require("./TypeCode");
const TypeConverter_1 = require("./TypeConverter");
const TypeReflector_1 = require("../reflect/TypeReflector");
/**
 * Converts arbitrary values into map objects using extended conversion rules.
 * This class is similar to [[MapConverter]], but is recursively converts all values
 * stored in objects and arrays.
 *
 * ### Example ###
 *
 *     let value1 = RecursiveMapConverted.toNullableMap("ABC"); // Result: null
 *     let value2 = RecursiveMapConverted.toNullableMap({ key: 123 }); // Result: { key: 123 }
 *     let value3 = RecursiveMapConverted.toNullableMap([1,[2,3]); // Result: { "0": 1, { "0": 2, "1": 3 } }
 */
class RecursiveMapConverter {
    static objectToMap(value) {
        if (value == null)
            return null;
        let result = {};
        let props = Object.keys(value);
        for (let i = 0; i < props.length; i++) {
            let propValue = value[props[i]];
            propValue = RecursiveMapConverter.valueToMap(propValue);
            result[props[i]] = propValue;
        }
        return result;
    }
    static valueToMap(value) {
        if (value == null)
            return null;
        // Skip expected non-primitive values
        if (typeof value === "string")
            return value;
        let valueType = TypeConverter_1.TypeConverter.toTypeCode(value);
        // Skip primitive values
        if (TypeReflector_1.TypeReflector.isPrimitive(valueType))
            return value;
        if (valueType == TypeCode_1.TypeCode.Map) {
            return RecursiveMapConverter.mapToMap(value);
        }
        // Convert arrays
        if (valueType == TypeCode_1.TypeCode.Array) {
            return RecursiveMapConverter.arrayToMap(value);
        }
        return RecursiveMapConverter.objectToMap(value);
    }
    static mapToMap(value) {
        let result = {};
        let keys = Object.keys(value);
        for (let i = 0; i < keys.length; i++) {
            result[keys[i]] = RecursiveMapConverter.valueToMap(value[keys[i]]);
        }
    }
    static arrayToMap(value) {
        let result = [];
        for (let i = 0; i < value.length; i++) {
            result[i] = RecursiveMapConverter.valueToMap(value[i]);
        }
        return result;
    }
    /**
     * Converts value into map object or returns null when conversion is not possible.
     *
     * @param value     the value to convert.
     * @returns         map object or null when conversion is not supported.
     */
    static toNullableMap(value) {
        return RecursiveMapConverter.valueToMap(value);
    }
    /**
     * Converts value into map object or returns empty map when conversion is not possible
     *
     * @param value     the value to convert.
     * @returns         map object or empty map when conversion is not supported.
     *
     * @see [[toNullableMap]]
     */
    static toMap(value) {
        return RecursiveMapConverter.toNullableMap(value) || {};
    }
    /**
     * Converts value into map object or returns default when conversion is not possible
     *
     * @param value         the value to convert.
     * @param defaultValue  the default value.
     * @returns             map object or emptu map when conversion is not supported.
     *
     * @see [[toNullableMap]]
     */
    static toMapWithDefault(value, defaultValue) {
        return RecursiveMapConverter.toNullableMap(value) || defaultValue;
    }
}
exports.RecursiveMapConverter = RecursiveMapConverter;
//# sourceMappingURL=RecursiveMapConverter.js.map