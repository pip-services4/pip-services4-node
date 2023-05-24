/** @module random */
/**
 * Random generator for boolean values.
 *
 * ### Example ###
 *
 *     let value1 = RandomBoolean.nextBoolean();    // Possible result: true
 *     let value2 = RandomBoolean.chance(1,3);      // Possible result: false
 */
export declare class RandomBoolean {
    /**
     * Calculates "chance" out of "max chances".
     * Example: 1 chance out of 3 chances (or 33.3%)
     *
     * @param chance       a chance proportional to maxChances.
     * @param maxChances   a maximum number of chances
     */
    static chance(chance: number, maxChances: number): boolean;
    /**
     * Generates a random boolean value.
     *
     * @returns a random boolean.
     */
    static nextBoolean(): boolean;
}
