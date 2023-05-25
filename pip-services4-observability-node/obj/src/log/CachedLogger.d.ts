/** @module log */
import { IContext } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { LogLevel } from './LogLevel';
import { Logger } from './Logger';
import { LogMessage } from './LogMessage';
/**
 * Abstract logger that caches captured log messages in memory and periodically dumps them.
 * Child classes implement saving cached messages to their specified destinations.
 *
 * ### Configuration parameters ###
 *
 * - level:             maximum log level to capture
 * - source:            source (context) name
 * - options:
 *     - interval:        interval in milliseconds to save log messages (default: 10 seconds)
 *     - max_cache_size:  maximum number of messages stored in this cache (default: 100)
 *
 * ### References ###
 *
 * - <code>\*:context-info:\*:\*:1.0</code>     (optional) [[ContextInfo]] to detect the context id and specify counters source
 *
 * @see [[ILogger]]
 * @see [[Logger]]
 * @see [[LogMessage]]
 */
export declare abstract class CachedLogger extends Logger {
    protected _cache: LogMessage[];
    protected _updated: boolean;
    protected _lastDumpTime: number;
    protected _maxCacheSize: number;
    protected _interval: number;
    /**
     * Creates a new instance of the logger.
     */
    constructor();
    /**
     * Writes a log message to the logger destination.
     *
     * @param level             a log level.
     * @param context     (optional) a context to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     */
    protected write(level: LogLevel, context: IContext, error: Error, message: string): void;
    /**
     * Saves log messages from the cache.
     *
     * @param messages  a list with log messages
     * @param callback  callback function that receives error or null for success.
     */
    protected abstract save(messages: LogMessage[]): Promise<void>;
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
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
     * Makes message cache as updated
     * and dumps it when timeout expires.
     *
     * @see [[dump]]
     */
    protected update(): void;
}
