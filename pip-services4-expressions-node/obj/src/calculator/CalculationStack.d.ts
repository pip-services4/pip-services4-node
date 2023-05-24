/** @module calculator */
import { Variant } from "../variants/Variant";
/**
 * Implements a stack of Variant values.
 */
export declare class CalculationStack {
    private _values;
    get length(): number;
    push(value: Variant): void;
    pop(): Variant;
    peekAt(index: number): Variant;
    peek(): Variant;
}
