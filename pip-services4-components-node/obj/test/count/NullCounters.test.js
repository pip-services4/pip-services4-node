"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NullCounters_1 = require("../../src/count/NullCounters");
suite('NullCounters', () => {
    test('Simple Counters', () => {
        let counters = new NullCounters_1.NullCounters();
        counters.last("Test.LastValue", 123);
        counters.increment("Test.Increment", 3);
        counters.stats("Test.Statistics", 123);
    });
    test('Measure Elapsed Time', () => {
        let counters = new NullCounters_1.NullCounters();
        let timer = counters.beginTiming("Test.Elapsed");
        timer.endTiming();
    });
});
//# sourceMappingURL=NullCounters.test.js.map