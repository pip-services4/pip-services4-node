"use strict";
/** @module random */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomInteger = void 0;
/**
 * Random generator for integer values.
 *
 * ### Example ###
 *
 *     let value1 = RandomInteger.nextInteger(5, 10);     // Possible result: 7
 *     let value2 = RandomInteger.nextInteger(10);        // Possible result: 3
 *     let value3 = RandomInteger.updateInteger(10, 3);   // Possible result: 9
 */
class RandomInteger {
    /**
     * Generates a integer in the range ['min', 'max']. If 'max' is omitted, then the range will be set to [0, 'min'].
     *
     * @param min   minimum value of the integer that will be generated.
     *              If 'max' is omitted, then 'max' is set to 'min' and 'min' is set to 0.
     * @param max   (optional) maximum value of the float that will be generated. Defaults to 'min' if omitted.
     * @returns     generated random integer value.
     */
    static nextInteger(min, max = null) {
        if (max == null) {
            max = min;
            min = 0;
        }
        if (max - min <= 0) {
            return min;
        }
        return Math.floor(min + Math.random() * (max - min));
    }
    /**
     * Updates (drifts) a integer value within specified range defined
     *
     * @param value     a integer value to drift.
     * @param range     (optional) a range. Default: 10% of the value
     */
    static updateInteger(value, range = null) {
        if (range == null)
            range = 0;
        range = range == 0 ? Math.floor(0.1 * value) : range;
        let minValue = value - range;
        let maxValue = value + range;
        return RandomInteger.nextInteger(minValue, maxValue);
    }
    /**
     * Generates a random sequence of integers starting from 0 like: [0,1,2,3...??]
     *
     * @param min   minimum value of the integer that will be generated.
     *              If 'max' is omitted, then 'max' is set to 'min' and 'min' is set to 0.
     * @param max   (optional) maximum value of the float that will be generated. Defaults to 'min' if omitted.
     * @returns     generated array of integers.
     */
    static sequence(min, max = null) {
        max = max != null ? max : min;
        let count = RandomInteger.nextInteger(min, max);
        let result = [];
        for (let i = 0; i < count; i++) {
            result.push(i);
        }
        return result;
    }
}
exports.RandomInteger = RandomInteger;
//# sourceMappingURL=RandomInteger.js.map