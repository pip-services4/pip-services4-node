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
export class CounterTiming {
    private _start: number;
    private _callback: ICounterTimingCallback;
    private _counter: string;

    /**
     * Creates a new instance of the timing callback object.
     * 
     * @param counter         an associated counter name
     * @param callback         a callback that shall be called when endTiming is called.
     */
    public constructor(counter: string = null, callback: ICounterTimingCallback = null) {
        this._counter = counter;
        this._callback = callback;
        this._start = new Date().getTime();
    }

    /**
     * Ends timing of an execution block, calculates elapsed time
     * and updates the associated counter.
     */
    public endTiming(): void {
        if (this._callback != null) {
            const elapsed: number = new Date().getTime() - this._start;
            this._callback.endTiming(this._counter, elapsed);
        }
    }
}