"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonConverter = void 0;
const TypeConverter_1 = require("./TypeConverter");
const MapConverter_1 = require("./MapConverter");
/**
 * Converts arbitrary values from and to JSON (JavaScript Object Notation) strings.
 *
 * ### Example ###
 *
 *     let value1 = JsonConverter.fromJson("{\"key\":123}"); // Result: { key: 123 }
 *     let value2 = JsonConverter.toMap({ key: 123}); // Result: "{\"key\":123}"
 *
 * @see [[TypeCode]]
 */
class JsonConverter {
    /**
     * Converts JSON string into a value of type specified by a TypeCode.
     *
     * @param type 		the TypeCode for the data type into which 'value' is to be converted.
     * @param value 	the JSON string to convert.
     * @returns			converted object value or null when value is null.
     */
    static fromJson(type, value) {
        if (value == null)
            return null;
        const temp = JSON.parse(value);
        return TypeConverter_1.TypeConverter.toType(type, temp);
    }
    /**
     * Converts value into JSON string.
     *
     * @param value 	the value to convert.
     * @returns			JSON string or null when value is null.
     */
    static toJson(value) {
        if (value == null)
            return null;
        return JSON.stringify(value);
    }
    /**
     * Converts JSON string into map object or returns null when conversion is not possible.
     *
     * @param value 	the JSON string to convert.
     * @returns			Map object value or null when conversion is not supported.
     *
     * @see [[MapConverter.toNullableMap]]
     */
    static toNullableMap(value) {
        if (value == null)
            return null;
        try {
            const map = JSON.parse(value);
            return MapConverter_1.MapConverter.toNullableMap(map);
        }
        catch (Exception) {
            return null;
        }
    }
    /**
     * Converts JSON string into map object or returns empty map when conversion is not possible.
     *
     * @param value 	the JSON string to convert.
     * @returns 		Map object value or empty object when conversion is not supported.
     *
     * @see [[toNullableMap]]
     */
    static toMap(value) {
        const result = JsonConverter.toNullableMap(value);
        return result != null ? result : {};
    }
    /**
     * Converts JSON string into map object or returns default value when conversion is not possible.
     *
     * @param value         the JSON string to convert.
     * @param defaultValue  the default value.
     * @returns				Map object value or default when conversion is not supported.
     *
     * @see [[toNullableMap]]
     */
    static toMapWithDefault(value, defaultValue) {
        const result = JsonConverter.toNullableMap(value);
        return result != null ? result : defaultValue;
    }
}
exports.JsonConverter = JsonConverter;
//# sourceMappingURL=JsonConverter.js.map