/** @module convert */
import { TypeCode } from './TypeCode';
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
export declare class TypeConverter {
    /**
     * Gets TypeCode for specific value.
     *
     * @param value 	value whose TypeCode is to be resolved.
     * @returns			the TypeCode that corresponds to the passed object's type.
     */
    static toTypeCode(value: any): TypeCode;
    /**
     * Converts value into an object type specified by Type Code or returns null when conversion is not possible.
     *
     * @param type 		the TypeCode for the data type into which 'value' is to be converted.
     * @param value 	the value to convert.
     * @returns			object value of type corresponding to TypeCode, or null when conversion is not supported.
     *
     * @see [[toTypeCode]]
     */
    static toNullableType<T>(type: TypeCode, value: any): T;
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
    static toType<T>(type: TypeCode, value: any): T;
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
    static toTypeWithDefault<T>(type: TypeCode, value: any, defaultValue: T): T;
    /**
     * Converts a TypeCode into its string name.
     *
     * @param type 	the TypeCode to convert into a string.
     * @returns		the name of the TypeCode passed as a string value.
     */
    static toString(type: TypeCode): string;
}
