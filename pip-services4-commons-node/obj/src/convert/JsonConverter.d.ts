/** @module convert */
import { TypeCode } from './TypeCode';
/**
 * Converts arbitrary values from and to JSON (JavaScript Object Notation) strings.
 *
 * ### Example ###
 *
 *     let value1 = JsonConverter.fromJson("{\"key\":123}"); // Result: { key: 123 }
 *     let value2 = JsonConverter.toMap({ key: 123}); // Result: "{\"key\":123}"
 *
 * @see [[TypeCode]]
 */
export declare class JsonConverter {
    /**
     * Converts JSON string into a value of type specified by a TypeCode.
     *
     * @param type 		the TypeCode for the data type into which 'value' is to be converted.
     * @param value 	the JSON string to convert.
     * @returns			converted object value or null when value is null.
     */
    static fromJson<T>(type: TypeCode, value: string): T;
    /**
     * Converts value into JSON string.
     *
     * @param value 	the value to convert.
     * @returns			JSON string or null when value is null.
     */
    static toJson(value: any): string;
    /**
     * Converts JSON string into map object or returns null when conversion is not possible.
     *
     * @param value 	the JSON string to convert.
     * @returns			Map object value or null when conversion is not supported.
     *
     * @see [[MapConverter.toNullableMap]]
     */
    static toNullableMap(value: string): any;
    /**
     * Converts JSON string into map object or returns empty map when conversion is not possible.
     *
     * @param value 	the JSON string to convert.
     * @returns 		Map object value or empty object when conversion is not supported.
     *
     * @see [[toNullableMap]]
     */
    static toMap(value: string): any;
    /**
     * Converts JSON string into map object or returns default value when conversion is not possible.
     *
     * @param value         the JSON string to convert.
     * @param defaultValue  the default value.
     * @returns				Map object value or default when conversion is not supported.
     *
     * @see [[toNullableMap]]
     */
    static toMapWithDefault(value: string, defaultValue: any): any;
}
