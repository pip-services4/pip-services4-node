/** @module convert */
/**
 * Converts arbitrary values into array objects.
 *
 * ### Example ###
 *
 *     let value1 = ArrayConverter.toArray([1, 2]);		 // Result: [1, 2]
 *     let value2 = ArrayConverter.toArray(1);			  // Result: [1]
 *     let value2 = ArrayConverter.listToArray("1,2,3");	// Result: ["1", "2", "3"]
 */
export declare class ArrayConverter {
    /**
     * Converts value into array object.
     * Single values are converted into arrays with a single element.
     *
     * @param value     the value to convert.
     * @returns         array object or null when value is null.
     */
    static toNullableArray(value: any): any[];
    /**
     * Converts value into array object with empty array as default.
     * Single values are converted into arrays with single element.
     *
     * @param value     the value to convert.
     * @returns			array object or empty array when value is null.
     *
     * @see [[toNullableArray]]
     */
    static toArray(value: any): any[];
    /**
     * Converts value into array object with specified default.
     * Single values are converted into arrays with single element.
     *
     * @param value         the value to convert.
     * @param defaultValue  default array object.
     * @returns				array object or default array when value is null.
     *
     * @see [[toNullableArray]]
     */
    static toArrayWithDefault(value: any, defaultValue: any[]): any[];
    /**
     * Converts value into array object with empty array as default.
     * Strings with comma-delimited values are split into array of strings.
     *
     * @param value 	the list to convert.
     * @returns			array object or empty array when value is null
     *
     * @see [[toArray]]
     */
    static listToArray(value: any): any[];
}
