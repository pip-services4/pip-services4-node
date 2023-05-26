/** @module convert */

/**
 * Converts arbitrary values into longs using extended conversion rules:
 * - Strings are converted to floats, then to longs
 * - DateTime: total number of milliseconds since unix epoсh
 * - Boolean: 1 for true and 0 for false
 * 
 * ### Example ###
 * 
 *     let value1 = LongConverter.toNullableLong("ABC"); // Result: null
 *     let value2 = LongConverter.toNullableLong("123.456"); // Result: 123
 *     let value3 = LongConverter.toNullableLong(true); // Result: 1
 *     let value4 = LongConverter.toNullableLong(new Date()); // Result: current milliseconds
 */
export class LongConverter {

    /**
     * Converts value into long or returns null when conversion is not possible.
     * 
     * @param value     the value to convert.
     * @returns         long value or null when conversion is not supported.
     */
    public static toNullableLong(value: any): number {
        if (value == null) return null;
        if (typeof value === "number") return Math.round(value);
        if (value instanceof Date) return value.getTime();
        if (typeof value === "boolean") return value ? 1 : 0;

        const result = parseFloat(value);
        return isNaN(result) ? null : Math.round(result);
    }

    /**
     * Converts value into long or returns 0 when conversion is not possible.
     * 
     * @param value     the value to convert.
     * @returns         long value or 0 when conversion is not supported.
     * 
     * @see [[toLongWithDefault]]
     */
    public static toLong(value: any): number {
        return LongConverter.toLongWithDefault(value, 0);
    }

    /**
     * Converts value into integer or returns default when conversion is not possible.
     * 
     * @param value         the value to convert.
     * @param defaultValue  the default value.
     * @returns             long value or default when conversion is not supported
     * 
     * @see [[toNullableLong]]
     */
    public static toLongWithDefault(value: any, defaultValue: number): number {
        const result = LongConverter.toNullableLong(value);
        return result != null ? result : defaultValue;
    }

}