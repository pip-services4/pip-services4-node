/** @module random */
/**
 * Random generator for double values.
 *
 * ### Example ###
 *
 *     let value1 = RandomDouble.nextDouble(5, 10);     // Possible result: 7.3
 *     let value2 = RandomDouble.nextDouble(10);        // Possible result: 3.7
 *     let value3 = RandomDouble.updateDouble(10, 3);   // Possible result: 9.2
 */
export declare class RandomDouble {
    /**
     * Generates a random double value in the range ['minYear', 'maxYear'].
     *
     * @param min   (optional) minimum range value
     * @param max   max range value
     * @returns     a random double value.
     */
    static nextDouble(min: number, max?: number): number;
    /**
     * Updates (drifts) a double value within specified range defined
     *
     * @param value     a double value to drift.
     * @param range     (optional) a range. Default: 10% of the value
     */
    static updateDouble(value: number, range?: number): number;
}
