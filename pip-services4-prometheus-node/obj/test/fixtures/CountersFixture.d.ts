import { CachedCounters } from 'pip-services4-components-node';
export declare class CountersFixture {
    private _counters;
    constructor(counters: CachedCounters);
    testSimpleCounters(): Promise<void>;
    testMeasureElapsedTime(): Promise<void>;
}
