import { CachedCounters } from "pip-services4-observability-node";
export declare class CountersFixture {
    private _counters;
    constructor(counters: CachedCounters);
    testSimpleCounters(): Promise<void>;
    testMeasureElapsedTime(): Promise<void>;
}
