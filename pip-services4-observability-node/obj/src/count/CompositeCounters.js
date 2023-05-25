"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeCounters = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const CounterTiming_1 = require("./CounterTiming");
/**
 * Aggregates all counters from component references under a single component.
 *
 * It allows to capture metrics and conveniently send them to multiple destinations.
 *
 * ### References ###
 *
 * - <code>\*:counters:\*:\*:1.0</code>     (optional) [[ICounters]] components to pass collected measurements
 *
 * @see [[ICounters]]
 *
 * ### Example ###
 *
 *     class MyComponent implements IReferenceable {
 *         private _counters: CompositeCounters = new CompositeCounters();
 *
 *         public setReferences(references: IReferences): void {
 *             this._counters.setReferences(references);
 *             ...
 *         }
 *
 *         public myMethod(): void {
 *             this._counters.increment("mycomponent.mymethod.calls");
 *             var timing = this._counters.beginTiming("mycomponent.mymethod.exec_time");
 *             try {
 *                 ...
 *             } finally {
 *                 timing.endTiming();
 *             }
 *         }
 *     }
 *
 */
class CompositeCounters {
    constructor() {
        this._counters = [];
    }
    /**
     * Creates a new instance of the counters.
     *
     * @param references 	references to locate the component dependencies.
     */
    CompositeCounters(references = null) {
        if (references != null) {
            this.setReferences(references);
        }
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        let counters = references.getOptional(new pip_services4_components_node_1.Descriptor(null, "counters", null, null, null));
        for (let i = 0; i < counters.length; i++) {
            let counter = counters[i];
            if (counter != this) {
                this._counters.push(counter);
            }
        }
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
     * Ends measurement of execution elapsed time and updates specified counter.
     *
     * @param name      a counter name
     * @param elapsed   execution elapsed time in milliseconds to update the counter.
     *
     * @see [[CounterTiming.endTiming]]
     */
    endTiming(name, elapsed) {
        for (let i = 0; i < this._counters.length; i++) {
            let counter = this._counters[i];
            let callback = counter;
            if (callback != null) {
                callback.endTiming(name, elapsed);
            }
        }
    }
    /**
     * Calculates min/average/max statistics based on the current and previous values.
     *
     * @param name 		a counter name of Statistics type
     * @param value		a value to update statistics
     */
    stats(name, value) {
        for (let i = 0; i < this._counters.length; i++) {
            this._counters[i].stats(name, value);
        }
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
        for (let i = 0; i < this._counters.length; i++) {
            this._counters[i].last(name, value);
        }
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
        for (let i = 0; i < this._counters.length; i++) {
            this._counters[i].timestamp(name, value);
        }
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
        if (name == null || name == "") {
            throw new Error("Name cannot be null");
        }
        for (let i = 0; i < this._counters.length; i++) {
            this._counters[i].increment(name, value);
        }
    }
}
exports.CompositeCounters = CompositeCounters;
//# sourceMappingURL=CompositeCounters.js.map