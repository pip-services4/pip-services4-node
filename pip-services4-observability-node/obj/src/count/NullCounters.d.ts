/** @module count */
import { CounterTiming } from './CounterTiming';
import { ICounters } from './ICounters';
/**
 * Dummy implementation of performance counters that doesn't do anything.
 *
 * It can be used in testing or in situations when counters is required
 * but shall be disabled.
 *
 * @see [[ICounters]]
 */
export declare class NullCounters implements ICounters {
    /**
     * Creates a new instance of the counter.
     */
    NullCounters(): void;
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
