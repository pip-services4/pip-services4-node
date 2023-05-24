/** @module tokenizers */

/**
 * Represents a character interval that keeps a reference.
 * This class is internal and used by [[CharReferenceMap]].
 */
export class CharReferenceInterval<T> {
    private _start: number;
    private _end: number;
    private _reference: T;

    public constructor(start: number, end: number, reference: T) {
        if (start > end) {
            throw new Error("Start must be less or equal End");
        }
        this._start = start;
        this._end = end;
        this._reference = reference;
    }

    public get start(): number {
        return this._start;
    }

    public get end(): number {
        return this._end;
    }

    public get reference(): T {
        return this._reference;
    }

    public inRange(symbol: number): boolean {
        return symbol >= this._start && symbol <= this._end;
    }
}