"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyValueMap = void 0;
const TypeConverter_1 = require("../convert/TypeConverter");
const StringConverter_1 = require("../convert/StringConverter");
const BooleanConverter_1 = require("../convert/BooleanConverter");
const IntegerConverter_1 = require("../convert/IntegerConverter");
const LongConverter_1 = require("../convert/LongConverter");
const FloatConverter_1 = require("../convert/FloatConverter");
const DoubleConverter_1 = require("../convert/DoubleConverter");
const DateTimeConverter_1 = require("../convert/DateTimeConverter");
const MapConverter_1 = require("../convert/MapConverter");
const AnyValue_1 = require("./AnyValue");
const AnyValueArray_1 = require("./AnyValueArray");
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
class AnyValueMap {
    /**
     * Creates a new instance of the map and assigns its value.
     *
     * @param value     (optional) values to initialize this map.
     */
    constructor(values = null) {
        this.append(values);
    }
    /**
     * Gets a map element specified by its key.
     *
     * @param key     a key of the element to get.
     * @returns       the value of the map element.
     */
    get(key) {
        return this[key] || null;
    }
    /**
     * Gets keys of all elements stored in this map.
     *
     * @returns a list with all map keys.
     */
    getKeys() {
        let keys = [];
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
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
    put(key, value) {
        this[key] = value;
    }
    /**
     * Removes a map element specified by its key
     *
     * @param key     a key of the element to remove.
     */
    remove(key) {
        delete this[key];
    }
    /**
     * Appends new elements to this map.
     *
     * @param map  a map with elements to be added.
     */
    append(map) {
        if (map == null)
            return;
        for (let key in map) {
            let value = map[key];
            if (map.hasOwnProperty(key)) {
                this[key] = value;
            }
        }
    }
    /**
     * Clears this map by removing all its elements.
     */
    clear() {
        for (let key in this) {
            let value = this[key];
            if (this.hasOwnProperty(key)) {
                delete this[key];
            }
        }
    }
    /**
     * Gets a number of elements stored in this map.
     *
     * @returns the number of elements in this map.
     */
    length() {
        let count = 0;
        for (let key in this) {
            if (this.hasOwnProperty(key) && typeof this[key] !== "function") {
                count++;
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
    getAsObject(key = undefined) {
        if (key === undefined) {
            let result = {};
            for (let key in this) {
                let value = this[key];
                if (this.hasOwnProperty(key)) {
                    result[key] = value;
                }
            }
            return result;
        }
        else {
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
    setAsObject(key, value = undefined) {
        if (value === undefined) {
            value = key;
            this.clear();
            let values = MapConverter_1.MapConverter.toMap(value);
            this.append(values);
        }
        else {
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
    getAsNullableString(key) {
        let value = this.get(key);
        return StringConverter_1.StringConverter.toNullableString(value);
    }
    /**
     * Converts map element into a string or returns "" if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns string value of the element or "" if conversion is not supported.
     *
     * @see [[getAsStringWithDefault]]
     */
    getAsString(key) {
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
    getAsStringWithDefault(key, defaultValue) {
        let value = this.get(key);
        return StringConverter_1.StringConverter.toStringWithDefault(value, defaultValue);
    }
    /**
     * Converts map element into a boolean or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns boolean value of the element or null if conversion is not supported.
     *
     * @see [[BooleanConverter.toNullableBoolean]]
     */
    getAsNullableBoolean(key) {
        let value = this.get(key);
        return BooleanConverter_1.BooleanConverter.toNullableBoolean(value);
    }
    /**
     * Converts map element into a boolean or returns false if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns boolean value of the element or false if conversion is not supported.
     *
     * @see [[getAsBooleanWithDefault]]
     */
    getAsBoolean(key) {
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
    getAsBooleanWithDefault(key, defaultValue) {
        let value = this.get(key);
        return BooleanConverter_1.BooleanConverter.toBooleanWithDefault(value, defaultValue);
    }
    /**
     * Converts map element into an integer or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns integer value of the element or null if conversion is not supported.
     *
     * @see [[IntegerConverter.toNullableInteger]]
     */
    getAsNullableInteger(key) {
        let value = this.get(key);
        return IntegerConverter_1.IntegerConverter.toNullableInteger(value);
    }
    /**
     * Converts map element into an integer or returns 0 if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns integer value of the element or 0 if conversion is not supported.
     *
     * @see [[getAsIntegerWithDefault]]
     */
    getAsInteger(key) {
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
    getAsIntegerWithDefault(key, defaultValue) {
        let value = this.get(key);
        return IntegerConverter_1.IntegerConverter.toIntegerWithDefault(value, defaultValue);
    }
    /**
     * Converts map element into a long or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns long value of the element or null if conversion is not supported.
     *
     * @see [[LongConverter.toNullableLong]]
     */
    getAsNullableLong(key) {
        let value = this.get(key);
        return LongConverter_1.LongConverter.toNullableLong(value);
    }
    /**
     * Converts map element into a long or returns 0 if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns long value of the element or 0 if conversion is not supported.
     *
     * @see [[getAsLongWithDefault]]
     */
    getAsLong(key) {
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
    getAsLongWithDefault(key, defaultValue) {
        let value = this.get(key);
        return LongConverter_1.LongConverter.toLongWithDefault(value, defaultValue);
    }
    /**
     * Converts map element into a float or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns float value of the element or null if conversion is not supported.
     *
     * @see [[FloatConverter.toNullableFloat]]
     */
    getAsNullableFloat(key) {
        let value = this.get(key);
        return FloatConverter_1.FloatConverter.toNullableFloat(value);
    }
    /**
     * Converts map element into a float or returns 0 if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns float value of the element or 0 if conversion is not supported.
     *
     * @see [[getAsFloatWithDefault]]
     */
    getAsFloat(key) {
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
    getAsFloatWithDefault(key, defaultValue) {
        let value = this.get(key);
        return FloatConverter_1.FloatConverter.toFloatWithDefault(value, defaultValue);
    }
    /**
     * Converts map element into a double or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns double value of the element or null if conversion is not supported.
     *
     * @see [[DoubleConverter.toNullableDouble]]
     */
    getAsNullableDouble(key) {
        let value = this.get(key);
        return DoubleConverter_1.DoubleConverter.toNullableDouble(value);
    }
    /**
     * Converts map element into a double or returns 0 if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns double value of the element or 0 if conversion is not supported.
     *
     * @see [[getAsDoubleWithDefault]]
     */
    getAsDouble(key) {
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
    getAsDoubleWithDefault(key, defaultValue) {
        let value = this.get(key);
        return DoubleConverter_1.DoubleConverter.toDoubleWithDefault(value, defaultValue);
    }
    /**
     * Converts map element into a Date or returns null if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns Date value of the element or null if conversion is not supported.
     *
     * @see [[DateTimeConverter.toNullableDateTime]]
     */
    getAsNullableDateTime(key) {
        let value = this.get(key);
        return DateTimeConverter_1.DateTimeConverter.toNullableDateTime(value);
    }
    /**
     * Converts map element into a Date or returns the current date if conversion is not possible.
     *
     * @param key       a key of element to get.
     * @returns Date value of the element or the current date if conversion is not supported.
     *
     * @see [[getAsDateTimeWithDefault]]
     */
    getAsDateTime(key) {
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
    getAsDateTimeWithDefault(key, defaultValue) {
        let value = this.get(key);
        return DateTimeConverter_1.DateTimeConverter.toDateTimeWithDefault(value, defaultValue);
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
    getAsNullableType(type, key) {
        let value = this.get(key);
        return TypeConverter_1.TypeConverter.toNullableType(type, value);
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
    getAsType(type, key) {
        return this.getAsTypeWithDefault(type, key, null);
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
    getAsTypeWithDefault(type, key, defaultValue) {
        let value = this.get(key);
        return TypeConverter_1.TypeConverter.toTypeWithDefault(type, value, defaultValue);
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
    getAsValue(key) {
        let value = this.get(key);
        return new AnyValue_1.AnyValue(value);
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
    getAsNullableArray(key) {
        let value = this.get(key);
        return value != null ? AnyValueArray_1.AnyValueArray.fromValue(value) : null;
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
    getAsArray(key) {
        let value = this.get(key);
        return AnyValueArray_1.AnyValueArray.fromValue(value);
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
    getAsArrayWithDefault(key, defaultValue) {
        let result = this.getAsNullableArray(key);
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
    getAsNullableMap(key) {
        let value = this.get(key);
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
    getAsMap(key) {
        let value = this.get(key);
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
    getAsMapWithDefault(key, defaultValue) {
        let result = this.getAsNullableMap(key);
        return result != null ? result : defaultValue;
    }
    /**
     * Gets a string representation of the object.
     * The result is a semicolon-separated list of key-value pairs as
     * "key1=value1;key2=value2;key=value3"
     *
     * @returns a string representation of the object.
     */
    toString() {
        let builder = '';
        // Todo: User encoder
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                let value = this[key];
                if (builder.length > 0) {
                    builder += ';';
                }
                if (value != null) {
                    builder += key + '=' + value;
                }
                else {
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
    clone() {
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
    static fromValue(value) {
        let result = new AnyValueMap();
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
    static fromTuples(...tuples) {
        return AnyValueMap.fromTuplesArray(tuples);
    }
    /**
     * Creates a new AnyValueMap from a list of key-value pairs called tuples.
     * The method is similar to [[fromTuples]] but tuples are passed as array instead of parameters.
     *
     * @param tuples    a list of values where odd elements are keys and the following even elements are values
     * @returns         a newly created AnyValueArray.
     */
    static fromTuplesArray(tuples) {
        let result = new AnyValueMap();
        if (tuples == null || tuples.length == 0) {
            return result;
        }
        for (let index = 0; index < tuples.length; index += 2) {
            if (index + 1 >= tuples.length)
                break;
            let name = StringConverter_1.StringConverter.toString(tuples[index]);
            let value = tuples[index + 1];
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
    static fromMaps(...maps) {
        let result = new AnyValueMap();
        if (maps != null && maps.length > 0) {
            for (let index = 0; index < maps.length; index++) {
                result.append(maps[index]);
            }
        }
        return result;
    }
}
exports.AnyValueMap = AnyValueMap;
//# sourceMappingURL=AnyValueMap.js.map