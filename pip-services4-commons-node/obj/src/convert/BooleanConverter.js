"use strict";
/** @module convert */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanConverter = void 0;
/**
 * Converts arbitrary values to boolean values using extended conversion rules:
 * - Numbers: <>0 are true, =0 are false
 * - Strings: "true", "yes", "T", "Y", "1" are true; "false", "no", "F", "N" are false
 * - DateTime: <>0 total milliseconds are true, =0 are false
 *
 * ### Example ###
 *
 *     let value1 = BooleanConverter.toNullableBoolean(true); // true
 *     let value2 = BooleanConverter.toNullableBoolean("yes"); // true
 *     let value3 = BooleanConverter.toNullableBoolean(123); // true
 *     let value4 = BooleanConverter.toNullableBoolean({}); // null
 */
class BooleanConverter {
    /**
     * Converts value into boolean or returns null when conversion is not possible.
     *
     * @param value     the value to convert.
     * @returns         boolean value or null when convertion is not supported.
     */
    static toNullableBoolean(value) {
        if (value == null)
            return null;
        if (typeof value === "boolean")
            return value;
        if (typeof value === "number")
            return !!value;
        value = value.toString().toLowerCase();
        if (value == '1' || value == 'true' || value == 't' || value == 'yes' || value == 'y')
            return true;
        if (value == '0' || value == 'false' || value == 'f' || value == 'no' || value == 'n')
            return false;
        return null;
    }
    /**
     * Converts value into boolean or returns false when conversion is not possible.
     *
     * @param value     the value to convert.
     * @returns         boolean value or false when conversion is not supported.
     *
     * @see [[toBooleanWithDefault]]
     */
    static toBoolean(value) {
        return BooleanConverter.toBooleanWithDefault(value, false);
    }
    /**
     * Converts value into boolean or returns default value when conversion is not possible
     *
     * @param value         the value to convert.
     * @param defaultValue  the default value
     * @returns             boolean value or default when conversion is not supported.
     *
     * @see [[toNullableBoolean]]
     */
    static toBooleanWithDefault(value, defaultValue = false) {
        let result = BooleanConverter.toNullableBoolean(value);
        return result != null ? result : defaultValue;
    }
}
exports.BooleanConverter = BooleanConverter;
//# sourceMappingURL=BooleanConverter.js.map