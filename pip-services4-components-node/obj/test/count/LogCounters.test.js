"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const LogCounters_1 = require("../../src/count/LogCounters");
const CounterType_1 = require("../../src/count/CounterType");
const NullLogger_1 = require("../../src/log/NullLogger");
suite('LogCounters', () => {
    let _counters;
    setup(() => {
        let log = new NullLogger_1.NullLogger();
        let refs = pip_services3_commons_node_1.References.fromTuples(new pip_services3_commons_node_2.Descriptor("pip-services", "logger", "null", "default", "1.0"), log);
        _counters = new LogCounters_1.LogCounters();
        _counters.setReferences(refs);
    });
    test('Simple Counters', () => {
        let counters = _counters;
        counters.last("Test.LastValue", 123);
        counters.last("Test.LastValue", 123456);
        let counter = counters.get("Test.LastValue", CounterType_1.CounterType.LastValue);
        assert.isNotNull(counter);
        assert.isNotNull(counter.last);
        assert.equal(counter.last, 123456, 3);
        counters.incrementOne("Test.Increment");
        counters.increment("Test.Increment", 3);
        counter = counters.get("Test.Increment", CounterType_1.CounterType.Increment);
        assert.isNotNull(counter);
        assert.equal(counter.count, 4);
        counters.timestampNow("Test.Timestamp");
        counters.timestampNow("Test.Timestamp");
        counter = counters.get("Test.Timestamp", CounterType_1.CounterType.Timestamp);
        assert.isNotNull(counter);
        assert.isNotNull(counter.time);
        counters.stats("Test.Statistics", 1);
        counters.stats("Test.Statistics", 2);
        counters.stats("Test.Statistics", 3);
        counter = counters.get("Test.Statistics", CounterType_1.CounterType.Statistics);
        assert.isNotNull(counter);
        assert.equal(counter.average, 2, 3);
        counters.dump();
    });
    test('Measure Elapsed Time', (done) => {
        let timer = _counters.beginTiming("Test.Elapsed");
        setTimeout(function () {
            timer.endTiming();
            let counter = _counters.get("Test.Elapsed", CounterType_1.CounterType.Interval);
            console.log(counter.last);
            assert.isTrue(counter.last > 50);
            assert.isTrue(counter.last < 5000);
            _counters.dump();
            done();
        }, 100);
    });
});
//# sourceMappingURL=LogCounters.test.js.map