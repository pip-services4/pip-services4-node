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
export class AnyValue implements ICloneable {
    /** The value stored by this object. */
	public value: any;

    /**
     * Creates a new instance of the object and assigns its value.
     * 
     * @param value     (optional) value to initialize this object.
     */
    public constructor(value: any = null) {
    	if (value instanceof AnyValue) {
    		this.value = (<AnyValue>value).value;
        } else {
			this.value = value;
        }
    }

    /** 
     * Gets type code for the value stored in this object.
     * 
     * @returns type code of the object value. 
     * 
     * @see [[TypeConverter.toTypeCode]]
     */
    public getTypeCode(): TypeCode {
    	return TypeConverter.toTypeCode(this.value);
    }
    
    /** 
     * Gets the value stored in this object without any conversions
     * 
     * @returns the object value. 
     */
    public getAsObject(): any {
        return this.value;
    }

    /** 
     * Sets a new value for this object
     * 
     * @param value     the new object value.
     */
    public setAsObject(value: any): void {
        if (value instanceof AnyValue) {
            this.value = (<AnyValue>value).value;
        } else {
            this.value = value;
        }
    }

    /** 
     * Converts object value into a string or returns null if conversion is not possible.
     * 
     * @returns string value or null if conversion is not supported. 
     * 
     * @see [[StringConverter.toNullableString]]
     */
    public getAsNullableString(): string {
        return StringConverter.toNullableString(this.value);
    }

    /** 
     * Converts object value into a string or returns "" if conversion is not possible.
     * 
     * @returns string value or "" if conversion is not supported. 
     * 
     * @see [[getAsStringWithDefault]]
     */
    public getAsString(): string {
        return this.getAsStringWithDefault(null);
    }

    /**
     * Converts object value into a string or returns default value if conversion is not possible.
     * 
     * @param defaultValue      the default value.
     * @returns string value or default if conversion is not supported. 
     * 
     * @see [[StringConverter.toStringWithDefault]]
     */
    public getAsStringWithDefault(defaultValue: string): string {
        return StringConverter.toStringWithDefault(this.value, defaultValue);
    }

    /** 
     * Converts object value into a boolean or returns null if conversion is not possible.
     * 
     * @returns boolean value or null if conversion is not supported. 
     * 
     * @see [[BooleanConverter.toNullableBoolean]]
     */
    public getAsNullableBoolean(): boolean {
        return BooleanConverter.toNullableBoolean(this.value);
    }

    /** 
     * Converts object value into a boolean or returns false if conversion is not possible.
     * 
     * @returns string value or false if conversion is not supported. 
     * 
     * @see [[getAsBooleanWithDefault]]
     */
    public getAsBoolean(): boolean {
        return this.getAsBooleanWithDefault(false);
    }

    /**
     * Converts object value into a boolean or returns default value if conversion is not possible.
     * 
     * @param defaultValue      the default value.
     * @returns boolean value or default if conversion is not supported. 
     * 
     * @see [[BooleanConverter.toBooleanWithDefault]]
     */
    public getAsBooleanWithDefault(defaultValue: boolean): boolean {
        return BooleanConverter.toBooleanWithDefault(this.value, defaultValue);
    }

    /** 
     * Converts object value into an integer or returns null if conversion is not possible.
     * 
     * @returns integer value or null if conversion is not supported. 
     * 
     * @see [[IntegerConverter.toNullableInteger]]
     */
    public getAsNullableInteger(): number {
        return IntegerConverter.toNullableInteger(this.value);
    }

    /** 
     * Converts object value into an integer or returns 0 if conversion is not possible.
     * 
     * @returns integer value or 0 if conversion is not supported. 
     * 
     * @see [[getAsIntegerWithDefault]]
     */
    public getAsInteger(): number {
        return this.getAsIntegerWithDefault(0);
    }

