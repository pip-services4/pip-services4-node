/** @module data */
import { TypeCode } from '../convert/TypeCode';
import { TypeConverter } from '../convert/TypeConverter';
import { StringConverter } from '../convert/StringConverter';
import { BooleanConverter } from '../convert/BooleanConverter';
import { IntegerConverter } from '../convert/IntegerConverter';
import { LongConverter } from '../convert/LongConverter';
import { FloatConverter } from '../convert/FloatConverter';
import { DoubleConverter } from '../convert/DoubleConverter';
import { DateTimeConverter } from '../convert/DateTimeConverter';
import { MapConverter } from '../convert/MapConverter';
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
export class AnyValueMap implements ICloneable {

    /**
     * Creates a new instance of the map and assigns its value.
     * 
     * @param value     (optional) values to initialize this map.
     */
    public constructor(values: any = null) { 
        this.append(values);
    }
    
    /**
     * Gets a map element specified by its key.
     * 
     * @param key     a key of the element to get.
     * @returns       the value of the map element.
     */
    public get(key: string): any {
        return this[key] || null;
    }

    /** 
     * Gets keys of all elements stored in this map.
     * 
     * @returns a list with all map keys. 
     */
	public getKeys(): string[] {
        const keys: string[] = [];
		
		for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                keys.push(key);
            }
        }

        return keys;
    }            
    
    /**
     * Puts a new value into map element specified by its key.
     * 
     * @param key       a key of the element to put.
     * @param value     a new value for map element.
     */
	public put(key: string, value: any): any {
        this[key] = value;
    }

    /**
     * Removes a map element specified by its key
     * 
     * @param key     a key of the element to remove.
     */
    public remove(key: string): void {
        delete this[key];
    }

    /**
     * Appends new elements to this map.
     * 
     * @param map  a map with elements to be added.
     */
    public append(map: any): void {
        if (map == null) return;

		for (const key in map) {
            const value = map[key];
            if (Object.prototype.hasOwnProperty.call(map, key)) {
                this[key] = value;
            }
		}
    }

    /**
     * Clears this map by removing all its elements.
     */
   public clear(): any {
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                delete this[key];
            }
        }
    }

    /** 
     * Gets a number of elements stored in this map.
     *  
     * @returns the number of elements in this map.
     */
    public length(): number {
        let count = 0;
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key) && typeof this[key] !== "function") {
                count ++;
            }
        }        
        return count;
    }

    /**
     * Gets the value stored in map element without any conversions.
     * When element key is not defined it returns the entire map value.
     * 
     * @param key       (optional) a key of the element to get
     * @returns the element value or value of the map when index is not defined. 
     */     
    public getAsObject(key: string = undefined): any {
        if (key === undefined) {
            const result: any = {};
            for (const key in this) {
                const value = this[key];
                if (Object.prototype.hasOwnProperty.call(this, key)) {
                    result[key] = value;
                }
            }
            return result;
        } else {
            return this.get(key);
        }
    }
  
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
    public setAsObject(key: any, value: any = undefined): void {
        if (value === undefined) {
            value = key
            this.clear();
            const values = MapConverter.toMap(value);
            this.append(values);
        } else {
            this.put(key, value);
        }
    }
    
    /** 
     * Converts map element into a string or returns null if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns string value of the element or null if conversion is not supported. 
     * 
     * @see [[StringConverter.toNullableString]]
     */
    public getAsNullableString(key: string): string {
        const value = this.get(key);
        return StringConverter.toNullableString(value);
    }

    /** 
     * Converts map element into a string or returns "" if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns string value of the element or "" if conversion is not supported. 
     * 
     * @see [[getAsStringWithDefault]]
     */
    public getAsString(key: string): string {
        return this.getAsStringWithDefault(key, null);
    }

    /**
     * Converts map element into a string or returns default value if conversion is not possible.
     * 
     * @param key           a key of element to get.
     * @param defaultValue  the default value
     * @returns string value of the element or default value if conversion is not supported. 
     * 
     * @see [[StringConverter.toStringWithDefault]]
     */
    public getAsStringWithDefault(key: string, defaultValue: string): string {
        const value = this.get(key);
        return StringConverter.toStringWithDefault(value, defaultValue);
    }

    /** 
     * Converts map element into a boolean or returns null if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns boolean value of the element or null if conversion is not supported. 
     * 
     * @see [[BooleanConverter.toNullableBoolean]]
     */
    public getAsNullableBoolean(key: string): boolean {
        const value = this.get(key);
        return BooleanConverter.toNullableBoolean(value);
    }

    /** 
     * Converts map element into a boolean or returns false if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns boolean value of the element or false if conversion is not supported. 
     * 
     * @see [[getAsBooleanWithDefault]]
     */
    public getAsBoolean(key: string): boolean {
        return this.getAsBooleanWithDefault(key, false);
    }

    /**
     * Converts map element into a boolean or returns default value if conversion is not possible.
     * 
     * @param key           a key of element to get.
     * @param defaultValue  the default value
     * @returns boolean value of the element or default value if conversion is not supported. 
     * 
     * @see [[BooleanConverter.toBooleanWithDefault]]
     */
    public getAsBooleanWithDefault(key: string, defaultValue: boolean): boolean {
        const value = this.get(key);
        return BooleanConverter.toBooleanWithDefault(value, defaultValue);
    }
    
    /** 
     * Converts map element into an integer or returns null if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns integer value of the element or null if conversion is not supported. 
     * 
     * @see [[IntegerConverter.toNullableInteger]]
     */
    public getAsNullableInteger(key: string): number {
        const value = this.get(key);
        return IntegerConverter.toNullableInteger(value);
    }

    /** 
     * Converts map element into an integer or returns 0 if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns integer value of the element or 0 if conversion is not supported. 
     * 
     * @see [[getAsIntegerWithDefault]]
     */
    public getAsInteger(key: string): number {
        return this.getAsIntegerWithDefault(key, 0);
    }

    /**
     * Converts map element into an integer or returns default value if conversion is not possible.
     * 
     * @param key           a key of element to get.
     * @param defaultValue  the default value
     * @returns integer value of the element or default value if conversion is not supported. 
     * 
     * @see [[IntegerConverter.toIntegerWithDefault]]
     */
    public getAsIntegerWithDefault(key: string, defaultValue: number): number {
        const value = this.get(key);
        return IntegerConverter.toIntegerWithDefault(value, defaultValue);
    }

    /** 
     * Converts map element into a long or returns null if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns long value of the element or null if conversion is not supported. 
     * 
     * @see [[LongConverter.toNullableLong]]
     */
    public getAsNullableLong(key: string): number {
        const value = this.get(key);
        return LongConverter.toNullableLong(value);
    }

    /** 
     * Converts map element into a long or returns 0 if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns long value of the element or 0 if conversion is not supported. 
     * 
     * @see [[getAsLongWithDefault]]
     */
    public getAsLong(key: string): number {
        return this.getAsLongWithDefault(key, 0);
    }

    /**
     * Converts map element into a long or returns default value if conversion is not possible.
     * 
     * @param key           a key of element to get.
     * @param defaultValue  the default value
     * @returns long value of the element or default value if conversion is not supported. 
     * 
     * @see [[LongConverter.toLongWithDefault]]
     */
    public getAsLongWithDefault(key: string, defaultValue: number): number {
        const value = this.get(key);
        return LongConverter.toLongWithDefault(value, defaultValue);
    }

    /** 
     * Converts map element into a float or returns null if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns float value of the element or null if conversion is not supported. 
     * 
     * @see [[FloatConverter.toNullableFloat]]
     */
    public getAsNullableFloat(key: string): number {
        const value = this.get(key);
        return FloatConverter.toNullableFloat(value);
    }

    /** 
     * Converts map element into a float or returns 0 if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns float value of the element or 0 if conversion is not supported. 
     * 
     * @see [[getAsFloatWithDefault]]
     */
    public getAsFloat(key: string): number {
        return this.getAsFloatWithDefault(key, 0);
    }

    /**
     * Converts map element into a flot or returns default value if conversion is not possible.
     * 
     * @param key           a key of element to get.
     * @param defaultValue  the default value
     * @returns flot value of the element or default value if conversion is not supported. 
     * 
     * @see [[FloatConverter.toFloatWithDefault]]
     */
    public getAsFloatWithDefault(key: string, defaultValue: number): number {
        const value = this.get(key);
        return FloatConverter.toFloatWithDefault(value, defaultValue);
    }

    /** 
     * Converts map element into a double or returns null if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns double value of the element or null if conversion is not supported. 
     * 
     * @see [[DoubleConverter.toNullableDouble]]
     */
    public getAsNullableDouble(key: string): number {
        const value = this.get(key);
        return DoubleConverter.toNullableDouble(value);
    }

    /** 
     * Converts map element into a double or returns 0 if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns double value of the element or 0 if conversion is not supported. 
     * 
     * @see [[getAsDoubleWithDefault]]
     */
    public getAsDouble(key: string): number {
        return this.getAsDoubleWithDefault(key, 0);
    }

    /**
     * Converts map element into a double or returns default value if conversion is not possible.
     * 
     * @param key           a key of element to get.
     * @param defaultValue  the default value
     * @returns double value of the element or default value if conversion is not supported. 
     * 
     * @see [[DoubleConverter.toDoubleWithDefault]]
     */
    public getAsDoubleWithDefault(key: string, defaultValue: number): number {
        const value = this.get(key);
        return DoubleConverter.toDoubleWithDefault(value, defaultValue);
    }

    /** 
     * Converts map element into a Date or returns null if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns Date value of the element or null if conversion is not supported. 
     * 
     * @see [[DateTimeConverter.toNullableDateTime]]
     */
    public getAsNullableDateTime(key: string): Date {
        const value = this.get(key);
        return DateTimeConverter.toNullableDateTime(value);
    }

    /** 
     * Converts map element into a Date or returns the current date if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns Date value of the element or the current date if conversion is not supported. 
     * 
     * @see [[getAsDateTimeWithDefault]]
     */
    public getAsDateTime(key: string): Date {
        return this.getAsDateTimeWithDefault(key, null);
    }

    /**
     * Converts map element into a Date or returns default value if conversion is not possible.
     * 
     * @param key           a key of element to get.
     * @param defaultValue  the default value
     * @returns Date value of the element or default value if conversion is not supported. 
     * 
     * @see [[DateTimeConverter.toDateTimeWithDefault]]
     */
    public getAsDateTimeWithDefault(key: string, defaultValue: Date): Date {
        const value = this.get(key);
        return DateTimeConverter.toDateTimeWithDefault(value, defaultValue);
    }
    
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
    public getAsNullableType<T>(type: TypeCode, key: string): T {
        const value = this.get(key);
        return TypeConverter.toNullableType<T>(type, value);
    }

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
    public getAsType<T>(type: TypeCode, key: string): T {
        return this.getAsTypeWithDefault<T>(type, key, null);
    }

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
    public getAsTypeWithDefault<T>(type: TypeCode, key: string, defaultValue: T): T {
        const value = this.get(key);
        return TypeConverter.toTypeWithDefault(type, value, defaultValue);
    }

    /** 
     * Converts map element into an AnyValue or returns an empty AnyValue if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns AnyValue value of the element or empty AnyValue if conversion is not supported. 
     * 
     * @see [[AnyValue]]
     * @see [[AnyValue.constructor]]
     */
    public getAsValue(key: string): AnyValue {
        const value = this.get(key);
        return new AnyValue(value);
    }

    /** 
     * Converts map element into an AnyValueArray or returns null if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns AnyValueArray value of the element or null if conversion is not supported. 
     * 
     * @see [[AnyValueArray]]
     * @see [[AnyValueArray.fromValue]]
     */
    public getAsNullableArray(key: string): AnyValueArray {
        const value = this.get(key);
        return value != null ? AnyValueArray.fromValue(value) : null;
    }
    
    /** 
     * Converts map element into an AnyValueArray or returns empty AnyValueArray if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns AnyValueArray value of the element or empty AnyValueArray if conversion is not supported. 
     * 
     * @see [[AnyValueArray]]
     * @see [[AnyValueArray.fromValue]]
     */
    public getAsArray(key: string): AnyValueArray {
        const value = this.get(key);
        return AnyValueArray.fromValue(value);
    }
    
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
    public getAsArrayWithDefault(key: string, defaultValue: AnyValueArray): AnyValueArray {
        const result = this.getAsNullableArray(key);
        return result != null ? result : defaultValue;
    }

    /** 
     * Converts map element into an AnyValueMap or returns null if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns AnyValueMap value of the element or null if conversion is not supported. 
     * 
     * @see [[fromValue]]
     */
    public getAsNullableMap(key: string): AnyValueMap {
        const value = this.get(key);
        return value != null ? AnyValueMap.fromValue(value) : null;
    }

    /** 
     * Converts map element into an AnyValueMap or returns empty AnyValueMap if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @returns AnyValueMap value of the element or empty AnyValueMap if conversion is not supported. 
     * 
     * @see [[fromValue]]
     */
    public getAsMap(key: string): AnyValueMap {
        const value = this.get(key);
        return AnyValueMap.fromValue(value);
    }
    
    /** 
     * Converts map element into an AnyValueMap or returns default value if conversion is not possible.
     * 
     * @param key       a key of element to get.
     * @param defaultValue  the default value
     * @returns AnyValueMap value of the element or default value if conversion is not supported. 
     * 
     * @see [[getAsNullableMap]]
     */
    public getAsMapWithDefault(key: string, defaultValue: AnyValueMap): AnyValueMap {
        const result = this.getAsNullableMap(key);
        return result != null ? result: defaultValue;
    }
    
    /** 
     * Gets a string representation of the object.
     * The result is a semicolon-separated list of key-value pairs as
     * "key1=value1;key2=value2;key=value3"
     * 
     * @returns a string representation of the object.
     */
	public toString(): string {
		let builder = '';

		// Todo: User encoder
		for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                const value = this[key];

                if (builder.length > 0) {
                    builder += ';';
                }
                
                if (value != null) {
                    builder += key + '=' + value;
                } else {
                    builder += key;
                }
            }
		}
		
		return builder;
    }
    
    /** 
     * Creates a binary clone of this object.
     * 
     * @returns a clone of this object.
     */
    public clone(): any {
        return new AnyValueMap(this);
    }

    /**
     * Converts specified value into AnyValueMap.
     * 
     * @param value     value to be converted
     * @returns         a newly created AnyValueMap.
     * 
     * @see [[setAsObject]]
     */
    public static fromValue(value: any): AnyValueMap {
        const result = new AnyValueMap();
		result.setAsObject(value);
		return result;
	}

    /**
     * Creates a new AnyValueMap from a list of key-value pairs called tuples.
     * 
     * @param tuples    a list of values where odd elements are keys and the following even elements are values
     * @returns         a newly created AnyValueArray.
     * 
     * @see [[fromTuplesArray]]
     */
    public static fromTuples(...tuples: any[]): AnyValueMap {
        return AnyValueMap.fromTuplesArray(tuples);
    }
    
    /**
     * Creates a new AnyValueMap from a list of key-value pairs called tuples.
     * The method is similar to [[fromTuples]] but tuples are passed as array instead of parameters.
     * 
     * @param tuples    a list of values where odd elements are keys and the following even elements are values
     * @returns         a newly created AnyValueArray.
     */
    public static fromTuplesArray(tuples: any[]): AnyValueMap {
        const result = new AnyValueMap();

        if (tuples == null || tuples.length == 0) {
            return result;
        }

        for (let index = 0; index < tuples.length; index += 2) {
            if (index + 1 >= tuples.length) break;

            const name = StringConverter.toString(tuples[index]);
            const value = tuples[index + 1];

            result.setAsObject(name, value);
        }
        
        return result;
    }
    
    /**
     * Creates a new AnyValueMap by merging two or more maps.
     * Maps defined later in the list override values from previously defined maps.
     * 
     * @param maps  an array of maps to be merged
     * @returns     a newly created AnyValueMap.
     */
    public static fromMaps(...maps: any[]): AnyValueMap {
        const result = new AnyValueMap();
        if (maps != null && maps.length > 0) {
            for (let index = 0; index < maps.length; index++) {
                result.append(maps[index]);
            }
        }
        return result;
    }
}
