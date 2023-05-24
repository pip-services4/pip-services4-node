/** @module tokenizers */
/**
 * Represents a character interval that keeps a reference.
 * This class is internal and used by [[CharReferenceMap]].
 */
export declare class CharReferenceInterval<T> {
    private _start;
    private _end;
    private _reference;
    constructor(start: number, end: number, reference: T);
    get start(): number;
    get end(): number;
    get reference(): T;
    inRange(symbol: number): boolean;
}
