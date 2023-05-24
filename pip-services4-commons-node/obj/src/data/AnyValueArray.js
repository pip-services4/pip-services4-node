"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyValueArray = void 0;
const TypeConverter_1 = require("../convert/TypeConverter");
const StringConverter_1 = require("../convert/StringConverter");
const BooleanConverter_1 = require("../convert/BooleanConverter");
const IntegerConverter_1 = require("../convert/IntegerConverter");
const LongConverter_1 = require("../convert/LongConverter");
const FloatConverter_1 = require("../convert/FloatConverter");
const DoubleConverter_1 = require("../convert/DoubleConverter");
const DateTimeConverter_1 = require("../convert/DateTimeConverter");
const ArrayConverter_1 = require("../convert/ArrayConverter");
const AnyValue_1 = require("./AnyValue");
const AnyValueMap_1 = require("./AnyValueMap");
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
class AnyValueArray extends Array {
    /**
     * Creates a new instance of the array and assigns its value.
     *
     * @param value     (optional) values to initialize this array.
     */
    constructor(values = null) {
        super();
        // Set the prototype explicitly.
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        this.__proto__ = AnyValueArray.prototype;
        this.append(values);
    }
    /**
     * Gets an array element specified by its index.
     *
     * @param index     an index of the element to get.
     * @returns         the value of the array element.
     */
    get(index) {
        return this[index];
    }
    /**
     * Puts a new value into array element specified by its index.
     *
     * @param index     an index of the element to put.
     * @param value     a new value for array element.
     */
    put(index, value) {
        this[index] = value;
    }
    /**
     * Removes an array element specified by its index
     *
     * @param index     an index of the element to remove.
     */
    remove(index) {
        this.splice(index, 1);
    }
    /**
     * Appends new elements to this array.
     *
     * @param elements  a list of elements to be added.
     */
    append(elements) {
        if (elements != null) {
            for (let index = 0; index < elements.length; index++) {
                this.push(elements[index]);
            }
        }
    }
    /**
     * Clears this array by removing all its elements.
    */
    clear() {
        this.splice(0, this.length);
    }
    /**
     * Gets the value stored in array element without any conversions.
     * When element index is not defined it returns the entire array value.
     *
     * @param index     (optional) an index of the element to get
     * @returns the element value or value of the array when index is not defined.
     */
    getAsObject(index = undefined) {
        if (index === undefined) {
            let result = [];
            for (index = 0; index < this.length; index++) {
                result.push(this[index]);
            }
            return result;
        }
        else {
            return this[index];
        }
    }
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
    setAsObject(index, value = undefined) {
        if (value === undefined) {
            value = index; //originally was not present - added by Mark Makarychev.
            this.clear();
            let elements = ArrayConverter_1.ArrayConverter.toArray(value);
            this.append(elements);
        }
        else {
            this[index] = value;
        }
    }
    /**
     * Converts array element into a string or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns string value of the element or null if conversion is not supported.
     *
     * @see [[StringConverter.toNullableString]]
     */
    getAsNullableString(index) {
        let value = this[index];
        return StringConverter_1.StringConverter.toNullableString(value);
    }
    /**
     * Converts array element into a string or returns "" if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns string value ot the element or "" if conversion is not supported.
     *
     * @see [[getAsStringWithDefault]]
     */
    getAsString(index) {
        return this.getAsStringWithDefault(index, null);
    }
    /**
     * Converts array element into a string or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns string value ot the element or default value if conversion is not supported.
     *
     * @see [[StringConverter.toStringWithDefault]]
     */
    getAsStringWithDefault(index, defaultValue) {
        let value = this[index];
        return StringConverter_1.StringConverter.toStringWithDefault(value, defaultValue);
    }
    /**
     * Converts array element into a boolean or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns boolean value of the element or null if conversion is not supported.
     *
     * @see [[BooleanConverter.toNullableBoolean]]
     */
    getAsNullableBoolean(index) {
        let value = this[index];
        return BooleanConverter_1.BooleanConverter.toNullableBoolean(value);
    }
    /**
     * Converts array element into a boolean or returns false if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns boolean value ot the element or false if conversion is not supported.
     *
     * @see [[getAsBooleanWithDefault]]
     */
    getAsBoolean(index) {
        return this.getAsBooleanWithDefault(index, false);
    }
    /**
     * Converts array element into a boolean or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns boolean value ot the element or default value if conversion is not supported.
     *
     * @see [[BooleanConverter.toBooleanWithDefault]]
     */
    getAsBooleanWithDefault(index, defaultValue) {
        let value = this[index];
        return BooleanConverter_1.BooleanConverter.toBooleanWithDefault(value, defaultValue);
    }
    /**
     * Converts array element into an integer or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns integer value of the element or null if conversion is not supported.
     *
     * @see [[IntegerConverter.toNullableInteger]]
     */
    getAsNullableInteger(index) {
        let value = this[index];
        return IntegerConverter_1.IntegerConverter.toNullableInteger(value);
    }
    /**
     * Converts array element into an integer or returns 0 if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns integer value ot the element or 0 if conversion is not supported.
     *
     * @see [[getAsIntegerWithDefault]]
     */
    getAsInteger(index) {
        return this.getAsIntegerWithDefault(index, 0);
    }
    /**
     * Converts array element into an integer or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns integer value ot the element or default value if conversion is not supported.
     *
     * @see [[IntegerConverter.toIntegerWithDefault]]
     */
    getAsIntegerWithDefault(index, defaultValue) {
        let value = this[index];
        return IntegerConverter_1.IntegerConverter.toIntegerWithDefault(value, defaultValue);
    }
    /**
     * Converts array element into a long or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns long value of the element or null if conversion is not supported.
     *
     * @see [[LongConverter.toNullableLong]]
     */
    getAsNullableLong(index) {
        let value = this[index];
        return LongConverter_1.LongConverter.toNullableLong(value);
    }
    /**
     * Converts array element into a long or returns 0 if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns long value ot the element or 0 if conversion is not supported.
     *
     * @see [[getAsLongWithDefault]]
     */
    getAsLong(index) {
        return this.getAsLongWithDefault(index, 0);
    }
    /**
     * Converts array element into a long or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns long value ot the element or default value if conversion is not supported.
     *
     * @see [[LongConverter.toLongWithDefault]]
     */
    getAsLongWithDefault(index, defaultValue) {
        let value = this[index];
        return LongConverter_1.LongConverter.toLongWithDefault(value, defaultValue);
    }
    /**
     * Converts array element into a float or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns float value of the element or null if conversion is not supported.
     *
     * @see [[FloatConverter.toNullableFloat]]
     */
    getAsNullableFloat(index) {
        let value = this[index];
        return FloatConverter_1.FloatConverter.toNullableFloat(value);
    }
    /**
     * Converts array element into a float or returns 0 if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns float value ot the element or 0 if conversion is not supported.
     *
     * @see [[getAsFloatWithDefault]]
     */
    getAsFloat(index) {
        return this.getAsFloatWithDefault(index, 0);
    }
    /**
     * Converts array element into a float or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns float value ot the element or default value if conversion is not supported.
     *
     * @see [[FloatConverter.toFloatWithDefault]]
     */
    getAsFloatWithDefault(index, defaultValue) {
        let value = this[index];
        return FloatConverter_1.FloatConverter.toFloatWithDefault(value, defaultValue);
    }
    /**
     * Converts array element into a double or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns double value of the element or null if conversion is not supported.
     *
     * @see [[DoubleConverter.toNullableDouble]]
     */
    getAsNullableDouble(index) {
        let value = this[index];
        return DoubleConverter_1.DoubleConverter.toNullableDouble(value);
    }
    /**
     * Converts array element into a double or returns 0 if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns double value ot the element or 0 if conversion is not supported.
     *
     * @see [[getAsDoubleWithDefault]]
     */
    getAsDouble(index) {
        return this.getAsDoubleWithDefault(index, 0);
    }
    /**
     * Converts array element into a double or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns double value ot the element or default value if conversion is not supported.
     *
     * @see [[DoubleConverter.toDoubleWithDefault]]
     */
    getAsDoubleWithDefault(index, defaultValue) {
        let value = this[index];
        return DoubleConverter_1.DoubleConverter.toDoubleWithDefault(value, defaultValue);
    }
    /**
     * Converts array element into a Date or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns Date value of the element or null if conversion is not supported.
     *
     * @see [[DateTimeConverter.toNullableDateTime]]
     */
    getAsNullableDateTime(index) {
        let value = this[index];
        return DateTimeConverter_1.DateTimeConverter.toNullableDateTime(value);
    }
    /**
     * Converts array element into a Date or returns the current date if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns Date value ot the element or the current date if conversion is not supported.
     *
     * @see [[getAsDateTimeWithDefault]]
     */
    getAsDateTime(index) {
        return this.getAsDateTimeWithDefault(index, new Date());
    }
    /**
     * Converts array element into a Date or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns Date value ot the element or default value if conversion is not supported.
     *
     * @see [[DateTimeConverter.toDateTimeWithDefault]]
     */
    getAsDateTimeWithDefault(index, defaultValue) {
        let value = this[index];
        return DateTimeConverter_1.DateTimeConverter.toDateTimeWithDefault(value, defaultValue);
    }
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
    getAsNullableType(type, index) {
        let value = this[index];
        return TypeConverter_1.TypeConverter.toNullableType(type, value);
    }
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
    getAsType(type, index) {
        return this.getAsTypeWithDefault(type, index, null);
    }
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
    getAsTypeWithDefault(type, index, defaultValue) {
        let value = this[index];
        return TypeConverter_1.TypeConverter.toTypeWithDefault(type, value, defaultValue);
    }
    /**
     * Converts array element into an AnyValue or returns an empty AnyValue if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns AnyValue value of the element or empty AnyValue if conversion is not supported.
     *
     * @see [[AnyValue]]
     * @see [[AnyValue.constructor]]
     */
    getAsValue(index) {
        let value = this[index];
        return new AnyValue_1.AnyValue(value);
    }
    /**
     * Converts array element into an AnyValueArray or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns AnyValueArray value of the element or null if conversion is not supported.
     *
     * @see [[fromValue]]
     */
    getAsNullableArray(index) {
        let value = this[index];
        return value != null ? AnyValueArray.fromValue(value) : null;
    }
    /**
     * Converts array element into an AnyValueArray or returns empty AnyValueArray if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns AnyValueArray value of the element or empty AnyValueArray if conversion is not supported.
     *
     * @see [[fromValue]]
     */
    getAsArray(index) {
        let value = this[index];
        return AnyValueArray.fromValue(value);
    }
    /**
     * Converts array element into an AnyValueArray or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns AnyValueArray value of the element or default value if conversion is not supported.
     *
     * @see [[getAsNullableArray]]
     */
    getAsArrayWithDefault(index, defaultValue) {
        let result = this.getAsNullableArray(index);
        return result != null ? result : defaultValue;
    }
    /**
     * Converts array element into an AnyValueMap or returns null if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns AnyValueMap value of the element or null if conversion is not supported.
     *
     * @see [[AnyValueMap]]
     * @see [[AnyValueMap.fromValue]]
     */
    getAsNullableMap(index) {
        let value = this[index];
        return value != null ? AnyValueMap_1.AnyValueMap.fromValue(value) : null;
    }
    /**
     * Converts array element into an AnyValueMap or returns empty AnyValueMap if conversion is not possible.
     *
     * @param index     an index of element to get.
     * @returns AnyValueMap value of the element or empty AnyValueMap if conversion is not supported.
     *
     * @see [[AnyValueMap]]
     * @see [[AnyValueMap.fromValue]]
     */
    getAsMap(index) {
        let value = this[index];
        return AnyValueMap_1.AnyValueMap.fromValue(value);
    }
    /**
     * Converts array element into an AnyValueMap or returns default value if conversion is not possible.
     *
     * @param index         an index of element to get.
     * @param defaultValue  the default value
     * @returns AnyValueMap value of the element or default value if conversion is not supported.
     *
     * @see [[getAsNullableMap]]
     */
    getAsMapWithDefault(index, defaultValue) {
        let result = this.getAsNullableMap(index);
        return result != null ? AnyValueMap_1.AnyValueMap.fromValue(result) : defaultValue;
    }
    /**
     * Checks if this array contains a value.
     * The check uses direct comparison between elements and the specified value.
     *
     * @param value     a value to be checked
     * @returns         true if this array contains the value or false otherwise.
     */
    contains(value) {
        for (let index = 0; index < this.length; index++) {
            let element = this[index];
            if (value == null && element == null) {
                return true;
            }
            if (value == null || element == null) {
                continue;
            }
            if (value == element) {
                return true;
            }
        }
        return false;
    }
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
    containsAsType(typeCode, value) {
        let typedValue = TypeConverter_1.TypeConverter.toType(typeCode, value);
        for (let index = 0; index < this.length; index++) {
            let thisTypedValue = TypeConverter_1.TypeConverter.toNullableType(typeCode, this[index]);
            if (typedValue == null && thisTypedValue == null) {
                return true;
            }
            if (typedValue == null || thisTypedValue == null) {
                continue;
            }
            if (typedValue == thisTypedValue) {
                return true;
            }
        }
        return false;
    }
    /**
     * Creates a binary clone of this object.
     *
     * @returns a clone of this object.
     */
    clone() {
        return new AnyValueArray(this);
    }
    /**
     * Gets a string representation of the object.
     * The result is a comma-separated list of string representations of individual elements as
     * "value1,value2,value3"
     *
     * @returns a string representation of the object.
     *
     * @see [[StringConverter.toString]]
     */
    toString() {
        let builder = '';
        for (let index = 0; index < this.length; index++) {
            if (index > 0) {
                builder += ',';
            }
            builder += this.getAsStringWithDefault(index, "");
        }
        return builder;
    }
    /**
     * Creates a new AnyValueArray from a list of values
     *
     * @param values    a list of values to initialize the created AnyValueArray
     * @returns         a newly created AnyValueArray.
     */
    static fromValues(...values) {
        return new AnyValueArray(values);
    }
    /**
     * Converts specified value into AnyValueArray.
     *
     * @param value     value to be converted
     * @returns         a newly created AnyValueArray.
     *
     * @see [[ArrayConverter.toNullableArray]]
     */
    static fromValue(value) {
        let values = ArrayConverter_1.ArrayConverter.toNullableArray(value);
        return new AnyValueArray(values);
    }
    /**
     * Splits specified string into elements using a separator and assigns
     * the elements to a newly created AnyValueArray.
     *
     * @param values            a string value to be split and assigned to AnyValueArray
     * @param separator         a separator to split the string
     * @param removeDuplicates  (optional) true to remove duplicated elements
     * @returns                 a newly created AnyValueArray.
     */
    static fromString(values, separator, removeDuplicates = false) {
        let result = new AnyValueArray();
        if (values == null || values.length == 0) {
            return result;
        }
        let items = values.split(separator, -1);
        for (let index = 0; index < items.length; index++) {
            let item = items[index];
            if ((item != null && item.length > 0) || removeDuplicates == false) {
                result.push(item != null ? new AnyValue_1.AnyValue(item) : null);
            }
        }
        return result;
    }
}
exports.AnyValueArray = AnyValueArray;
//# sourceMappingURL=AnyValueArray.js.map