/** @module count */
import { CounterType } from './CounterType';
/**
 * Data object to store measurement for a performance counter.
 * This object is used by [[CachedCounters]] to store counters.
 */
export declare class Counter {
    /** The counter unique name */
    name: string;
    /** The counter type that defines measurement algorithm */
    type: CounterType;
    /** The last recorded value */
    last: number;
    /** The total count */
    count: number;
    /** The minimum value */
    min: number;
    /** The maximum value */
    max: number;
    /** The average value */
    average: number;
    /** The recorded timestamp */
    time: Date;
    /**
     * Creates a instance of the data obejct
     *
     * @param name      a counter name.
     * @param type      a counter type.
     */
    constructor(name: string, type: CounterType);
}