    /**
     * Converts object value into a integer or returns default value if conversion is not possible.
     * 
     * @param defaultValue      the default value.
     * @returns integer value or default if conversion is not supported. 
     * 
     * @see [[IntegerConverter.toIntegerWithDefault]]
     */
    public getAsIntegerWithDefault(defaultValue: number): number {
        return IntegerConverter.toIntegerWithDefault(this.value, defaultValue);
    }

    /** 
     * Converts object value into a long or returns null if conversion is not possible.
     * 
     * @returns long value or null if conversion is not supported. 
     * 
     * @see [[LongConverter.toNullableLong]]
     */
    public getAsNullableLong(): number {
        return LongConverter.toNullableLong(this.value);
    }

    /** 
     * Converts object value into a long or returns 0 if conversion is not possible.
     * 
     * @returns string value or 0 if conversion is not supported. 
     * 
     * @see [[getAsLongWithDefault]]
     */
    public getAsLong(): number {
        return this.getAsLongWithDefault(0);
    }

    /**
     * Converts object value into a long or returns default value if conversion is not possible.
     * 
     * @param defaultValue      the default value.
     * @returns long value or default if conversion is not supported. 
     * 
     * @see [[LongConverter.toLongWithDefault]]
     */
    public getAsLongWithDefault(defaultValue: number): number {
        return LongConverter.toLongWithDefault(this.value, defaultValue);
    }

    /** 
     * Converts object value into a float or returns null if conversion is not possible.
     * 
     * @returns float value or null if conversion is not supported. 
     * 
     * @see [[FloatConverter.toNullableFloat]]
     */
    public getAsNullableFloat(): number {
        return FloatConverter.toNullableFloat(this.value);
    }

    /**
     * Converts object value into a float or returns 0 if conversion is not possible.
     * 
     * @returns float value or 0 if conversion is not supported. 
     * 
     * @see [[getAsFloatWithDefault]]
     */
    public getAsFloat(): number {
        return this.getAsFloatWithDefault(0);
    }

    /**
     * Converts object value into a float or returns default value if conversion is not possible.
     * 
     * @param defaultValue      the default value.
     * @returns float value or default if conversion is not supported. 
     * 
     * @see [[FloatConverter.toFloatWithDefault]]
     */
    public getAsFloatWithDefault(defaultValue: number): number {
        return FloatConverter.toFloatWithDefault(this.value, defaultValue);
    }

    /** 
     * Converts object value into a double or returns null if conversion is not possible.
     * 
     * @returns double value or null if conversion is not supported. 
     * 
     * @see [[DoubleConverter.toNullableDouble]]
     */
    public getAsNullableDouble(): number {
        return DoubleConverter.toNullableDouble(this.value);
    }

    /** 
     * Converts object value into a double or returns 0 if conversion is not possible.
     * 
     * @returns double value or 0 if conversion is not supported. 
     * 
     * @see [[getAsDoubleWithDefault]]
     */
    public getAsDouble(): number {
        return this.getAsDoubleWithDefault(0);
    }

    /**
     * Converts object value into a double or returns default value if conversion is not possible.
     * 
     * @param defaultValue      the default value.
     * @returns double value or default if conversion is not supported. 
     * 
     * @see [[DoubleConverter.toDoubleWithDefault]]
     */
    public getAsDoubleWithDefault(defaultValue: number): number {
        return DoubleConverter.toDoubleWithDefault(this.value, defaultValue);
    }

    /** 
     * Converts object value into a Date or returns null if conversion is not possible.
     * 
     * @returns Date value or null if conversion is not supported. 
     * 
     * @see [[DateTimeConverter.toNullableDateTime]]
     */
    public getAsNullableDateTime(): Date {
        return DateTimeConverter.toNullableDateTime(this.value);
    }

    /** 
     * Converts object value into a Date or returns current date if conversion is not possible.
     * 
     * @returns Date value or current date if conversion is not supported. 
     * 
     * @see [[getAsDateTimeWithDefault]]
     */
    public getAsDateTime(): Date {
        return this.getAsDateTimeWithDefault(new Date());
    }

