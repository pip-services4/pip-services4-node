"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevelConverter = void 0;
/** @module log */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const LogLevel_1 = require("./LogLevel");
/**
 * Helper class to convert log level values.
 *
 * @see [[LogLevel]]
 */
class LogLevelConverter {
    /**
     * Converts numbers and strings to standard log level values.
     *
     * @param value         a value to be converted
     * @param defaultValue  a default value if conversion is not possible
     * @returns converted log level
     */
    static toLogLevel(value, defaultValue = LogLevel_1.LogLevel.Info) {
        if (value == null)
            return LogLevel_1.LogLevel.Info;
        value = pip_services3_commons_node_1.StringConverter.toString(value).toUpperCase();
        if ("0" == value || "NOTHING" == value || "NONE" == value)
            return LogLevel_1.LogLevel.None;
        else if ("1" == value || "FATAL" == value)
            return LogLevel_1.LogLevel.Fatal;
        else if ("2" == value || "ERROR" == value)
            return LogLevel_1.LogLevel.Error;
        else if ("3" == value || "WARN" == value || "WARNING" == value)
            return LogLevel_1.LogLevel.Warn;
        else if ("4" == value || "INFO" == value)
            return LogLevel_1.LogLevel.Info;
        else if ("5" == value || "DEBUG" == value)
            return LogLevel_1.LogLevel.Debug;
        else if ("6" == value || "TRACE" == value)
            return LogLevel_1.LogLevel.Trace;
        else
            return defaultValue;
    }
    /**
     * Converts log level to a string.
     *
     * @param level     a log level to convert
     * @returns log level name string.
     *
     * @see [[LogLevel]]
     */
    static toString(level) {
        if (level == LogLevel_1.LogLevel.Fatal)
            return "FATAL";
        if (level == LogLevel_1.LogLevel.Error)
            return "ERROR";
        if (level == LogLevel_1.LogLevel.Warn)
            return "WARN";
        if (level == LogLevel_1.LogLevel.Info)
            return "INFO";
        if (level == LogLevel_1.LogLevel.Debug)
            return "DEBUG";
        if (level == LogLevel_1.LogLevel.Trace)
            return "TRACE";
        return "UNDEF";
    }
    /**
     * Converts log level to a number.
     *
     * @param level     a log level to convert.
     * @returns log level number value.
     */
    static toInteger(level) {
        if (level == LogLevel_1.LogLevel.Fatal)
            return 1;
        if (level == LogLevel_1.LogLevel.Error)
            return 2;
        if (level == LogLevel_1.LogLevel.Warn)
            return 3;
        if (level == LogLevel_1.LogLevel.Info)
            return 4;
        if (level == LogLevel_1.LogLevel.Debug)
            return 5;
        if (level == LogLevel_1.LogLevel.Trace)
            return 6;
        return 0;
    }
}
exports.LogLevelConverter = LogLevelConverter;
//# sourceMappingURL=LogLevelConverter.js.map