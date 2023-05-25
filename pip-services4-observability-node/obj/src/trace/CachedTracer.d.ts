/** @module trace */
import { IContext } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { IReferenceable } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { IReconfigurable } from 'pip-services4-components-node';
import { ITracer } from './ITracer';
import { TraceTiming } from './TraceTiming';
import { OperationTrace } from './OperationTrace';
/**
 * Abstract tracer that caches recorded traces in memory and periodically dumps them.
 * Child classes implement saving cached traces to their specified destinations.
 *
 * ### Configuration parameters ###
 *
 * - source:            source (context) name
 * - options:
 *     - interval:        interval in milliseconds to save log messages (default: 10 seconds)
 *     - max_cache_size:  maximum number of messages stored in this cache (default: 100)
 *
 * ### References ###
 *
 * - <code>\*:context-info:\*:\*:1.0</code>     (optional) [[ContextInfo]] to detect the context id and specify counters source
 *
 * @see [[ITracer]]
 * @see [[OperationTrace]]
 */
export declare abstract class CachedTracer implements ITracer, IReconfigurable, IReferenceable {
    protected _source: string;
    protected _cache: OperationTrace[];
    protected _updated: boolean;
    protected _lastDumpTime: number;
    protected _maxCacheSize: number;
    protected _interval: number;
    /**
     * Creates a new instance of the logger.
     */
    constructor();
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Writes a log message to the logger destination.
     *
      * @param context     (optional) a context to trace execution through call chain.
      * @param component         a name of called component
      * @param operation         a name of the executed operation.
      * @param error             an error object associated with this trace.
      * @param duration          execution duration in milliseconds.
     */
    protected write(context: IContext, component: string, operation: string, error: Error, duration: number): void;
    /**
     * Records an operation trace with its name and duration
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation.
     * @param duration          execution duration in milliseconds.
     */
    trace(context: IContext, component: string, operation: string, duration: number): void;
    /**
     * Records an operation failure with its name, duration and error
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation.
     * @param error             an error object associated with this trace.
     * @param duration          execution duration in milliseconds.
     */
    failure(context: IContext, component: string, operation: string, error: Error, duration: number): void;
    /**
     * Begings recording an operation trace
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation.
     * @returns                 a trace timing object.
     */
    beginTrace(context: IContext, component: string, operation: string): TraceTiming;
    /**
     * Saves log messages from the cache.
     *
     * @param messages  a list with log messages
     * @param callback  callback function that receives error or null for success.
     */
    protected abstract save(messages: OperationTrace[], callback: (err: any) => void): void;
    /**
     * Clears (removes) all cached log messages.
     */
    clear(): void;
    /**
     * Dumps (writes) the currently cached log messages.
     *
     * @see [[write]]
     */
    dump(): void;
    /**
     * Makes trace cache as updated
     * and dumps it when timeout expires.
     *
     * @see [[dump]]
     */
    protected update(): void;
}
