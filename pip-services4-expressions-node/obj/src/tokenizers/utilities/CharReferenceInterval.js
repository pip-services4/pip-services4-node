"use strict";
/** @module tokenizers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharReferenceInterval = void 0;
/**
 * Represents a character interval that keeps a reference.
 * This class is internal and used by [[CharReferenceMap]].
 */
class CharReferenceInterval {
    constructor(start, end, reference) {
        if (start > end) {
            throw new Error("Start must be less or equal End");
        }
        this._start = start;
        this._end = end;
        this._reference = reference;
    }
    get start() {
        return this._start;
    }
    get end() {
        return this._end;
    }
    get reference() {
        return this._reference;
    }
    inRange(symbol) {
        return symbol >= this._start && symbol <= this._end;
    }
}
exports.CharReferenceInterval = CharReferenceInterval;
//# sourceMappingURL=CharReferenceInterval.js.map