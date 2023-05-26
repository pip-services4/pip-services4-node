"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
/** @module log */
/** @hidden */
const util = require("util");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const LogLevel_1 = require("./LogLevel");
const LogLevelConverter_1 = require("./LogLevelConverter");
/**
 * Abstract logger that captures and formats log messages.
 * Child classes take the captured messages and write them to their specific destinations.
 *
 * ### Configuration parameters ###
 *
 * Parameters to pass to the [[configure]] method for component configuration:
 *
 * - level:             maximum log level to capture
 * - source:            source (context) name
 *
 * ### References ###
 *
 * - <code>\*:context-info:\*:\*:1.0</code>     (optional) [[ContextInfo]] to detect the context id and specify counters source
 *
 * @see [[ILogger]]
 */
class Logger {
    /**
     * Creates a new instance of the logger.
     */
    constructor() {
        this._level = LogLevel_1.LogLevel.Info;
        this._source = null;
        //
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._level = LogLevelConverter_1.LogLevelConverter.toLogLevel(config.getAsObject("level"), this._level);
        this._source = config.getAsStringWithDefault("source", this._source);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references     references to locate the component dependencies.
     */
    setReferences(references) {
        const contextInfo = references.getOneOptional(new pip_services4_components_node_1.Descriptor("pip-services", "context-info", "*", "*", "1.0"));
        if (contextInfo != null && this._source == null) {
            this._source = contextInfo.name;
        }
    }
    /**
     * Gets the maximum log level.
     * Messages with higher log level are filtered out.
     *
     * @returns the maximum log level.
     */
    getLevel() {
        return this._level;
    }
    /**
     * Set the maximum log level.
     *
     * @param value     a new maximum log level.
     */
    setLevel(value) {
        this._level = value;
    }
    /**
     * Gets the source (context) name.
     *
     * @returns the source (context) name.
     */
    getSource() {
        return this._source;
    }
    /**
     * Sets the source (context) name.
     *
     * @param value     a new source (context) name.
     */
    setSource(value) {
        this._source = value;
    }
    /**
     * Formats the log message and writes it to the logger destination.
     *
     * @param level             a log level.
     * @param context     (optional) a context to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    formatAndWrite(level, context, error, message, ...args) {
        message = message != null ? message : "";
        if (args != null && args.length > 0) {
            // message = message.replace(/{(\d+)}/g, function (match, number) {
            //     return typeof args[number] != 'undefined' ? args[number] : match;
            // });
            message = util.format(message, ...args);
        }
        this.write(level, context, error, message);
    }
    /**
     * Logs a message at specified log level.
     *
     * @param level             a log level.
     * @param context     (optional) a context to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    log(level, context, error, message, ...args) {
        this.formatAndWrite(level, context, error, message, ...args);
    }
    /**
     * Logs fatal (unrecoverable) message that caused the process to crash.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    fatal(context, error, message, ...args) {
        this.formatAndWrite(LogLevel_1.LogLevel.Fatal, context, error, message, ...args);
    }
    /**
     * Logs recoverable application error.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    error(context, error, message, ...args) {
        this.formatAndWrite(LogLevel_1.LogLevel.Error, context, error, message, ...args);
    }
    /**
     * Logs a warning that may or may not have a negative impact.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    warn(context, message, ...args) {
        this.formatAndWrite(LogLevel_1.LogLevel.Warn, context, null, message, ...args);
    }
    /**
     * Logs an important information message
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    info(context, message, ...args) {
        this.formatAndWrite(LogLevel_1.LogLevel.Info, context, null, message, ...args);
    }
    /**
     * Logs a high-level debug information for troubleshooting.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    debug(context, message, ...args) {
        this.formatAndWrite(LogLevel_1.LogLevel.Debug, context, null, message, ...args);
    }
    /**
     * Logs a low-level debug information for troubleshooting.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message.
     */
    trace(context, message, ...args) {
        this.formatAndWrite(LogLevel_1.LogLevel.Trace, context, null, message, ...args);
    }
    /**
     * Composes an human-readable error description
     *
     * @param error     an error to format.
     * @returns a human-reable error description.
     */
    composeError(error) {
        let builder = "";
        builder += error.message;
        const appError = error;
        if (appError.cause) {
            builder += " Caused by: ";
            builder += appError.cause;
        }
        if (error.stack) {
            builder += " Stack trace: ";
            builder += error.stack;
        }
        return builder;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map