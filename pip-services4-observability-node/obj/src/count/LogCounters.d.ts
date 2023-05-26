/** @module count */
import { IReferenceable } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { Counter } from './Counter';
import { CachedCounters } from './CachedCounters';
/**
 * Performance counters that periodically dumps counters measurements to logger.
 *
 * ### Configuration parameters ###
 *
 * - __options:__
 *     - interval:          interval in milliseconds to save current counters measurements (default: 5 mins)
 *     - reset_timeout:     timeout in milliseconds to reset the counters. 0 disables the reset (default: 0)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>           [[ILogger]] components to dump the captured counters
 * - <code>\*:context-info:\*:\*:1.0</code>     (optional) [[ContextInfo]] to detect the context id and specify counters source
 *
 * @see [[Counter]]
 * @see [[CachedCounters]]
 * @see [[CompositeLogger]]
 *
 * ### Example ###
 *
 *     let counters = new LogCounters();
 *     counters.setReferences(References.fromTuples(
 *         new Descriptor("pip-services", "logger", "console", "default", "1.0"), new ConsoleLogger()
 *     ));
 *
 *     counters.increment("mycomponent.mymethod.calls");
 *     let timing = counters.beginTiming("mycomponent.mymethod.exec_time");
 *     try {
 *         ...
 *     } finally {
 *         timing.endTiming();
 *     }
 *
 *     counters.dump();
 */
export declare class LogCounters extends CachedCounters implements IReferenceable {
    private readonly _logger;
    /**
     * Creates a new instance of the counters.
     */
    constructor();
    /**
     * Sets references to dependent components.
     *
     * @param references     references to locate the component dependencies.
     *
     */
    setReferences(references: IReferences): void;
    private counterToString;
    /**
     * Saves the current counters measurements.
     *
     * @param counters      current counters measurements to be saves.
     */
    protected save(counters: Counter[]): void;
}
