/** @module count */
import { ICounterTimingCallback } from './ICounterTimingCallback';
/**
 * Callback object returned by {@link ICounters.beginTiming} to end timing
 * of execution block and update the associated counter.
 *
 * ### Example ###
 *
 *     let timing = counters.beginTiming("mymethod.exec_time");
 *     try {
 *         ...
 *     } finally {
 *         timing.endTiming();
 *     }
 *
 */
export declare class CounterTiming {
    private _start;
    private _callback;
    private _counter;
    /**
     * Creates a new instance of the timing callback object.
     *
     * @param counter 		an associated counter name
     * @param callback 		a callback that shall be called when endTiming is called.
     */
    constructor(counter?: string, callback?: ICounterTimingCallback);
    /**
     * Ends timing of an execution block, calculates elapsed time
     * and updates the associated counter.
     */
    endTiming(): void;
}
