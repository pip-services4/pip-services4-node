/** @module count */
import { IReconfigurable } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { ICounters } from './ICounters';
import { CounterTiming } from './CounterTiming';
import { ICounterTimingCallback } from './ICounterTimingCallback';
import { CounterType } from './CounterType';
import { Counter } from './Counter';
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
export declare abstract class CachedCounters implements ICounters, IReconfigurable, ICounterTimingCallback {
    protected _interval: number;
    protected _resetTimeout: number;
    protected _cache: {
        [id: string]: Counter;
    };
    protected _updated: boolean;
    protected _lastDumpTime: number;
    protected _lastResetTime: number;
    /**
     * Creates a new CachedCounters object.
     */
    CachedCounters(): void;
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Gets the counters dump/save interval.
     *
     * @returns the interval in milliseconds.
     */
    getInterval(): number;
    /**
     * Sets the counters dump/save interval.
     *
     * @param value    a new interval in milliseconds.
     */
    setInterval(value: number): void;
    /**
     * Saves the current counters measurements.
     *
     * @param counters      current counters measurements to be saves.
     */
    protected abstract save(counters: Counter[]): void;
    /**
     * Clears (resets) a counter specified by its name.
     *
     * @param name  a counter name to clear.
     */
    clear(name: string): void;
    /**
     * Clears (resets) all counters.
     */
    clearAll(): void;
    /**
     * Begins measurement of execution time interval.
     * It returns [[CounterTiming]] object which has to be called at
     * [[CounterTiming.endTiming]] to end the measurement and update the counter.
     *
     * @param name 	a counter name of Interval type.
     * @returns a [[CounterTiming]] callback object to end timing.
     */
    beginTiming(name: string): CounterTiming;
    /**
     * Dumps (saves) the current values of counters.
     *
     * @see [[save]]
     */
    dump(): void;
    /**
     * Makes counter measurements as updated
     * and dumps them when timeout expires.
     *
     * @see [[dump]]
     */
    protected update(): void;
    private resetIfNeeded;
    /**
     * Gets all captured counters.
     *
     * @returns a list with counters.
     */
    getAll(): Counter[];
    /**
     * Gets a counter specified by its name.
     * It counter does not exist or its type doesn't match the specified type
     * it creates a new one.
     *
     * @param name  a counter name to retrieve.
     * @param type  a counter type.
     * @returns an existing or newly created counter of the specified type.
     */
    get(name: string, type: CounterType): Counter;
    private calculateStats;
    /**
     * Ends measurement of execution elapsed time and updates specified counter.
     *
     * @param name      a counter name
     * @param elapsed   execution elapsed time in milliseconds to update the counter.
     *
     * @see [[CounterTiming.endTiming]]
     */
    endTiming(name: string, elapsed: number): void;
    /**
     * Calculates min/average/max statistics based on the current and previous values.
     *
     * @param name 		a counter name of Statistics type
     * @param value		a value to update statistics
     */
    stats(name: string, value: number): void;
    /**
     * Records the last calculated measurement value.
     *
     * Usually this method is used by metrics calculated
     * externally.
     *
     * @param name 		a counter name of Last type.
     * @param value		a last value to record.
     */
    last(name: string, value: number): void;
    /**
     * Records the current time as a timestamp.
     *
     * @param name 		a counter name of Timestamp type.
     */
    timestampNow(name: string): void;
    /**
     * Records the given timestamp.
     *
     * @param name 		a counter name of Timestamp type.
     * @param value		a timestamp to record.
     */
    timestamp(name: string, value: Date): void;
    /**
     * Increments counter by 1.
     *
     * @param name 		a counter name of Increment type.
     */
    incrementOne(name: string): void;
    /**
     * Increments counter by given value.
     *
     * @param name 		a counter name of Increment type.
     * @param value		a value to add to the counter.
     */
    increment(name: string, value: number): void;
}
