/** @module convert */

/**
 * Converts arbitrary values into map objects using extended conversion rules:
 * - Objects: property names as keys, property values as values
 * - Arrays: element indexes as keys, elements as values
 * 
 * ### Example ###
 * 
 *     let value1 = MapConverted.toNullableMap("ABC"); // Result: null
 *     let value2 = MapConverted.toNullableMap({ key: 123 }); // Result: { key: 123 }
 *     let value3 = MapConverted.toNullableMap([1,2,3]); // Result: { "0": 1, "1": 2, "2": 3 }
 */
export class MapConverter {

    /**
     * Converts value into map object or returns null when conversion is not possible.
     * 
     * @param value     the value to convert.
     * @returns         map object or null when conversion is not supported.
     */
    public static toNullableMap(value: any): any {
        if (value == null) {
            return null;
        } else if (Array.isArray(value)) {
            let map: any = {};
            for (let i = 0; i < value.length; i++) {
                map[i.toString()] = value[i];
            }
            return map;
        } else {
            return typeof value === "object" ? value : null;
        }
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
        return MapConverter.toNullableMap(value) || {};
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
        return MapConverter.toNullableMap(value) || defaultValue;
    }

}