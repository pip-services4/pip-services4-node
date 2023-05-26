"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullCounters = void 0;
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/** @module count */
const CounterTiming_1 = require("./CounterTiming");
/**
 * Dummy implementation of performance counters that doesn't do anything.
 *
 * It can be used in testing or in situations when counters is required
 * but shall be disabled.
 *
 * @see [[ICounters]]
 */
class NullCounters {
    /**
     * Creates a new instance of the counter.
     */
    constructor() { }
    /**
     * Begins measurement of execution time interval.
     * It returns [[CounterTiming]] object which has to be called at
     * [[CounterTiming.endTiming]] to end the measurement and update the counter.
     *
     * @param name     a counter name of Interval type.
     * @returns a [[CounterTiming]] callback object to end timing.
     */
    beginTiming(name) {
        return new CounterTiming_1.CounterTiming();
    }
    /**
     * Calculates min/average/max statistics based on the current and previous values.
     *
     * @param name         a counter name of Statistics type
     * @param value        a value to update statistics
     */
    stats(name, value) { }
    /**
     * Records the last calculated measurement value.
     *
     * Usually this method is used by metrics calculated
     * externally.
     *
     * @param name         a counter name of Last type.
     * @param value        a last value to record.
     */
    last(name, value) { }
    /**
     * Records the current time as a timestamp.
     *
     * @param name         a counter name of Timestamp type.
     */
    timestampNow(name) { }
    /**
     * Records the given timestamp.
     *
     * @param name         a counter name of Timestamp type.
     * @param value        a timestamp to record.
     */
    timestamp(name, value) { }
    /**
     * Increments counter by 1.
     *
     * @param name         a counter name of Increment type.
     */
    incrementOne(name) { }
    /**
     * Increments counter by given value.
     *
     * @param name         a counter name of Increment type.
     * @param value        a value to add to the counter.
     */
    increment(name, value) { }
}
exports.NullCounters = NullCounters;
//# sourceMappingURL=NullCounters.js.map