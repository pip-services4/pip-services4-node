/** @module count */
import { IReconfigurable } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';

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
export abstract class CachedCounters implements ICounters, IReconfigurable, ICounterTimingCallback {
    protected _interval: number = 300000;
    protected _resetTimeout: number = 0;
    protected _cache: { [id: string]: Counter } = {};
    protected _updated: boolean;
    protected _lastDumpTime: number = new Date().getTime();
    protected _lastResetTime: number = new Date().getTime();

    /**
     * Creates a new CachedCounters object.
     */
    public CachedCounters() { }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
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
    public getInterval() {
        return this._interval;
    }

    /**
     * Sets the counters dump/save interval.
     * 
     * @param value    a new interval in milliseconds.
     */
    public setInterval(value: number) {
        this._interval = value;
    }

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
    public clear(name: string): void {
        delete this._cache[name];
    }

    /**
     * Clears (resets) all counters. 
     */
    public clearAll(): void {
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
    public beginTiming(name: string): CounterTiming {
        return new CounterTiming(name, this);
    }

    /**
     * Dumps (saves) the current values of counters.
     * 
     * @see [[save]]
     */
    public dump(): void {
        if (!this._updated) return;

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
    protected update(): void {
        this._updated = true;
        if (new Date().getTime() > this._lastDumpTime + this.getInterval()) {
            try {
                this.dump();
            } catch (ex) {
                // Todo: decide what to do
            }
        }
    }

    private resetIfNeeded(): void {
        if (this._resetTimeout == 0) return;

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
    public getAll(): Counter[] {
        let result: Counter[] = [];

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
    public get(name: string, type: CounterType): Counter {
        if (name == null || name == "") {
            throw new Error("Name cannot be null");
        }

        this.resetIfNeeded();

        let counter: Counter = this._cache[name];

        if (counter == null || counter.type != type) {
            counter = new Counter(name, type);
            this._cache[name] = counter;
        }

        return counter;
    }

    private calculateStats(counter: Counter, value: number): void {
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
    public endTiming(name: string, elapsed: number): void {
        let counter: Counter = this.get(name, CounterType.Interval);
        this.calculateStats(counter, elapsed);
        this.update();
    }

    /**
	 * Calculates min/average/max statistics based on the current and previous values.
	 * 
	 * @param name 		a counter name of Statistics type
	 * @param value		a value to update statistics
	 */
    public stats(name: string, value: number): void {
        let counter: Counter = this.get(name, CounterType.Statistics);
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
    public last(name: string, value: number): void {
        let counter: Counter = this.get(name, CounterType.LastValue);
        counter.last = value;
        this.update();
    }

    /**
	 * Records the current time as a timestamp.
	 * 
	 * @param name 		a counter name of Timestamp type.
	 */
    public timestampNow(name: string): void {
        this.timestamp(name, new Date());
    }

    /**
	 * Records the given timestamp.
	 * 
	 * @param name 		a counter name of Timestamp type.
	 * @param value		a timestamp to record.
	 */
    public timestamp(name: string, value: Date): void {
        let counter: Counter = this.get(name, CounterType.Timestamp);
        counter.time = value;
        this.update();
    }

    /**
	 * Increments counter by 1.
	 * 
	 * @param name 		a counter name of Increment type.
	 */
    public incrementOne(name: string): void {
        this.increment(name, 1);
    }

    /**
	 * Increments counter by given value.
	 * 
	 * @param name 		a counter name of Increment type.
	 * @param value		a value to add to the counter.
	 */
    public increment(name: string, value: number): void {
        let counter: Counter = this.get(name, CounterType.Increment);
        counter.count = counter.count ? counter.count + value : value;
        this.update();
    }

}