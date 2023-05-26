"use strict";
/** @module convert */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleConverter = void 0;
/**
 * Converts arbitrary values into double using extended conversion rules:
 * - Strings are converted to double values
 * - DateTime: total number of milliseconds since unix epoсh
 * - Boolean: 1 for true and 0 for false
 *
 * ### Example ###
 *
 *     let value1 = DoubleConverter.toNullableDouble("ABC"); // Result: null
 *     let value2 = DoubleConverter.toNullableDouble("123.456"); // Result: 123.456
 *     let value3 = DoubleConverter.toNullableDouble(true); // Result: 1
 *     let value4 = DoubleConverter.toNullableDouble(new Date()); // Result: current milliseconds
 */
class DoubleConverter {
    /**
     * Converts value into doubles or returns null when conversion is not possible.
     *
     * @param value     the value to convert.
     * @returns         double value or null when conversion is not supported.
     */
    static toNullableDouble(value) {
        if (value == null)
            return null;
        if (typeof value === "number")
            return value;
        if (value instanceof Date)
            return value.getTime();
        if (typeof value === "boolean")
            return value ? 1 : 0;
        const result = parseFloat(value);
        return isNaN(result) ? null : result;
    }
    /**
     * Converts value into doubles or returns 0 when conversion is not possible.
     *
     * @param value     the value to convert.
     * @returns         double value or 0 when conversion is not supported.
     *
     * @see [[toDoubleWithDefault]]
     */
    static toDouble(value) {
        return DoubleConverter.toDoubleWithDefault(value, 0);
    }
    /**
     * Converts value into integer or returns default value when conversion is not possible.
     *
     * @param value         the value to convert.
     * @param defaultValue  the default value.
     * @returns             double value or default when conversion is not supported.
     *
     * @see [[toNullableDouble]]
     */
    static toDoubleWithDefault(value, defaultValue = 0) {
        const result = DoubleConverter.toNullableDouble(value);
        return result != null ? result : defaultValue;
    }
}
exports.DoubleConverter = DoubleConverter;
//# sourceMappingURL=DoubleConverter.js.map