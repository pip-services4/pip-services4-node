"use strict";
/** @module tokenizers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharReferenceMap = void 0;
const CharReferenceInterval_1 = require("./CharReferenceInterval");
/**
 * This class keeps references associated with specific characters
 */
class CharReferenceMap {
    constructor() {
        this.clear();
    }
    addDefaultInterval(reference) {
        this.addInterval(0x0000, 0xfffe, reference);
    }
    addInterval(start, end, reference) {
        if (start > end) {
            throw new Error("Start must be less or equal End");
        }
        end = end == 0xffff ? 0xfffe : end;
        for (let index = start; index < 0x0100 && index <= end; index++) {
            this._initialInterval[index] = reference;
        }
        if (end >= 0x0100) {
            start = start < 0x0100 ? 0x0100 : start;
            this._otherIntervals.splice(0, 0, new CharReferenceInterval_1.CharReferenceInterval(start, end, reference));
        }
    }
    clear() {
        this._initialInterval = [];
        for (let index = 0; index < 0x0100; index++) {
            this._initialInterval[index] = null;
        }
        this._otherIntervals = [];
    }
    lookup(symbol) {
        if (symbol < 0x0100) {
            return this._initialInterval[symbol];
        }
        else {
            for (let interval of this._otherIntervals) {
                if (interval.inRange(symbol)) {
                    return interval.reference;
                }
            }
            return null;
        }
    }
}
exports.CharReferenceMap = CharReferenceMap;
//# sourceMappingURL=CharReferenceMap.js.map