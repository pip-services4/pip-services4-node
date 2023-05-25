"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomArray = void 0;
/** @module random */
const RandomInteger_1 = require("./RandomInteger");
/**
 * Random generator for array objects.
 *
 * ### Example ###
 *
 *     let value1 = RandomArray.pick([1, 2, 3, 4]); // Possible result: 3
 */
class RandomArray {
    /**
     * Picks a random element from specified array.
     *
     * @param values    an array of any type
     * @returns         a randomly picked item.
     */
    static pick(values) {
        if (values == null || values.length == 0) {
            return null;
        }
        return values[RandomInteger_1.RandomInteger.nextInteger(values.length)];
    }
}
exports.RandomArray = RandomArray;
//# sourceMappingURL=RandomArray.js.map