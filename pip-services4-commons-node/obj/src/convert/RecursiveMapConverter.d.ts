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
export declare class RecursiveMapConverter {
    private static objectToMap;
    private static valueToMap;
    private static mapToMap;
    private static arrayToMap;
    /**
     * Converts value into map object or returns null when conversion is not possible.
     *
     * @param value     the value to convert.
     * @returns         map object or null when conversion is not supported.
     */
    static toNullableMap(value: any): any;
    /**
     * Converts value into map object or returns empty map when conversion is not possible
     *
     * @param value     the value to convert.
     * @returns         map object or empty map when conversion is not supported.
     *
     * @see [[toNullableMap]]
     */
    static toMap(value: any): any;
    /**
     * Converts value into map object or returns default when conversion is not possible
     *
     * @param value         the value to convert.
     * @param defaultValue  the default value.
     * @returns             map object or emptu map when conversion is not supported.
     *
     * @see [[toNullableMap]]
     */
    static toMapWithDefault(value: any, defaultValue: any): any;
}
