/**
 * Converts arbitrary values into integers using extended conversion rules:
 * - Strings are converted to floats, then to integers
 * - DateTime: total number of milliseconds since unix epoсh
 * - Boolean: 1 for true and 0 for false
 *
 * ### Example ###
 *
 *     let value1 = IntegerConverter.toNullableInteger("ABC"); // Result: null
 *     let value2 = IntegerConverter.toNullableInteger("123.456"); // Result: 123
 *     let value3 = IntegerConverter.toNullableInteger(true); // Result: 1
 *     let value4 = IntegerConverter.toNullableInteger(new Date()); // Result: current milliseconds
 */
export declare class IntegerConverter {
    /**
     * Converts value into integer or returns null when conversion is not possible.
     *
     * @param value     the value to convert.
     * @returns         integer value or null when conversion is not supported.
     *
     * @see [[LongConverter.toNullableLong]]
     */
    static toNullableInteger(value: any): number;
    /**
     * Converts value into integer or returns 0 when conversion is not possible.
     *
     * @param value     the value to convert.
     * @returns         integer value or 0 when conversion is not supported.
     *
     * @see [[LongConverter.toLong]]
     * @see [[LongConverter.toLongWithDefault]]
     */
    static toInteger(value: any): number;
    /**
     * Converts value into integer or returns default value when conversion is not possible.
     *
     * @param value         the value to convert.
     * @param defaultValue  the default value.
     * @returns             integer value or default when conversion is not supported.
     *
     * @see [[LongConverter.toLongWithDefault]]
     * @see [[LongConverter.toNullableLong]]
     */
    static toIntegerWithDefault(value: any, defaultValue: number): number;
}
