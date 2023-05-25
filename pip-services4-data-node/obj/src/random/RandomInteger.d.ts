/** @module random */
/**
 * Random generator for integer values.
 *
 * ### Example ###
 *
 *     let value1 = RandomInteger.nextInteger(5, 10);     // Possible result: 7
 *     let value2 = RandomInteger.nextInteger(10);        // Possible result: 3
 *     let value3 = RandomInteger.updateInteger(10, 3);   // Possible result: 9
 */
export declare class RandomInteger {
    /**
     * Generates a integer in the range ['min', 'max']. If 'max' is omitted, then the range will be set to [0, 'min'].
     *
     * @param min   minimum value of the integer that will be generated.
     *              If 'max' is omitted, then 'max' is set to 'min' and 'min' is set to 0.
     * @param max   (optional) maximum value of the float that will be generated. Defaults to 'min' if omitted.
     * @returns     generated random integer value.
     */
    static nextInteger(min: number, max?: number): number;
    /**
     * Updates (drifts) a integer value within specified range defined
     *
     * @param value     a integer value to drift.
     * @param range     (optional) a range. Default: 10% of the value
     */
    static updateInteger(value: number, range?: number): number;
    /**
     * Generates a random sequence of integers starting from 0 like: [0,1,2,3...??]
     *
     * @param min   minimum value of the integer that will be generated.
     *              If 'max' is omitted, then 'max' is set to 'min' and 'min' is set to 0.
     * @param max   (optional) maximum value of the float that will be generated. Defaults to 'min' if omitted.
     * @returns     generated array of integers.
     */
    static sequence(min: number, max?: number): number[];
}
