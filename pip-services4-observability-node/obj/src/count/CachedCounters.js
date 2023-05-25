"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedCounters = void 0;
const CounterTiming_1 = require("./CounterTiming");
const CounterType_1 = require("./CounterType");
const Counter_1 = require("./Counter");
/**
 * Abstract implementation of performance counters that measures and stores counters in memory.
 * Child classes implement saving of the counters into various destinations.
 *
 * ### Configuration parameters ###
 *
 * - options:
 *     - interval:        interval in milliseconds to save current counters measurements
 *     (default: 5 mins)
 *     - reset_timeout:   timeout in milliseconds to reset the counters. 0 disables the reset
 *     (default: 0)
 */
class CachedCounters {
    constructor() {
        this._interval = 300000;
        this._resetTimeout = 0;
        this._cache = {};
        this._lastDumpTime = new Date().getTime();
        this._lastResetTime = new Date().getTime();
    }
    /**
     * Creates a new CachedCounters object.
     */
    CachedCounters() { }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._interval = config.getAsLongWithDefault("interval", this._interval);
        this._interval = config.getAsLongWithDefault("options.interval", this._interval);
        this._resetTimeout = config.getAsLongWithDefault("reset_timeout", this._resetTimeout);
        this._resetTimeout = config.getAsLongWithDefault("options.reset_timeout", this._resetTimeout);
    }
    /**
     * Gets the counters dump/save interval.
     *
     * @returns the interval in milliseconds.
     */
    getInterval() {
        return this._interval;
    }
    /**
     * Sets the counters dump/save interval.
     *
     * @param value    a new interval in milliseconds.
     */
    setInterval(value) {
        this._interval = value;
    }
    /**
     * Clears (resets) a counter specified by its name.
     *
     * @param name  a counter name to clear.
     */
    clear(name) {
        delete this._cache[name];
    }
    /**
     * Clears (resets) all counters.
     */
    clearAll() {
        this._cache = {};
        this._updated = false;
    }
    /**
     * Begins measurement of execution time interval.
     * It returns [[CounterTiming]] object which has to be called at
     * [[CounterTiming.endTiming]] to end the measurement and update the counter.
     *
     * @param name 	a counter name of Interval type.
     * @returns a [[CounterTiming]] callback object to end timing.
     */
    beginTiming(name) {
        return new CounterTiming_1.CounterTiming(name, this);
    }
    /**
     * Dumps (saves) the current values of counters.
     *
     * @see [[save]]
     */
    dump() {
        if (!this._updated)
            return;
        let counters = this.getAll();
        this.save(counters);
        this._updated = false;
        this._lastDumpTime = new Date().getTime();
    }
    /**
     * Makes counter measurements as updated
     * and dumps them when timeout expires.
     *
     * @see [[dump]]
     */
    update() {
        this._updated = true;
        if (new Date().getTime() > this._lastDumpTime + this.getInterval()) {
            try {
                this.dump();
            }
            catch (ex) {
                // Todo: decide what to do
            }
        }
    }
    resetIfNeeded() {
        if (this._resetTimeout == 0)
            return;
        let now = new Date().getTime();
        if (now - this._lastResetTime > this._resetTimeout) {
            this._cache = {};
            this._updated = false;
            this._lastResetTime = now;
        }
    }
    /**
     * Gets all captured counters.
     *
     * @returns a list with counters.
     */
    getAll() {
        let result = [];
        this.resetIfNeeded();
        for (let key in this._cache) {
            result.push(this._cache[key]);
        }
        return result;
    }
    /**
     * Gets a counter specified by its name.
     * It counter does not exist or its type doesn't match the specified type
     * it creates a new one.
     *
     * @param name  a counter name to retrieve.
     * @param type  a counter type.
     * @returns an existing or newly created counter of the specified type.
     */
    get(name, type) {
        if (name == null || name == "") {
            throw new Error("Name cannot be null");
        }
        this.resetIfNeeded();
        let counter = this._cache[name];
        if (counter == null || counter.type != type) {
            counter = new Counter_1.Counter(name, type);
            this._cache[name] = counter;
        }
        return counter;
    }
    calculateStats(counter, value) {
        if (counter == null) {
            throw new Error("Counter cannot be null");
        }
        counter.last = value;
        counter.count = counter.count != null ? counter.count + 1 : 1;
        counter.max = counter.max != null ? Math.max(counter.max, value) : value;
        counter.min = counter.min != null ? Math.min(counter.min, value) : value;
        counter.average = (counter.average != null && counter.count > 1
            ? (counter.average * (counter.count - 1) + value) / counter.count : value);
    }
    /**
     * Ends measurement of execution elapsed time and updates specified counter.
     *
     * @param name      a counter name
     * @param elapsed   execution elapsed time in milliseconds to update the counter.
     *
     * @see [[CounterTiming.endTiming]]
     */
    endTiming(name, elapsed) {
        let counter = this.get(name, CounterType_1.CounterType.Interval);
        this.calculateStats(counter, elapsed);
        this.update();
    }
    /**
     * Calculates min/average/max statistics based on the current and previous values.
     *
     * @param name 		a counter name of Statistics type
     * @param value		a value to update statistics
     */
    stats(name, value) {
        let counter = this.get(name, CounterType_1.CounterType.Statistics);
        this.calculateStats(counter, value);
        this.update();
    }
    /**
     * Records the last calculated measurement value.
     *
     * Usually this method is used by metrics calculated
     * externally.
     *
     * @param name 		a counter name of Last type.
     * @param value		a last value to record.
     */
    last(name, value) {
        let counter = this.get(name, CounterType_1.CounterType.LastValue);
        counter.last = value;
        this.update();
    }
    /**
     * Records the current time as a timestamp.
     *
     * @param name 		a counter name of Timestamp type.
     */
    timestampNow(name) {
        this.timestamp(name, new Date());
    }
    /**
     * Records the given timestamp.
     *
     * @param name 		a counter name of Timestamp type.
     * @param value		a timestamp to record.
     */
    timestamp(name, value) {
        let counter = this.get(name, CounterType_1.CounterType.Timestamp);
        counter.time = value;
        this.update();
    }
    /**
     * Increments counter by 1.
     *
     * @param name 		a counter name of Increment type.
     */
    incrementOne(name) {
        this.increment(name, 1);
    }
    /**
     * Increments counter by given value.
     *
     * @param name 		a counter name of Increment type.
     * @param value		a value to add to the counter.
     */
    increment(name, value) {
        let counter = this.get(name, CounterType_1.CounterType.Increment);
        counter.count = counter.count ? counter.count + value : value;
        this.update();
    }
}
exports.CachedCounters = CachedCounters;
//# sourceMappingURL=CachedCounters.js.map