    /**
     * Converts object value into a Date or returns default value if conversion is not possible.
     * 
     * @param defaultValue      the default value.
     * @returns Date value or default if conversion is not supported. 
     * 
     * @see [[DateTimeConverter.toDateTimeWithDefault]]
     */
    public getAsDateTimeWithDefault(defaultValue: Date): Date {
        return DateTimeConverter.toDateTimeWithDefault(this.value, defaultValue);
    }

    /** 
     * Converts object value into a value defined by specied typecode.
     * If conversion is not possible it returns null.
     * 
     * @param type      the TypeCode that defined the type of the result
     * @returns value defined by the typecode or null if conversion is not supported. 
     * 
     * @see [[TypeConverter.toNullableType]]
     */
    public getAsNullableType<T>(type: TypeCode): T {
        return TypeConverter.toNullableType<T>(type, this.value);
    }

    /** 
     * Converts object value into a value defined by specied typecode.
     * If conversion is not possible it returns default value for the specified type.
     * 
     * @param typeCode    the TypeCode that defined the type of the result
     * @returns value defined by the typecode or type default value if conversion is not supported. 
     * 
     * @see [[getAsTypeWithDefault]]
     */
    public getAsType<T>(typeCode: TypeCode): T {
        return this.getAsTypeWithDefault<T>(typeCode, null);
    }

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
    public getAsTypeWithDefault<T>(typeCode: TypeCode, defaultValue: T): T {
        return TypeConverter.toTypeWithDefault<T>(typeCode, this.value, defaultValue);
    }

    /** 
     * Converts object value into an AnyArray or returns empty AnyArray if conversion is not possible.
     * 
     * @returns AnyArray value or empty AnyArray if conversion is not supported. 
     * 
     * @see [[AnyValueArray.fromValue]]
     */
    public getAsArray(): AnyValueArray {
    	return AnyValueArray.fromValue(this.value);
    }

    /** 
     * Converts object value into AnyMap or returns empty AnyMap if conversion is not possible.
     * 
     * @returns AnyMap value or empty AnyMap if conversion is not supported. 
     * 
     * @see [[AnyValueMap.fromValue]]
     */
    public getAsMap(): AnyValueMap {
    	return AnyValueMap.fromValue(this.value);
    }

    /**
     * Compares this object value to specified specified value.
     * When direct comparison gives negative results it tries
     * to compare values as strings.
     * 
     * @param obj   the value to be compared with.
     * @returns     true when objects are equal and false otherwise.
     */
    public equals(obj: any): boolean {
        if (obj == null && this.value == null) return true;
        if (obj == null || this.value == null) return false;

        if (obj instanceof AnyValue) {
        	obj = (<AnyValue>obj).value;
        }

        let strThisValue = StringConverter.toString(this.value);
        let strValue = StringConverter.toString(obj);
        
        if (strThisValue == null && strValue == null) return true;
        if (strThisValue == null || strValue == null) return false;        
        return strThisValue == strValue;
    }

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
    public equalsAsType<T>(type: TypeCode, obj: any): boolean {
        if (obj == null && this.value == null) return true;
        if (obj == null || this.value == null) return false;

        if (obj instanceof AnyValue) {
        	obj = (<AnyValue>obj).value;
        }

        let typedThisValue = TypeConverter.toType<T>(type, this.value);
        let typedValue = TypeConverter.toType<T>(type, obj);
        
        if (typedThisValue == null && typedValue == null) return true;
        if (typedThisValue == null || typedValue == null) return false;        
        return typedThisValue == typedValue;
    }

    /** 
     * Creates a binary clone of this object.
     * 
     * @returns a clone of this object.
     */
    public clone(): any {
    	return new AnyValue(this.value);
    }
    
    /** 
     * Gets a string representation of the object.
     * 
     * @returns a string representation of the object.
     *
     * @see [[StringConverter.toString]]
     */
    public toString(): any {
        return StringConverter.toString(this.value);
    }

    /**
     * Gets an object hash code which can be used to optimize storing and searching.
     * 
     * @returns an object hash code. 
     */
    public hashCode(): number {
        return this.value != null ? this.value.hashCode(): 0;
    }
}
