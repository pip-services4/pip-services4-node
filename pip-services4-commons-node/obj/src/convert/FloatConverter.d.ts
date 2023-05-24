/**
 * Converts arbitrary values into float using extended conversion rules:
 * - Strings are converted to float values
 * - DateTime: total number of milliseconds since unix epoсh
 * - Boolean: 1 for true and 0 for false
 *
 * ### Example ###
 *
 *     let value1 = FloatConverter.toNullableFloat("ABC"); // Result: null
 *     let value2 = FloatConverter.toNullableFloat("123.456"); // Result: 123.456
 *     let value3 = FloatConverter.toNullableFloat(true); // Result: 1
 *     let value4 = FloatConverter.toNullableFloat(new Date()); // Result: current milliseconds
 */
export declare class FloatConverter {
    /**
     * Converts value into float or returns null when conversion is not possible.
     *
     * @param value     the value to convert.
     * @returns         float value or null when conversion is not supported.
     *
     * @see [[DoubleConverter.toNullableDouble]]
     */
    static toNullableFloat(value: any): number;
    /**
     * Converts value into float or returns 0 when conversion is not possible.
     *
     * @param value     the value to convert.
     * @returns         float value or 0 when conversion is not supported.
     *
     * @see [[DoubleConverter.toDouble]]
     * @see [[DoubleConverter.toDoubleWithDefault]]
     */
    static toFloat(value: any): number;
    /**
     * Converts value into float or returns default when conversion is not possible.
     *
     * @param value         the value to convert.
     * @param defaultValue  the default value.
     * @returns             float value or default value when conversion is not supported.
     *
     * @see [[DoubleConverter.toDoubleWithDefault]]
     * @see [[DoubleConverter.toNullableDouble]]
     */
    static toFloatWithDefault(value: any, defaultValue: number): number;
}
