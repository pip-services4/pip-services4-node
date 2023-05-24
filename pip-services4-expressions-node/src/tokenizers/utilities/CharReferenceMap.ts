/** @module tokenizers */

import { CharReferenceInterval } from './CharReferenceInterval';

/**
 * This class keeps references associated with specific characters
 */
export class CharReferenceMap<T> {
    private _initialInterval: T[];
    private _otherIntervals: CharReferenceInterval<T>[];

    public constructor() {
        this.clear();
    }

    public addDefaultInterval(reference: T): void {
        this.addInterval(0x0000, 0xfffe, reference);
    }

    public addInterval(start: number, end: number, reference: T) {
        if (start > end) {
            throw new Error("Start must be less or equal End");
        }
        end = end == 0xffff ? 0xfffe : end;

        for (let index = start; index < 0x0100 && index <= end; index++) {
            this._initialInterval[index] = reference;
        }
        if (end >= 0x0100) {
            start = start < 0x0100 ? 0x0100 : start;
            this._otherIntervals.splice(0, 0,
                new CharReferenceInterval<T>(start, end, reference));
        }
    }

    public clear(): void {
        this._initialInterval = [];
        for (let index = 0; index < 0x0100; index++) {
            this._initialInterval[index] = null;
        }
        this._otherIntervals = [];
    }

    public lookup(symbol: number): T {
        if (symbol < 0x0100) {
            return this._initialInterval[symbol];
        } else {
            for (let interval of this._otherIntervals) {
                if (interval.inRange(symbol)) {
                    return interval.reference;
                }
            }
            return null;
        }
    }
}