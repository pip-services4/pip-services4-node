/** @module convert */

/**
 * Converts arbitrary values into strings using extended conversion rules:
 * - Numbers: are converted with '.' as decimal point
 * - DateTime: using ISO format
 * - Boolean: "true" for true and "false" for false
 * - Arrays: as comma-separated list
 * - Other objects: using <code>toString()</code> method
 * 
 * ### Example ###
 * 
 *     let value1 = StringConverter.ToString(123.456); // Result: "123.456"
 *     let value2 = StringConverter.ToString(true); // Result: "true"
 *     let value3 = StringConverter.ToString(new Date(2018,0,1)); // Result: "2018-01-01T00:00:00.00"
 *     let value4 = StringConverter.ToString([1,2,3]); // Result: "1,2,3"
 */
export class StringConverter {

    /**
     * Converts value into string or returns null when value is null.
     * 
     * @param value     the value to convert.
     * @returns         string value or null when value is null.
     */
    public static toNullableString(value: any): string {
        if (value == null) return null;
        if (typeof value === "string") return value;
        if (value instanceof Date) return value.toISOString();
        return value.toString();
    }

    /**
     * Converts value into string or returns "" when value is null.
     * 
     * @param value     the value to convert.
     * @returns         string value or "" when value is null.
     * 
     * @see [[toStringWithDefault]]
     */
    public static toString(value: any): string {
        return StringConverter.toStringWithDefault(value, "");
    }

    /**
     * Converts value into string or returns default when value is null.
     * 
     * @param value         the value to convert.
     * @param defaultValue  the default value.
     * @returns             string value or default when value is null.
     * 
     * @see [[toNullableString]]
     */
    public static toStringWithDefault(value: any, defaultValue: string): string {
        return StringConverter.toNullableString(value) || defaultValue;
    }

}