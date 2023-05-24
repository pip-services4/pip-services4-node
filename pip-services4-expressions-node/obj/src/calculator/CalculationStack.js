"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculationStack = void 0;
/**
 * Implements a stack of Variant values.
 */
class CalculationStack {
    constructor() {
        this._values = [];
    }
    get length() {
        return this._values.length;
    }
    push(value) {
        this._values.push(value);
    }
    pop() {
        if (this._values.length == 0) {
            throw new Error("Stack is empty.");
        }
        let result = this._values[this._values.length - 1];
        this._values.splice(this._values.length - 1, 1);
        return result;
    }
    peekAt(index) {
        return this._values[index];
    }
    peek() {
        if (this._values.length == 0) {
            throw new Error("Stack is empty.");
        }
        return this._values[this._values.length - 1];
    }
}
exports.CalculationStack = CalculationStack;
//# sourceMappingURL=CalculationStack.js.map