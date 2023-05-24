/** @module count */
/**
 * Interface for a callback to end measurement of execution elapsed time.
 *
 * @see [[CounterTiming]]
 */
export interface ICounterTimingCallback {
    /**
     * Ends measurement of execution elapsed time and updates specified counter.
     *
     * @param name      a counter name
     * @param elapsed   execution elapsed time in milliseconds to update the counter.
     *
     * @see [[CounterTiming.endTiming]]
     */
    endTiming(name: string, elapsed: number): void;
}
