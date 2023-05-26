"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomString = void 0;
/** @module random */
const RandomInteger_1 = require("./RandomInteger");
const RandomBoolean_1 = require("./RandomBoolean");
/**
 * Random generator for string values.
 *
 * ### Example ###
 *
 *     let value1 = RandomString.pickChar("ABC");     // Possible result: "C"
 *     let value2 = RandomString.pick(["A","B","C"]); // Possible result: "gBW"
 */
class RandomString {
    /**
     * Picks a random character from a string.
     *
     * @param values    a string to pick a char from
     * @returns         a randomly picked char.
     */
    static pickChar(values) {
        if (values == null || values.length == 0) {
            return '';
        }
        const index = RandomInteger_1.RandomInteger.nextInteger(values.length);
        return values.charAt(index);
    }
    /**
     * Picks a random string from an array of string.
     *
     * @param values    strings to pick from.
     * @returns         a randomly picked string.
     */
    static pick(values) {
        if (values == null || values.length == 0) {
            return '';
        }
        const index = RandomInteger_1.RandomInteger.nextInteger(values.length);
        return values[index];
    }
    /**
     * Distorts a string by randomly replacing characters in it.
     *
     * @param value    a string to distort.
     * @returns        a distored string.
     */
    static distort(value) {
        value = value.toLowerCase();
        //Capitalize the first letter of the string 'value'.
        if (RandomBoolean_1.RandomBoolean.chance(1, 5)) {
            value = value.substring(0, 1).toUpperCase() + value.substring(1);
        }
        //Add a symbol to the end of the string 'value' 
        if (RandomBoolean_1.RandomBoolean.chance(1, 3)) {
            value = value + RandomString.pickChar(RandomString._symbols);
        }
        return value;
    }
    /**
     * Generates random alpha characted [A-Za-z]
     *
     * @returns a random characted.
     */
    static nextAlphaChar() {
        const index = RandomInteger_1.RandomInteger.nextInteger(RandomString._alpha.length);
        return RandomString._alpha.charAt(index);
    }
    /**
     * Generates a random string, consisting of upper and lower case letters (of the English alphabet),
     * digits (0-9), and symbols ("_,.:-/.[].{},#-!,$=%.+^.&*-() ").
     *
     * @param minLength     (optional) minimum string length.
     * @param maxLength     maximum string length.
     * @returns             a random string.
     */
    static nextString(minLength, maxLength) {
        let result = '';
        const length = RandomInteger_1.RandomInteger.nextInteger(minLength, maxLength);
        for (let i = 0; i < length; i++) {
            const index = RandomInteger_1.RandomInteger.nextInteger(RandomString._chars.length);
            result += RandomString._chars.charAt(index);
        }
        return result;
    }
}
exports.RandomString = RandomString;
RandomString._digits = "01234956789";
RandomString._symbols = "_,.:-/.[].{},#-!,$=%.+^.&*-() ";
RandomString._alphaLower = "abcdefghijklmnopqrstuvwxyz";
RandomString._alphaUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
RandomString._alpha = RandomString._alphaUpper + RandomString._alphaLower;
RandomString._chars = RandomString._alpha + RandomString._digits + RandomString._symbols;
//# sourceMappingURL=RandomString.js.map