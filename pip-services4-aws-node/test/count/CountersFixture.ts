import { CachedCounters, CounterType } from "pip-services4-observability-node";

const assert = require('chai').assert;



async function sleep(timeout: number) {
    return new Promise(res => {
        setTimeout(_ => res, timeout);
    });
}

export class CountersFixture {
    private _counters: CachedCounters;

    public constructor(counters: CachedCounters) {
        this._counters = counters;
    }

    public async testSimpleCounters() {
        this._counters.last("Test.LastValue", 123);
        this._counters.last("Test.LastValue", 123456);

        var counter = this._counters.get("Test.LastValue", CounterType.LastValue);
        assert.isNotNull(counter);
        assert.isNotNull(counter.last);
        assert.equal(counter.last, 123456, 3);

        this._counters.incrementOne("Test.Increment");
        this._counters.increment("Test.Increment", 3);

        counter = this._counters.get("Test.Increment", CounterType.Increment);
        assert.isNotNull(counter);
        assert.equal(counter.count, 4);

        this._counters.timestampNow("Test.Timestamp");
        this._counters.timestampNow("Test.Timestamp");

        counter = this._counters.get("Test.Timestamp", CounterType.Timestamp);
        assert.isNotNull(counter);
        assert.isNotNull(counter.time);

        this._counters.stats("Test.Statistics", 1);
        this._counters.stats("Test.Statistics", 2);
        this._counters.stats("Test.Statistics", 3);

        counter = this._counters.get("Test.Statistics", CounterType.Statistics);
        assert.isNotNull(counter);
        assert.equal(counter.average, 2, 3);

        this._counters.dump();

        await sleep(1000);
    }

    public async testMeasureElapsedTime() {
        let timer = this._counters.beginTiming("Test.Elapsed");

        await sleep(100);
        timer.endTiming();

        let counter = this._counters.get("Test.Elapsed", CounterType.Interval);
        assert.isTrue(counter.last > 50);
        assert.isTrue(counter.last < 5000);

        this._counters.dump();

        await sleep(1000);
    }
    
}