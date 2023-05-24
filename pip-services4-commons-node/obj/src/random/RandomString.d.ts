/**
 * Random generator for string values.
 *
 * ### Example ###
 *
 *     let value1 = RandomString.pickChar("ABC");     // Possible result: "C"
 *     let value2 = RandomString.pick(["A","B","C"]); // Possible result: "gBW"
 */
export declare class RandomString {
    private static readonly _digits;
    private static readonly _symbols;
    private static readonly _alphaLower;
    private static readonly _alphaUpper;
    private static readonly _alpha;
    private static readonly _chars;
    /**
     * Picks a random character from a string.
     *
     * @param values    a string to pick a char from
     * @returns         a randomly picked char.
     */
    static pickChar(values: string): string;
    /**
     * Picks a random string from an array of string.
     *
     * @param values    strings to pick from.
     * @returns         a randomly picked string.
     */
    static pick(values: string[]): string;
    /**
     * Distorts a string by randomly replacing characters in it.
     *
     * @param value    a string to distort.
     * @returns        a distored string.
     */
    static distort(value: string): string;
    /**
     * Generates random alpha characted [A-Za-z]
     *
     * @returns a random characted.
     */
    static nextAlphaChar(): string;
    /**
     * Generates a random string, consisting of upper and lower case letters (of the English alphabet),
     * digits (0-9), and symbols ("_,.:-/.[].{},#-!,$=%.+^.&*-() ").
     *
     * @param minLength     (optional) minimum string length.
     * @param maxLength     maximum string length.
     * @returns             a random string.
     */
    static nextString(minLength: number, maxLength: number): string;
}
