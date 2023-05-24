/** @module data */
import { TypeCode } from '../convert/TypeCode';
import { ICloneable } from './ICloneable';
import { AnyValue } from './AnyValue';
import { AnyValueMap } from './AnyValueMap';
/**
 * Cross-language implementation of dynamic object array what can hold values of any type.
 * The stored values can be converted to different types using variety of accessor methods.
 *
 * ### Example ###
 *
 *     let value1 = new AnyValueArray([1, "123.456", "2018-01-01"]);
 *
 *     value1.getAsBoolean(0);   // Result: true
 *     value1.getAsInteger(1);   // Result: 123
 *     value1.getAsFloat(1);     // Result: 123.456
 *     value1.getAsDateTime(2);  // Result: new Date(2018,0,1)
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
export declare class AnyValueArray extends Array<any> implements ICloneable {
    /**
     * Creates a new instance of the array and assigns its value.
     *
     * @param value     (optional) values to initialize this array.
     */
    constructor(values?: any[]);
    /**
     * Gets an array element specified by its index.
     *
     * @param index     an index of the element to get.
     * @returns         the value of the array element.
     */
    get(index: number): any;
    /**
     * Puts a new value into array element specified by its index.
     *
     * @param index     an index of the element to put.
     * @param value     a new value for array element.
     */
    put(index: number, value: any): void;
    /**
     * Removes an array element specified by its index
     *
     * @param index     an index of the element to remove.
     */
    remove(index: number): void;
    /**
     * Appends new elements to this array.
     *
     * @param elements  a list of elements to be added.
     */
    append(elements: any[]): void;
    /**
     * Clears this array by removing all its elements.
    */
    clear(): void;
    /**
     * Gets the value stored in array element without any conversions.
     * When element index is not defined it returns the entire array value.
     *
     * @param index     (optional) an index of the element to get
     * @returns the element value or value of the array when index is not defined.
     */
    getAsObject(index?: number): any;
    /**
     * Sets a new value to array element specified by its index.
     * When the index is not defined, it resets the entire array value.
     * This method has double purpose because method overrides are not supported in JavaScript.
     *
     * @param index     (optional) an index of the element to set
     * @param value     a new element or array value.
     *
     * @see [[ArrayConverter.toArray]]
     */
    setAsObject(index: any, value?: any): void;
    /**
     * Converts array element into a string or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns string value of the element or null if conversion is not supported.
     *
     * @see [[StringConverter.toNullableString]]
     */
    getAsNullableString(index: number): string;
    /**
     * Converts array element into a string or returns "" if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns string value ot the element or "" if conversion is not supported.
     *
     * @see [[getAsStringWithDefault]]
     */
    getAsString(index: number): string;
    /**
     * Converts array element into a string or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns string value ot the element or default value if conversion is not supported.
     *
     * @see [[StringConverter.toStringWithDefault]]
     */
    getAsStringWithDefault(index: number, defaultValue: string): string;
    /**
     * Converts array element into a boolean or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns boolean value of the element or null if conversion is not supported.
     *
     * @see [[BooleanConverter.toNullableBoolean]]
     */
    getAsNullableBoolean(index: number): boolean;
    /**
     * Converts array element into a boolean or returns false if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns boolean value ot the element or false if conversion is not supported.
     *
     * @see [[getAsBooleanWithDefault]]
     */
    getAsBoolean(index: number): boolean;
    /**
     * Converts array element into a boolean or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns boolean value ot the element or default value if conversion is not supported.
     *
     * @see [[BooleanConverter.toBooleanWithDefault]]
     */
    getAsBooleanWithDefault(index: number, defaultValue: boolean): boolean;
    /**
     * Converts array element into an integer or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns integer value of the element or null if conversion is not supported.
     *
     * @see [[IntegerConverter.toNullableInteger]]
     */
    getAsNullableInteger(index: number): number;
    /**
     * Converts array element into an integer or returns 0 if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns integer value ot the element or 0 if conversion is not supported.
     *
     * @see [[getAsIntegerWithDefault]]
     */
    getAsInteger(index: number): number;
    /**
     * Converts array element into an integer or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns integer value ot the element or default value if conversion is not supported.
     *
     * @see [[IntegerConverter.toIntegerWithDefault]]
     */
    getAsIntegerWithDefault(index: number, defaultValue: number): number;
    /**
     * Converts array element into a long or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns long value of the element or null if conversion is not supported.
     *
     * @see [[LongConverter.toNullableLong]]
     */
    getAsNullableLong(index: number): number;
    /**
     * Converts array element into a long or returns 0 if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns long value ot the element or 0 if conversion is not supported.
     *
     * @see [[getAsLongWithDefault]]
     */
    getAsLong(index: number): number;
    /**
     * Converts array element into a long or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns long value ot the element or default value if conversion is not supported.
     *
     * @see [[LongConverter.toLongWithDefault]]
     */
    getAsLongWithDefault(index: number, defaultValue: number): number;
    /**
     * Converts array element into a float or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns float value of the element or null if conversion is not supported.
     *
     * @see [[FloatConverter.toNullableFloat]]
     */
    getAsNullableFloat(index: number): number;
    /**
     * Converts array element into a float or returns 0 if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns float value ot the element or 0 if conversion is not supported.
     *
     * @see [[getAsFloatWithDefault]]
     */
    getAsFloat(index: number): number;
    /**
     * Converts array element into a float or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns float value ot the element or default value if conversion is not supported.
     *
     * @see [[FloatConverter.toFloatWithDefault]]
     */
    getAsFloatWithDefault(index: number, defaultValue: number): number;
    /**
     * Converts array element into a double or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns double value of the element or null if conversion is not supported.
     *
     * @see [[DoubleConverter.toNullableDouble]]
     */
    getAsNullableDouble(index: number): number;
    /**
     * Converts array element into a double or returns 0 if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns double value ot the element or 0 if conversion is not supported.
     *
     * @see [[getAsDoubleWithDefault]]
     */
    getAsDouble(index: number): number;
    /**
     * Converts array element into a double or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns double value ot the element or default value if conversion is not supported.
     *
     * @see [[DoubleConverter.toDoubleWithDefault]]
     */
    getAsDoubleWithDefault(index: number, defaultValue: number): number;
    /**
     * Converts array element into a Date or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns Date value of the element or null if conversion is not supported.
     *
     * @see [[DateTimeConverter.toNullableDateTime]]
     */
    getAsNullableDateTime(index: number): Date;
    /**
     * Converts array element into a Date or returns the current date if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns Date value ot the element or the current date if conversion is not supported.
     *
     * @see [[getAsDateTimeWithDefault]]
     */
    getAsDateTime(index: number): Date;
    /**
     * Converts array element into a Date or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns Date value ot the element or default value if conversion is not supported.
     *
     * @see [[DateTimeConverter.toDateTimeWithDefault]]
     */
    getAsDateTimeWithDefault(index: number, defaultValue: Date): Date;
    /**
     * Converts array element into a value defined by specied typecode.
     * If conversion is not possible it returns null.
     *
     * @param type      the TypeCode that defined the type of the result
     * @param index     an index of element to get.
     * @returns element value defined by the typecode or null if conversion is not supported.
     *
     * @see [[TypeConverter.toNullableType]]
     */
    getAsNullableType<T>(type: TypeCode, index: number): T;
    /**
     * Converts array element into a value defined by specied typecode.
     * If conversion is not possible it returns default value for the specified type.
     *
     * @param type      the TypeCode that defined the type of the result
     * @param index     an index of element to get.
     * @returns element value defined by the typecode or default if conversion is not supported.
     *
     * @see [[getAsTypeWithDefault]]
     */
    getAsType<T>(type: TypeCode, index: number): T;
    /**
     * Converts array element into a value defined by specied typecode.
     * If conversion is not possible it returns default value.
     *
     * @param type          the TypeCode that defined the type of the result
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns element value defined by the typecode or default value if conversion is not supported.
     *
     * @see [[TypeConverter.toTypeWithDefault]]
     */
    getAsTypeWithDefault<T>(type: TypeCode, index: number, defaultValue: T): T;
    /**
     * Converts array element into an AnyValue or returns an empty AnyValue if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns AnyValue value of the element or empty AnyValue if conversion is not supported.
     *
     * @see [[AnyValue]]
     * @see [[AnyValue.constructor]]
     */
    getAsValue(index: number): AnyValue;
    /**
     * Converts array element into an AnyValueArray or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns AnyValueArray value of the element or null if conversion is not supported.
     *
     * @see [[fromValue]]
     */
    getAsNullableArray(index: number): AnyValueArray;
    /**
     * Converts array element into an AnyValueArray or returns empty AnyValueArray if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns AnyValueArray value of the element or empty AnyValueArray if conversion is not supported.
     *
     * @see [[fromValue]]
     */
    getAsArray(index: number): AnyValueArray;
    /**
     * Converts array element into an AnyValueArray or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns AnyValueArray value of the element or default value if conversion is not supported.
     *
     * @see [[getAsNullableArray]]
     */
    getAsArrayWithDefault(index: number, defaultValue: AnyValueArray): AnyValueArray;
    /**
     * Converts array element into an AnyValueMap or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns AnyValueMap value of the element or null if conversion is not supported.
     *
     * @see [[AnyValueMap]]
     * @see [[AnyValueMap.fromValue]]
     */
    getAsNullableMap(index: number): AnyValueMap;
    /**
     * Converts array element into an AnyValueMap or returns empty AnyValueMap if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns AnyValueMap value of the element or empty AnyValueMap if conversion is not supported.
     *
     * @see [[AnyValueMap]]
     * @see [[AnyValueMap.fromValue]]
     */
    getAsMap(index: number): AnyValueMap;
    /**
     * Converts array element into an AnyValueMap or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns AnyValueMap value of the element or default value if conversion is not supported.
     *
     * @see [[getAsNullableMap]]
     */
    getAsMapWithDefault(index: number, defaultValue: AnyValueMap): AnyValueMap;
    /**
     * Checks if this array contains a value.
     * The check uses direct comparison between elements and the specified value.
     *
     * @param value     a value to be checked
     * @returns         true if this array contains the value or false otherwise.
     */
    contains(value: any): boolean;
    /**
     * Checks if this array contains a value.
     * The check before comparison converts elements and the value to type specified by type code.
     *
     * @param typeCode  a type code that defines a type to convert values before comparison
     * @param value     a value to be checked
     * @returns         true if this array contains the value or false otherwise.
     *
     * @see [[TypeConverter.toType]]
     * @see [[TypeConverter.toNullableType]]
     */
    containsAsType<T>(typeCode: TypeCode, value: any): boolean;
    /**
     * Creates a binary clone of this object.
     *
     * @returns a clone of this object.
     */
    clone(): any;
    /**
     * Gets a string representation of the object.
     * The result is a comma-separated list of string representations of individual elements as
     * "value1,value2,value3"
     *
     * @returns a string representation of the object.
     *
     * @see [[StringConverter.toString]]
     */
    toString(): string;
    /**
     * Creates a new AnyValueArray from a list of values
     *
     * @param values    a list of values to initialize the created AnyValueArray
     * @returns         a newly created AnyValueArray.
     */
    static fromValues(...values: any[]): AnyValueArray;
    /**
     * Converts specified value into AnyValueArray.
     *
     * @param value     value to be converted
     * @returns         a newly created AnyValueArray.
     *
     * @see [[ArrayConverter.toNullableArray]]
     */
    static fromValue(value: any): AnyValueArray;
    /**
     * Splits specified string into elements using a separator and assigns
     * the elements to a newly created AnyValueArray.
     *
     * @param values            a string value to be split and assigned to AnyValueArray
     * @param separator         a separator to split the string
     * @param removeDuplicates  (optional) true to remove duplicated elements
     * @returns                 a newly created AnyValueArray.
     */
    static fromString(values: string, separator: string, removeDuplicates?: boolean): AnyValueArray;
}
