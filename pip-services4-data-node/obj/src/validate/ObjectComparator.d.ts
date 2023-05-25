/**
 * Helper class to perform comparison operations over arbitrary values.
 *
 * ### Example ###
 *
 *     ObjectComparator.compare(2, "GT", 1);        // Result: true
 *     ObjectComparator.areEqual("A", "B");         // Result: false
 */
export declare class ObjectComparator {
    /**
     * Perform comparison operation over two arguments.
     * The operation can be performed over values of any type.
     *
     * @param value1        the first argument to compare
     * @param operation     the comparison operation: "==" ("=", "EQ"), "!= " ("<>", "NE"); "<"/">" ("LT"/"GT"), "<="/">=" ("LE"/"GE"); "LIKE".
     * @param value2        the second argument to compare
     * @returns result of the comparison operation
     */
    static compare(value1: any, operation: string, value2: any): boolean;
    /**
     * Checks if two values are equal.
     * The operation can be performed over values of any type.
     *
     * @param value1    the first value to compare
     * @param value2    the second value to compare
     * @returns true if values are equal and false otherwise
     */
    static areEqual(value1: any, value2: any): boolean;
    /**
     * Checks if two values are NOT equal
     * The operation can be performed over values of any type.
     *
     * @param value1    the first value to compare
     * @param value2    the second value to compare
     * @returns true if values are NOT equal and false otherwise
     */
    static areNotEqual(value1: any, value2: any): boolean;
    /**
     * Checks if first value is less than the second one.
     * The operation can be performed over numbers or strings.
     *
     * @param value1    the first value to compare
     * @param value2    the second value to compare
     * @returns true if the first value is less than second and false otherwise.
     */
    static isLess(value1: any, value2: any): boolean;
    /**
     * Checks if first value is greater than the second one.
     * The operation can be performed over numbers or strings.
     *
     * @param value1    the first value to compare
     * @param value2    the second value to compare
     * @returns true if the first value is greater than second and false otherwise.
     */
    static isGreater(value1: any, value2: any): boolean;
    /**
     * Checks if string matches a regular expression
     *
     * @param value     a string value to match
     * @param regexp    a regular expression string
     * @returns true if the value matches regular expression and false otherwise.
     */
    static match(value: any, regexp: any): boolean;
}
