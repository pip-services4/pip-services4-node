/** @module convert */

/**
 * Converts arbitrary values into Date values using extended conversion rules:
 * - Strings: converted using ISO time format
 * - Numbers: converted using milliseconds since unix epoch
 * 
 * ### Example ###
 * 
 *     let value1 = DateTimeConverter.toNullableDateTime("ABC"); // Result: null
 *     let value2 = DateTimeConverter.toNullableDateTime("2018-01-01T11:30:00.0"); // Result: Date(2018,0,1,11,30)
 *     let value3 = DateTimeConverter.toNullableDateTime(123); // Result: Date(123)
 */
export class DateTimeConverter {

    /**
     * Converts value into Date or returns null when conversion is not possible.
     * 
     * @param value     the value to convert.
     * @returns         Date value or null when conversion is not supported.
     */
    public static toNullableDateTime(value: any): Date {
        if (value == null) return null;
        if (value instanceof Date) return value;
        if (typeof value === "number") return new Date(value);

        let result = Date.parse(value);
        return isNaN(result) ? null : new Date(result);
    }

    /**
     * Converts value into Date or returns current date when conversion is not possible.
     * 
     * @param value     the value to convert.
     * @returns         Date value or current date when conversion is not supported.
     * 
     * @see [[toDateTimeWithDefault]]
     */
    public static toDateTime(value: any): Date {
        return DateTimeConverter.toDateTimeWithDefault(value, new Date());
    }

    /**
     * Converts value into Date or returns default when conversion is not possible.
     * 
     * @param value         the value to convert.
     * @param defaultValue  the default value.
     * @returns             Date value or default when conversion is not supported.
     * 
     * @see [[toNullableDateTime]]
     */
    public static toDateTimeWithDefault(value: any, defaultValue: Date = null): Date {
        let result = DateTimeConverter.toNullableDateTime(value);
        return result != null ? result : defaultValue;
    }

}