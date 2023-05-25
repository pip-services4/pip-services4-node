"use strict";
/** @module log */
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
     * @param context     (optional) a context to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    log(level, context, error, message, ...args) { }
    /**
     * Logs fatal (unrecoverable) message that caused the process to crash.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    fatal(context, error, message, ...args) { }
    /**
     * Logs recoverable application error.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    error(context, error, message, ...args) { }
    /**
     * Logs a warning that may or may not have a negative impact.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    warn(context, message, ...args) { }
    /**
     * Logs an important information message
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    info(context, message, ...args) { }
    /**
     * Logs a high-level debug information for troubleshooting.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    debug(context, message, ...args) { }
    /**
     * Logs a low-level debug information for troubleshooting.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    trace(context, message, ...args) { }
}
exports.NullLogger = NullLogger;
//# sourceMappingURL=NullLogger.js.map