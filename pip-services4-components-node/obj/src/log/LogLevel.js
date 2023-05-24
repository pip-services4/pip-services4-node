"use strict";
/** @module log */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
/**
 * Standard log levels.
 *
 * Logs at debug and trace levels are usually captured
 * only locally for troubleshooting
 * and never sent to consolidated log services.
 */
var LogLevel;
(function (LogLevel) {
    /** Nothing to log */
    LogLevel[LogLevel["None"] = 0] = "None";
    /** Log only fatal errors that cause processes to crash */
    LogLevel[LogLevel["Fatal"] = 1] = "Fatal";
    /** Log all errors. */
    LogLevel[LogLevel["Error"] = 2] = "Error";
    /** Log errors and warnings */
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    /** Log errors and important information messages */
    LogLevel[LogLevel["Info"] = 4] = "Info";
    /** Log everything except traces */
    LogLevel[LogLevel["Debug"] = 5] = "Debug";
    /** Log everything. */
    LogLevel[LogLevel["Trace"] = 6] = "Trace";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
//# sourceMappingURL=LogLevel.js.map