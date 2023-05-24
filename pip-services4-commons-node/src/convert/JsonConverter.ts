/** @module convert */
import { TypeCode } from './TypeCode';
import { TypeConverter } from './TypeConverter';
import { MapConverter } from './MapConverter';

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
export class JsonConverter {

	/**
	 * Converts JSON string into a value of type specified by a TypeCode.
	 * 
	 * @param type 		the TypeCode for the data type into which 'value' is to be converted.
	 * @param value 	the JSON string to convert.
	 * @returns			converted object value or null when value is null.
	 */
	public static fromJson<T>(type: TypeCode, value: string): T {
		if (value == null) return null;
		let temp = JSON.parse(value)
		return TypeConverter.toType<T>(type, temp);
	}

	/**
	 * Converts value into JSON string.
	 * 
	 * @param value 	the value to convert.
	 * @returns			JSON string or null when value is null.
	 */
	public static toJson(value: any): string {
		if (value == null) return null;
		return JSON.stringify(value);
	}

	/**
	 * Converts JSON string into map object or returns null when conversion is not possible.
	 * 
	 * @param value 	the JSON string to convert.
	 * @returns			Map object value or null when conversion is not supported.
	 * 
	 * @see [[MapConverter.toNullableMap]]
	 */
	public static toNullableMap(value: string): any {
		if (value == null) return null;

		try {
			let map = JSON.parse(value)
			return MapConverter.toNullableMap(map);
		} catch (Exception) {
			return null;
		}
	}

	/**
	 * Converts JSON string into map object or returns empty map when conversion is not possible.
	 * 
	 * @param value 	the JSON string to convert.
	 * @returns 		Map object value or empty object when conversion is not supported.
	 * 
	 * @see [[toNullableMap]]
	 */
	public static toMap(value: string): any {
		let result = JsonConverter.toNullableMap(value);
		return result != null ? result : {};
	}

	/**
     * Converts JSON string into map object or returns default value when conversion is not possible.
     * 
     * @param value         the JSON string to convert.
     * @param defaultValue  the default value.
	 * @returns				Map object value or default when conversion is not supported.
     * 
     * @see [[toNullableMap]]
     */
	public static toMapWithDefault(value: string, defaultValue: any): any {
		let result = JsonConverter.toNullableMap(value);
		return result != null ? result : defaultValue;
	}

}
