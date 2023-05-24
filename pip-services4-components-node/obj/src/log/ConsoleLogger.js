"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
/** @module log */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const LogLevel_1 = require("./LogLevel");
const Logger_1 = require("./Logger");
const LogLevelConverter_1 = require("./LogLevelConverter");
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
class ConsoleLogger extends Logger_1.Logger {
    /**
     * Creates a new instance of the logger.
     */
    constructor() {
        super();
    }
    /**
     * Writes a log message to the logger destination.
     *
     * @param level             a log level.
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     */
    write(level, correlationId, error, message) {
        if (this.getLevel() < level)
            return;
        let result = '[';
        result += correlationId != null ? correlationId : "---";
        result += ':';
        result += LogLevelConverter_1.LogLevelConverter.toString(level);
        result += ':';
        result += pip_services3_commons_node_1.StringConverter.toString(new Date());
        result += "] ";
        result += message;
        if (error != null) {
            if (message.length == 0) {
                result += "Error: ";
            }
            else {
                result += ": ";
            }
            result += this.composeError(error);
        }
        if (level == LogLevel_1.LogLevel.Fatal || level == LogLevel_1.LogLevel.Error || level == LogLevel_1.LogLevel.Warn) {
            console.error(result);
        }
        else {
            console.log(result);
        }
    }
}
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=ConsoleLogger.js.map