/** @module convert */
import { TypeCode } from './TypeCode';
import { TypeConverter } from './TypeConverter';
import { TypeReflector } from '../reflect/TypeReflector';

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
export class RecursiveMapConverter {

    private static objectToMap(value: any): any {
        if (value == null) return null;

        const result = {};
        const props = Object.keys(value);

        for (let i = 0; i < props.length; i++) {
            let propValue = value[props[i]];
            propValue = RecursiveMapConverter.valueToMap(propValue);
            result[props[i]] = propValue;
        }

        return result;
    }

    private static valueToMap(value: any): any {
        if (value == null) return null;

        // Skip expected non-primitive values
        if (typeof value === "string") return value;

        const valueType = TypeConverter.toTypeCode(value);
        // Skip primitive values
        if (TypeReflector.isPrimitive(valueType)) return value;

        if (valueType == TypeCode.Map) {
            return RecursiveMapConverter.mapToMap(value);
        }

        // Convert arrays
        if (valueType == TypeCode.Array) {
            return RecursiveMapConverter.arrayToMap(value);
        }

        return RecursiveMapConverter.objectToMap(value);
    }

    private static mapToMap(value: any): any {
        const result = {};
        const keys = Object.keys(value);

        for (let i = 0; i < keys.length; i++) {
            result[keys[i]] = RecursiveMapConverter.valueToMap(value[keys[i]]);
        }
    }

    private static arrayToMap(value: any[]): any {
        const result: any[] = [];

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
    public static toNullableMap(value: any): any {
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
    public static toMap(value: any): any {
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
    public static toMapWithDefault(value: any, defaultValue: any): any {
        return RecursiveMapConverter.toNullableMap(value) || defaultValue;
    }

}