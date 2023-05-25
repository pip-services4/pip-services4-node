/**
 * Random generator for array objects.
 *
 * ### Example ###
 *
 *     let value1 = RandomArray.pick([1, 2, 3, 4]); // Possible result: 3
 */
export declare class RandomArray {
    /**
     * Picks a random element from specified array.
     *
     * @param values    an array of any type
     * @returns         a randomly picked item.
     */
    static pick<T>(values: T[]): T;
}
