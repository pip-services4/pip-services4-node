"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeConverter = void 0;
/** @module convert */
const TypeCode_1 = require("./TypeCode");
const StringConverter_1 = require("./StringConverter");
const BooleanConverter_1 = require("./BooleanConverter");
const IntegerConverter_1 = require("./IntegerConverter");
const LongConverter_1 = require("./LongConverter");
const FloatConverter_1 = require("./FloatConverter");
const DoubleConverter_1 = require("./DoubleConverter");
const DateTimeConverter_1 = require("./DateTimeConverter");
const ArrayConverter_1 = require("./ArrayConverter");
const MapConverter_1 = require("./MapConverter");
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
class TypeConverter {
    /**
     * Gets TypeCode for specific value.
     *
     * @param value 	value whose TypeCode is to be resolved.
     * @returns			the TypeCode that corresponds to the passed object's type.
     */
    static toTypeCode(value) {
        if (value == null)
            return TypeCode_1.TypeCode.Unknown;
        if (Array.isArray(value))
            return TypeCode_1.TypeCode.Array;
        if (typeof value === "boolean")
            return TypeCode_1.TypeCode.Boolean;
        if (value instanceof Date)
            return TypeCode_1.TypeCode.DateTime;
        if (Number.isInteger(value))
            return TypeCode_1.TypeCode.Long;
        if (typeof value === "number")
            return TypeCode_1.TypeCode.Double;
        if (typeof value === "function")
            return TypeCode_1.TypeCode.Object;
        if (typeof value === "object")
            return TypeCode_1.TypeCode.Map;
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
            return TypeCode_1.TypeCode.String;
        }
        return TypeCode_1.TypeCode.Object;
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
    static toNullableType(type, value) {
        if (value == null)
            return null;
        // Convert to known types
        if (type == TypeCode_1.TypeCode.String)
            value = StringConverter_1.StringConverter.toNullableString(value);
        else if (type == TypeCode_1.TypeCode.Boolean)
            value = BooleanConverter_1.BooleanConverter.toNullableBoolean(value);
        else if (type == TypeCode_1.TypeCode.Integer)
            value = IntegerConverter_1.IntegerConverter.toNullableInteger(value);
        else if (type == TypeCode_1.TypeCode.Long)
            value = LongConverter_1.LongConverter.toNullableLong(value);
        else if (type == TypeCode_1.TypeCode.Float)
            value = FloatConverter_1.FloatConverter.toNullableFloat(value);
        else if (type == TypeCode_1.TypeCode.Double)
            value = DoubleConverter_1.DoubleConverter.toNullableDouble(value);
        else if (type == TypeCode_1.TypeCode.DateTime)
            value = DateTimeConverter_1.DateTimeConverter.toNullableDateTime(value);
        else if (type == TypeCode_1.TypeCode.Array)
            value = ArrayConverter_1.ArrayConverter.toNullableArray(value);
        else if (type == TypeCode_1.TypeCode.Map)
            value = MapConverter_1.MapConverter.toNullableMap(value);
        return value;
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
    static toType(type, value) {
        // Convert to the specified type
        const result = TypeConverter.toNullableType(type, value);
        if (result != null)
            return result;
        // Define and return default value based on type
        if (type == TypeCode_1.TypeCode.Integer)
            value = 0;
        else if (type == TypeCode_1.TypeCode.Long)
            value = 0;
        else if (type == TypeCode_1.TypeCode.Float)
            value = 0;
        else if (type == TypeCode_1.TypeCode.Double)
            value = 0;
        else if (type == TypeCode_1.TypeCode.Boolean) // cases from here down were added by Mark Makarychev.
            value = false;
        else if (type == TypeCode_1.TypeCode.String)
            value = "";
        else if (type == TypeCode_1.TypeCode.DateTime)
            value = new Date();
        else if (type == TypeCode_1.TypeCode.Map)
            value = {};
        else if (type == TypeCode_1.TypeCode.Array)
            value = [];
        return value;
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
    static toTypeWithDefault(type, value, defaultValue) {
        const result = TypeConverter.toNullableType(type, value);
        return result != null ? result : defaultValue;
    }
    /**
     * Converts a TypeCode into its string name.
     *
     * @param type 	the TypeCode to convert into a string.
     * @returns		the name of the TypeCode passed as a string value.
     */
    static toString(type) {
        switch (type) {
            case TypeCode_1.TypeCode.Unknown:
                return "unknown";
            case TypeCode_1.TypeCode.String:
                return "string";
            case TypeCode_1.TypeCode.Boolean:
                return "boolean";
            case TypeCode_1.TypeCode.Integer:
                return "integer";
            case TypeCode_1.TypeCode.Long:
                return "long";
            case TypeCode_1.TypeCode.Float:
                return "float";
            case TypeCode_1.TypeCode.Double:
                return "double";
            case TypeCode_1.TypeCode.DateTime:
                return "datetime";
            case TypeCode_1.TypeCode.Duration:
                return "duration";
            case TypeCode_1.TypeCode.Object:
                return "object";
            case TypeCode_1.TypeCode.Enum:
                return "enum";
            case TypeCode_1.TypeCode.Array:
                return "array";
            case TypeCode_1.TypeCode.Map:
                return "map";
            default:
                return "unknown";
        }
    }
}
exports.TypeConverter = TypeConverter;
//# sourceMappingURL=TypeConverter.js.map