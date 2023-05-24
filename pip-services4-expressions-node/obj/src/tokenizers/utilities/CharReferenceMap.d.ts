/** @module tokenizers */
/**
 * This class keeps references associated with specific characters
 */
export declare class CharReferenceMap<T> {
    private _initialInterval;
    private _otherIntervals;
    constructor();
    addDefaultInterval(reference: T): void;
    addInterval(start: number, end: number, reference: T): void;
    clear(): void;
    lookup(symbol: number): T;
}
