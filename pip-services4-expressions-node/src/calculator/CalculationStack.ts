/** @module calculator */
import { Variant } from "../variants/Variant";

/**
 * Implements a stack of Variant values.
 */
export class CalculationStack {
    private _values: Variant[] = [];

    public get length(): number {
        return this._values.length;
    }

    public push(value: Variant): void {
        this._values.push(value);
    }

    public pop(): Variant {
        if (this._values.length == 0) {
            throw new Error("Stack is empty.");
        }
        let result = this._values[this._values.length - 1];
        this._values.splice(this._values.length - 1, 1);
        return result;
    }

    public peekAt(index: number): Variant {
        return this._values[index];
    }

    public peek(): Variant {
        if (this._values.length == 0) {
            throw new Error("Stack is empty.");
        }
        return this._values[this._values.length - 1];
    }
}