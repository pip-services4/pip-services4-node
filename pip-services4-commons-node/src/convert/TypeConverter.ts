/** @module convert */
import { TypeCode } from './TypeCode';
import { StringConverter } from './StringConverter';
import { BooleanConverter } from './BooleanConverter';
import { IntegerConverter } from './IntegerConverter';
import { LongConverter } from './LongConverter';
import { FloatConverter } from './FloatConverter';
import { DoubleConverter } from './DoubleConverter';
import { DateTimeConverter } from './DateTimeConverter';
import { ArrayConverter } from './ArrayConverter';
import { MapConverter } from './MapConverter';

/**
 * Converts arbitrary values into objects specific by TypeCodes.
 * For each TypeCode this class calls corresponding converter which applies
 * extended conversion rules to convert the values.
 * 
 * @see [[TypeCode]]
 * 
 * ### Example ###
 * 
 *     let value1 = TypeConverter.toType(TypeCode.Integer, "123.456"); // Result: 123
 *     let value2 = TypeConverter.toType(TypeCode.DateTime, 123); // Result: Date(123)
 *     let value3 = TypeConverter.toType(TypeCode.Boolean, "F"); // Result: false
 */
export class TypeConverter {

	/**
	 * Gets TypeCode for specific value.
	 * 
	 * @param value 	value whose TypeCode is to be resolved.
	 * @returns			the TypeCode that corresponds to the passed object's type.
	 */
	public static toTypeCode(value: any): TypeCode {
		if (value == null)
			return TypeCode.Unknown;

		if (Array.isArray(value))
			return TypeCode.Array;
		if (typeof value === "boolean")
			return TypeCode.Boolean;
		if (value instanceof Date)
			return TypeCode.DateTime;
		if (Number.isInteger(value))
			return TypeCode.Long;
		if (typeof value === "number")
			return TypeCode.Double;
		if (typeof value === "function")
			return TypeCode.Object;
		if (typeof value === "object")
			return TypeCode.Map;

		if (typeof value === "string") {
			// if (value == "undefined")
			//     return TypeCode.Unknown;
			// if (value == "object")
			//     return TypeCode.Map;
			// if (value == "boolean")
			//     return TypeCode.Boolean;
			// if (value == "number")
			//     return TypeCode.Double;
			// if (value == "string")
			//     return TypeCode.String;
			// if (value == "function")
			//     return TypeCode.Object;

			return TypeCode.String;
		}

		return TypeCode.Object;
	}

	/**
	 * Converts value into an object type specified by Type Code or returns null when conversion is not possible.
	 * 
	 * @param type 		the TypeCode for the data type into which 'value' is to be converted.
	 * @param value 	the value to convert.
	 * @returns			object value of type corresponding to TypeCode, or null when conversion is not supported.
	 * 
	 * @see [[toTypeCode]]
	 */
	public static toNullableType<T>(type: TypeCode, value: any): T {
		if (value == null) return null;

		// Convert to known types
		if (type == TypeCode.String)
			value = StringConverter.toNullableString(value);
		else if (type == TypeCode.Boolean)
			value = BooleanConverter.toNullableBoolean(value);
		else if (type == TypeCode.Integer)
			value = IntegerConverter.toNullableInteger(value);
		else if (type == TypeCode.Long)
			value = LongConverter.toNullableLong(value);
		else if (type == TypeCode.Float)
			value = FloatConverter.toNullableFloat(value);
		else if (type == TypeCode.Double)
			value = DoubleConverter.toNullableDouble(value);
		else if (type == TypeCode.DateTime)
			value = DateTimeConverter.toNullableDateTime(value);
		else if (type == TypeCode.Array)
			value = ArrayConverter.toNullableArray(value);
		else if (type == TypeCode.Map)
			value = MapConverter.toNullableMap(value);

		return <T>value;
	}

	/**
	 * Converts value into an object type specified by Type Code or returns type default when conversion is not possible.
	 * 
	 * @param type 		the TypeCode for the data type into which 'value' is to be converted.
	 * @param value 	the value to convert.
	 * @returns			object value of type corresponding to TypeCode, or type default when conversion is not supported.
	 * 
	 * @see [[toNullableType]]
	 * @see [[toTypeCode]]
	 */
	public static toType<T>(type: TypeCode, value: any): T {
		// Convert to the specified type
		let result: T = TypeConverter.toNullableType<T>(type, value);
		if (result != null) return result;

		// Define and return default value based on type
		if (type == TypeCode.Integer)
			value = 0;
		else if (type == TypeCode.Long)
			value = 0;
		else if (type == TypeCode.Float)
			value = 0;
		else if (type == TypeCode.Double)
			value = 0;
		else if (type == TypeCode.Boolean) // cases from here down were added by Mark Makarychev.
			value = false;
		else if (type == TypeCode.String)
			value = "";
		else if (type == TypeCode.DateTime)
			value = new Date();
		else if (type == TypeCode.Map)
			value = {};
		else if (type == TypeCode.Array)
			value = [];

		return <T>value;
	}

	/**
	 * Converts value into an object type specified by Type Code or returns default value when conversion is not possible.
	 * 
	 * @param type 			the TypeCode for the data type into which 'value' is to be converted.
	 * @param value 		the value to convert.
	 * @param defaultValue	the default value to return if conversion is not possible (returns null).
	 * @returns			object value of type corresponding to TypeCode, or default value when conversion is not supported.
	 * 
	 * @see [[toNullableType]]
	 * @see [[toTypeCode]]
	 */
	public static toTypeWithDefault<T>(type: TypeCode, value: any, defaultValue: T): T {
		let result: T = TypeConverter.toNullableType<T>(type, value);
		return result != null ? result : defaultValue;
	}

	/**
	 * Converts a TypeCode into its string name.
	 * 
	 * @param type 	the TypeCode to convert into a string.
	 * @returns		the name of the TypeCode passed as a string value.
	 */
	public static toString(type: TypeCode): string {
		switch (type) {
			case TypeCode.Unknown:
				return "unknown";
			case TypeCode.String:
				return "string";
			case TypeCode.Boolean:
				return "boolean";
			case TypeCode.Integer:
				return "integer"
			case TypeCode.Long:
				return "long";
			case TypeCode.Float:
				return "float";
			case TypeCode.Double:
				return "double";
			case TypeCode.DateTime:
				return "datetime";
			case TypeCode.Duration:
				return "duration";
			case TypeCode.Object:
				return "object";
			case TypeCode.Enum:
				return "enum";
			case TypeCode.Array:
				return "array";
			case TypeCode.Map:
				return "map";
			default:
				return "unknown";
		}
	}

}
