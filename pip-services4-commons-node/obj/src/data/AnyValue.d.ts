/** @module data */
import { TypeCode } from '../convert/TypeCode';
import { ICloneable } from './ICloneable';
import { AnyValueArray } from './AnyValueArray';
import { AnyValueMap } from './AnyValueMap';
/**
 * Cross-language implementation of dynamic object what can hold value of any type.
 * The stored value can be converted to different types using variety of accessor methods.
 *
 * ### Example ###
 *
 *     let value1 = new AnyValue("123.456");
 *
 *     value1.getAsInteger();   // Result: 123
 *     value1.getAsString();    // Result: "123.456"
 *     value1.getAsFloat();     // Result: 123.456
 *
 * @see [[StringConverter]]
 * @see [[TypeConverter]]
 * @see [[BooleanConverter]]
 * @see [[IntegerConverter]]
 * @see [[LongConverter]]
 * @see [[DoubleConverter]]
 * @see [[FloatConverter]]
 * @see [[DateTimeConverter]]
 * @see [[ICloneable]]
 */
export declare class AnyValue implements ICloneable {
    /** The value stored by this object. */
    value: any;
    /**
     * Creates a new instance of the object and assigns its value.
     *
     * @param value     (optional) value to initialize this object.
     */
    constructor(value?: any);
    /**
     * Gets type code for the value stored in this object.
     *
     * @returns type code of the object value.
     *
     * @see [[TypeConverter.toTypeCode]]
     */
    getTypeCode(): TypeCode;
    /**
     * Gets the value stored in this object without any conversions
     *
     * @returns the object value.
     */
    getAsObject(): any;
    /**
     * Sets a new value for this object
     *
     * @param value     the new object value.
     */
    setAsObject(value: any): void;
    /**
     * Converts object value into a string or returns null if conversion is not possible.
     *
     * @returns string value or null if conversion is not supported.
     *
     * @see [[StringConverter.toNullableString]]
     */
    getAsNullableString(): string;
    /**
     * Converts object value into a string or returns "" if conversion is not possible.
     *
     * @returns string value or "" if conversion is not supported.
     *
     * @see [[getAsStringWithDefault]]
     */
    getAsString(): string;
    /**
     * Converts object value into a string or returns default value if conversion is not possible.
     *
     * @param defaultValue      the default value.
     * @returns string value or default if conversion is not supported.
     *
     * @see [[StringConverter.toStringWithDefault]]
     */
    getAsStringWithDefault(defaultValue: string): string;
    /**
     * Converts object value into a boolean or returns null if conversion is not possible.
     *
     * @returns boolean value or null if conversion is not supported.
     *
     * @see [[BooleanConverter.toNullableBoolean]]
     */
    getAsNullableBoolean(): boolean;
    /**
     * Converts object value into a boolean or returns false if conversion is not possible.
     *
     * @returns string value or false if conversion is not supported.
     *
     * @see [[getAsBooleanWithDefault]]
     */
    getAsBoolean(): boolean;
    /**
     * Converts object value into a boolean or returns default value if conversion is not possible.
     *
     * @param defaultValue      the default value.
     * @returns boolean value or default if conversion is not supported.
     *
     * @see [[BooleanConverter.toBooleanWithDefault]]
     */
    getAsBooleanWithDefault(defaultValue: boolean): boolean;
    /**
     * Converts object value into an integer or returns null if conversion is not possible.
     *
     * @returns integer value or null if conversion is not supported.
     *
     * @see [[IntegerConverter.toNullableInteger]]
     */
    getAsNullableInteger(): number;
    /**
     * Converts object value into an integer or returns 0 if conversion is not possible.
     *
     * @returns integer value or 0 if conversion is not supported.
     *
     * @see [[getAsIntegerWithDefault]]
     */
    getAsInteger(): number;
    /**
     * Converts object value into a integer or returns default value if conversion is not possible.
     *
     * @param defaultValue      the default value.
     * @returns integer value or default if conversion is not supported.
     *
     * @see [[IntegerConverter.toIntegerWithDefault]]
     */
    getAsIntegerWithDefault(defaultValue: number): number;
    /**
     * Converts object value into a long or returns null if conversion is not possible.
     *
     * @returns long value or null if conversion is not supported.
     *
     * @see [[LongConverter.toNullableLong]]
     */
    getAsNullableLong(): number;
    /**
     * Converts object value into a long or returns 0 if conversion is not possible.
     *
     * @returns string value or 0 if conversion is not supported.
     *
     * @see [[getAsLongWithDefault]]
     */
    getAsLong(): number;
    /**
     * Converts object value into a long or returns default value if conversion is not possible.
     *
     * @param defaultValue      the default value.
     * @returns long value or default if conversion is not supported.
     *
     * @see [[LongConverter.toLongWithDefault]]
     */
    getAsLongWithDefault(defaultValue: number): number;
    /**
     * Converts object value into a float or returns null if conversion is not possible.
     *
     * @returns float value or null if conversion is not supported.
     *
     * @see [[FloatConverter.toNullableFloat]]
     */
    getAsNullableFloat(): number;
    /**
     * Converts object value into a float or returns 0 if conversion is not possible.
     *
     * @returns float value or 0 if conversion is not supported.
     *
     * @see [[getAsFloatWithDefault]]
     */
    getAsFloat(): number;
    /**
     * Converts object value into a float or returns default value if conversion is not possible.
     *
     * @param defaultValue      the default value.
     * @returns float value or default if conversion is not supported.
     *
     * @see [[FloatConverter.toFloatWithDefault]]
     */
    getAsFloatWithDefault(defaultValue: number): number;
    /**
     * Converts object value into a double or returns null if conversion is not possible.
     *
     * @returns double value or null if conversion is not supported.
     *
     * @see [[DoubleConverter.toNullableDouble]]
     */
    getAsNullableDouble(): number;
    /**
     * Converts object value into a double or returns 0 if conversion is not possible.
     *
     * @returns double value or 0 if conversion is not supported.
     *
     * @see [[getAsDoubleWithDefault]]
     */
    getAsDouble(): number;
    /**
     * Converts object value into a double or returns default value if conversion is not possible.
     *
     * @param defaultValue      the default value.
     * @returns double value or default if conversion is not supported.
     *
     * @see [[DoubleConverter.toDoubleWithDefault]]
     */
    getAsDoubleWithDefault(defaultValue: number): number;
    /**
     * Converts object value into a Date or returns null if conversion is not possible.
     *
     * @returns Date value or null if conversion is not supported.
     *
     * @see [[DateTimeConverter.toNullableDateTime]]
     */
    getAsNullableDateTime(): Date;
    /**
     * Converts object value into a Date or returns current date if conversion is not possible.
     *
     * @returns Date value or current date if conversion is not supported.
     *
     * @see [[getAsDateTimeWithDefault]]
     */
    getAsDateTime(): Date;
    /**
     * Converts object value into a Date or returns default value if conversion is not possible.
     *
     * @param defaultValue      the default value.
     * @returns Date value or default if conversion is not supported.
     *
     * @see [[DateTimeConverter.toDateTimeWithDefault]]
     */
    getAsDateTimeWithDefault(defaultValue: Date): Date;
    /**
     * Converts object value into a value defined by specied typecode.
     * If conversion is not possible it returns null.
     *
     * @param type      the TypeCode that defined the type of the result
     * @returns value defined by the typecode or null if conversion is not supported.
     *
     * @see [[TypeConverter.toNullableType]]
     */
    getAsNullableType<T>(type: TypeCode): T;
    /**
     * Converts object value into a value defined by specied typecode.
     * If conversion is not possible it returns default value for the specified type.
     *
     * @param typeCode    the TypeCode that defined the type of the result
     * @returns value defined by the typecode or type default value if conversion is not supported.
     *
     * @see [[getAsTypeWithDefault]]
     */
    getAsType<T>(typeCode: TypeCode): T;
    /**
     * Converts object value into a value defined by specied typecode.
     * If conversion is not possible it returns default value.
     *
     * @param typeCode      the TypeCode that defined the type of the result
     * @param defaultValue  the default value
     * @returns value defined by the typecode or type default value if conversion is not supported.
     *
     * @see [[TypeConverter.toTypeWithDefault]]
     */
    getAsTypeWithDefault<T>(typeCode: TypeCode, defaultValue: T): T;
    /**
     * Converts object value into an AnyArray or returns empty AnyArray if conversion is not possible.
     *
     * @returns AnyArray value or empty AnyArray if conversion is not supported.
     *
     * @see [[AnyValueArray.fromValue]]
     */
    getAsArray(): AnyValueArray;
    /**
     * Converts object value into AnyMap or returns empty AnyMap if conversion is not possible.
     *
     * @returns AnyMap value or empty AnyMap if conversion is not supported.
     *
     * @see [[AnyValueMap.fromValue]]
     */
    getAsMap(): AnyValueMap;
    /**
     * Compares this object value to specified specified value.
     * When direct comparison gives negative results it tries
     * to compare values as strings.
     *
     * @param obj   the value to be compared with.
     * @returns     true when objects are equal and false otherwise.
     */
    equals(obj: any): boolean;
    /**
     * Compares this object value to specified specified value.
     * When direct comparison gives negative results it converts
     * values to type specified by type code and compare them again.
     *
     * @param obj   the value to be compared with.
     * @returns     true when objects are equal and false otherwise.
     *
     * @see [[TypeConverter.toType]]
     */
    equalsAsType<T>(type: TypeCode, obj: any): boolean;
    /**
     * Creates a binary clone of this object.
     *
     * @returns a clone of this object.
     */
    clone(): any;
    /**
     * Gets a string representation of the object.
     *
     * @returns a string representation of the object.
     *
     * @see [[StringConverter.toString]]
     */
    toString(): any;
    /**
     * Gets an object hash code which can be used to optimize storing and searching.
     *
     * @returns an object hash code.
     */
    hashCode(): number;
}
