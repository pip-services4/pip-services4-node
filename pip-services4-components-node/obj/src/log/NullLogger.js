"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullLogger = void 0;
const LogLevel_1 = require("./LogLevel");
/**
 * Dummy implementation of logger that doesn't do anything.
 *
 * It can be used in testing or in situations when logger is required
 * but shall be disabled.
 *
 * @see [[ILogger]]
 */
class NullLogger {
    /**
     * Creates a new instance of the logger.
     */
    constructor() { }
    /**
     * Gets the maximum log level.
     * Messages with higher log level are filtered out.
     *
     * @returns the maximum log level.
     */
    getLevel() { return LogLevel_1.LogLevel.None; }
    /**
     * Set the maximum log level.
     *
     * @param value     a new maximum log level.
     */
    setLevel(value) { }
    /**
     * Logs a message at specified log level.
     *
     * @param level             a log level.
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    log(level, correlationId, error, message, ...args) { }
    /**
     * Logs fatal (unrecoverable) message that caused the process to crash.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    fatal(correlationId, error, message, ...args) { }
    /**
     * Logs recoverable application error.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    error(correlationId, error, message, ...args) { }
    /**
     * Logs a warning that may or may not have a negative impact.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    warn(correlationId, message, ...args) { }
    /**
     * Logs an important information message
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    info(correlationId, message, ...args) { }
    /**
     * Logs a high-level debug information for troubleshooting.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    debug(correlationId, message, ...args) { }
    /**
     * Logs a low-level debug information for troubleshooting.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    trace(correlationId, message, ...args) { }
}
exports.NullLogger = NullLogger;
//# sourceMappingURL=NullLogger.js.map