import { LogLevel } from './LogLevel';
import { Logger } from './Logger';
/**
 * Logger that writes log messages to console.
 *
 * Errors are written to standard err stream
 * and all other messages to standard out stream.
 *
 * ### Configuration parameters ###
 *
 * - level:             maximum log level to capture
 * - source:            source (context) name
 *
 * ### References ###
 *
 * - <code>\*:context-info:\*:\*:1.0</code>     (optional) [[ContextInfo]] to detect the context id and specify counters source
 *
 * @see [[Logger]]
 *
 * ### Example ###
 *
 *     let logger = new ConsoleLogger();
 *     logger.setLevel(LogLevel.debug);
 *
 *     logger.error("123", ex, "Error occured: %s", ex.message);
 *     logger.debug("123", "Everything is OK.");
 */
export declare class ConsoleLogger extends Logger {
    /**
     * Creates a new instance of the logger.
     */
    constructor();
    /**
     * Writes a log message to the logger destination.
     *
     * @param level             a log level.
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     */
    protected write(level: LogLevel, correlationId: string, error: Error, message: string): void;
}
