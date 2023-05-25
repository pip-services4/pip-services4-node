/** @module data */
import { TypeCode } from '../convert/TypeCode';
import { ICloneable } from './ICloneable';
import { AnyValue } from './AnyValue';
import { AnyValueArray } from './AnyValueArray';
/**
 * Cross-language implementation of dynamic object map (dictionary) what can hold values of any type.
 * The stored values can be converted to different types using variety of accessor methods.
 *
 * ### Example ###
 *
 *     let value1 = new AnyValueMap({ key1: 1, key2: "123.456", key3: "2018-01-01" });
 *
 *     value1.getAsBoolean("key1");   // Result: true
 *     value1.getAsInteger("key2");   // Result: 123
 *     value1.getAsFloat("key2");     // Result: 123.456
 *     value1.getAsDateTime("key3");  // Result: new Date(2018,0,1)
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
export declare class AnyValueMap implements ICloneable {
    /**
     * Creates a new instance of the map and assigns its value.
     *
     * @param value     (optional) values to initialize this map.
     */
    constructor(values?: any);
    /**
     * Gets a map element specified by its key.
     *
     * @param key     a key of the element to get.
     * @returns       the value of the map element.
     */
    get(key: string): any;
    /**
     * Gets keys of all elements stored in this map.
     *
     * @returns a list with all map keys.
     */
    getKeys(): string[];
    /**
     * Puts a new value into map element specified by its key.
     *
     * @param key       a key of the element to put.
     * @param value     a new value for map element.
     */
    put(key: string, value: any): any;
    /**
     * Removes a map element specified by its key
     *
     * @param key     a key of the element to remove.
     */
    remove(key: string): void;
    /**
     * Appends new elements to this map.
     *
     * @param map  a map with elements to be added.
     */
    append(map: any): void;
    /**
     * Clears this map by removing all its elements.
     */
    clear(): any;
    /**
     * Gets a number of elements stored in this map.
     *
     * @returns the number of elements in this map.
     */
    length(): number;
    /**
     * Gets the value stored in map element without any conversions.
     * When element key is not defined it returns the entire map value.
     *
     * @param key       (optional) a key of the element to get
     * @returns the element value or value of the map when index is not defined.
     */
    getAsObject(key?: string): any;
    /**
     * Sets a new value to map element specified by its index.
     * When the index is not defined, it resets the entire map value.
     * This method has double purpose because method overrides are not supported in JavaScript.
     *
     * @param key       (optional) a key of the element to set
     * @param value     a new element or map value.
     *
     * @see [[MapConverter.toMap]]
     */
    setAsObject(key: any, value?: any): void;
    /**
     * Converts map element into a string or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns string value of the element or null if conversion is not supported.
     *
     * @see [[StringConverter.toNullableString]]
     */
    getAsNullableString(key: string): string;
    /**
     * Converts map element into a string or returns "" if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns string value of the element or "" if conversion is not supported.
     *
     * @see [[getAsStringWithDefault]]
     */
    getAsString(key: string): string;
    /**
     * Converts map element into a string or returns default value if conversion is not possible.
     *
     * @param key           a key of element to get.
     * @param defaultValue  the default value
     * @returns string value of the element or default value if conversion is not supported.
     *
     * @see [[StringConverter.toStringWithDefault]]
     */
    getAsStringWithDefault(key: string, defaultValue: string): string;
    /**
     * Converts map element into a boolean or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns boolean value of the element or null if conversion is not supported.
     *
     * @see [[BooleanConverter.toNullableBoolean]]
     */
    getAsNullableBoolean(key: string): boolean;
    /**
     * Converts map element into a boolean or returns false if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns boolean value of the element or false if conversion is not supported.
     *
     * @see [[getAsBooleanWithDefault]]
     */
    getAsBoolean(key: string): boolean;
    /**
     * Converts map element into a boolean or returns default value if conversion is not possible.
     *
     * @param key           a key of element to get.
     * @param defaultValue  the default value
     * @returns boolean value of the element or default value if conversion is not supported.
     *
     * @see [[BooleanConverter.toBooleanWithDefault]]
     */
    getAsBooleanWithDefault(key: string, defaultValue: boolean): boolean;
    /**
     * Converts map element into an integer or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns integer value of the element or null if conversion is not supported.
     *
     * @see [[IntegerConverter.toNullableInteger]]
     */
    getAsNullableInteger(key: string): number;
    /**
     * Converts map element into an integer or returns 0 if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns integer value of the element or 0 if conversion is not supported.
     *
     * @see [[getAsIntegerWithDefault]]
     */
    getAsInteger(key: string): number;
    /**
     * Converts map element into an integer or returns default value if conversion is not possible.
     *
     * @param key           a key of element to get.
     * @param defaultValue  the default value
     * @returns integer value of the element or default value if conversion is not supported.
     *
     * @see [[IntegerConverter.toIntegerWithDefault]]
     */
    getAsIntegerWithDefault(key: string, defaultValue: number): number;
    /**
     * Converts map element into a long or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns long value of the element or null if conversion is not supported.
     *
     * @see [[LongConverter.toNullableLong]]
     */
    getAsNullableLong(key: string): number;
    /**
     * Converts map element into a long or returns 0 if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns long value of the element or 0 if conversion is not supported.
     *
     * @see [[getAsLongWithDefault]]
     */
    getAsLong(key: string): number;
    /**
     * Converts map element into a long or returns default value if conversion is not possible.
     *
     * @param key           a key of element to get.
     * @param defaultValue  the default value
     * @returns long value of the element or default value if conversion is not supported.
     *
     * @see [[LongConverter.toLongWithDefault]]
     */
    getAsLongWithDefault(key: string, defaultValue: number): number;
    /**
     * Converts map element into a float or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns float value of the element or null if conversion is not supported.
     *
     * @see [[FloatConverter.toNullableFloat]]
     */
    getAsNullableFloat(key: string): number;
    /**
     * Converts map element into a float or returns 0 if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns float value of the element or 0 if conversion is not supported.
     *
     * @see [[getAsFloatWithDefault]]
     */
    getAsFloat(key: string): number;
    /**
     * Converts map element into a flot or returns default value if conversion is not possible.
     *
     * @param key           a key of element to get.
     * @param defaultValue  the default value
     * @returns flot value of the element or default value if conversion is not supported.
     *
     * @see [[FloatConverter.toFloatWithDefault]]
     */
    getAsFloatWithDefault(key: string, defaultValue: number): number;
    /**
     * Converts map element into a double or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns double value of the element or null if conversion is not supported.
     *
     * @see [[DoubleConverter.toNullableDouble]]
     */
    getAsNullableDouble(key: string): number;
    /**
     * Converts map element into a double or returns 0 if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns double value of the element or 0 if conversion is not supported.
     *
     * @see [[getAsDoubleWithDefault]]
     */
    getAsDouble(key: string): number;
    /**
     * Converts map element into a double or returns default value if conversion is not possible.
     *
     * @param key           a key of element to get.
     * @param defaultValue  the default value
     * @returns double value of the element or default value if conversion is not supported.
     *
     * @see [[DoubleConverter.toDoubleWithDefault]]
     */
    getAsDoubleWithDefault(key: string, defaultValue: number): number;
    /**
     * Converts map element into a Date or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns Date value of the element or null if conversion is not supported.
     *
     * @see [[DateTimeConverter.toNullableDateTime]]
     */
    getAsNullableDateTime(key: string): Date;
    /**
     * Converts map element into a Date or returns the current date if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns Date value of the element or the current date if conversion is not supported.
     *
     * @see [[getAsDateTimeWithDefault]]
     */
    getAsDateTime(key: string): Date;
    /**
     * Converts map element into a Date or returns default value if conversion is not possible.
     *
     * @param key           a key of element to get.
     * @param defaultValue  the default value
     * @returns Date value of the element or default value if conversion is not supported.
     *
     * @see [[DateTimeConverter.toDateTimeWithDefault]]
     */
    getAsDateTimeWithDefault(key: string, defaultValue: Date): Date;
    /**
     * Converts map element into a value defined by specied typecode.
     * If conversion is not possible it returns null.
     *
     * @param type      the TypeCode that defined the type of the result
     * @param key       a key of element to get.
     * @returns element value defined by the typecode or null if conversion is not supported.
     *
     * @see [[TypeConverter.toNullableType]]
     */
    getAsNullableType<T>(type: TypeCode, key: string): T;
    /**
     * Converts map element into a value defined by specied typecode.
     * If conversion is not possible it returns default value for the specified type.
     *
     * @param type      the TypeCode that defined the type of the result
     * @param key       a key of element to get.
     * @returns element value defined by the typecode or default if conversion is not supported.
     *
     * @see [[getAsTypeWithDefault]]
     */
    getAsType<T>(type: TypeCode, key: string): T;
    /**
     * Converts map element into a value defined by specied typecode.
     * If conversion is not possible it returns default value.
     *
     * @param type          the TypeCode that defined the type of the result
     * @param key       a key of element to get.
     * @param defaultValue  the default value
     * @returns element value defined by the typecode or default value if conversion is not supported.
     *
     * @see [[TypeConverter.toTypeWithDefault]]
     */
    getAsTypeWithDefault<T>(type: TypeCode, key: string, defaultValue: T): T;
    /**
     * Converts map element into an AnyValue or returns an empty AnyValue if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns AnyValue value of the element or empty AnyValue if conversion is not supported.
     *
     * @see [[AnyValue]]
     * @see [[AnyValue.constructor]]
     */
    getAsValue(key: string): AnyValue;
    /**
     * Converts map element into an AnyValueArray or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns AnyValueArray value of the element or null if conversion is not supported.
     *
     * @see [[AnyValueArray]]
     * @see [[AnyValueArray.fromValue]]
     */
    getAsNullableArray(key: string): AnyValueArray;
    /**
     * Converts map element into an AnyValueArray or returns empty AnyValueArray if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns AnyValueArray value of the element or empty AnyValueArray if conversion is not supported.
     *
     * @see [[AnyValueArray]]
     * @see [[AnyValueArray.fromValue]]
     */
    getAsArray(key: string): AnyValueArray;
    /**
     * Converts map element into an AnyValueArray or returns default value if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @param defaultValue  the default value
     * @returns AnyValueArray value of the element or default value if conversion is not supported.
     *
     * @see [[AnyValueArray]]
     * @see [[getAsNullableArray]]
     */
    getAsArrayWithDefault(key: string, defaultValue: AnyValueArray): AnyValueArray;
    /**
     * Converts map element into an AnyValueMap or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns AnyValueMap value of the element or null if conversion is not supported.
     *
     * @see [[fromValue]]
     */
    getAsNullableMap(key: string): AnyValueMap;
    /**
     * Converts map element into an AnyValueMap or returns empty AnyValueMap if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns AnyValueMap value of the element or empty AnyValueMap if conversion is not supported.
     *
     * @see [[fromValue]]
     */
    getAsMap(key: string): AnyValueMap;
    /**
     * Converts map element into an AnyValueMap or returns default value if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @param defaultValue  the default value
     * @returns AnyValueMap value of the element or default value if conversion is not supported.
     *
     * @see [[getAsNullableMap]]
     */
    getAsMapWithDefault(key: string, defaultValue: AnyValueMap): AnyValueMap;
    /**
     * Gets a string representation of the object.
     * The result is a semicolon-separated list of key-value pairs as
     * "key1=value1;key2=value2;key=value3"
     *
     * @returns a string representation of the object.
     */
    toString(): string;
    /**
     * Creates a binary clone of this object.
     *
     * @returns a clone of this object.
     */
    clone(): any;
    /**
     * Converts specified value into AnyValueMap.
     *
     * @param value     value to be converted
     * @returns         a newly created AnyValueMap.
     *
     * @see [[setAsObject]]
     */
    static fromValue(value: any): AnyValueMap;
    /**
     * Creates a new AnyValueMap from a list of key-value pairs called tuples.
     *
     * @param tuples    a list of values where odd elements are keys and the following even elements are values
     * @returns         a newly created AnyValueArray.
     *
     * @see [[fromTuplesArray]]
     */
    static fromTuples(...tuples: any[]): AnyValueMap;
    /**
     * Creates a new AnyValueMap from a list of key-value pairs called tuples.
     * The method is similar to [[fromTuples]] but tuples are passed as array instead of parameters.
     *
     * @param tuples    a list of values where odd elements are keys and the following even elements are values
     * @returns         a newly created AnyValueArray.
     */
    static fromTuplesArray(tuples: any[]): AnyValueMap;
    /**
     * Creates a new AnyValueMap by merging two or more maps.
     * Maps defined later in the list override values from previously defined maps.
     *
     * @param maps  an array of maps to be merged
     * @returns     a newly created AnyValueMap.
     */
    static fromMaps(...maps: any[]): AnyValueMap;
}
