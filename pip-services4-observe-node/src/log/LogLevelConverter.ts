/** @module log */
import { StringConverter } from 'pip-services4-commons-node';

import { LogLevel } from './LogLevel';

/**
 * Helper class to convert log level values.
 * 
 * @see [[LogLevel]]
 */
export class LogLevelConverter {

    /**
     * Converts numbers and strings to standard log level values.
     * 
     * @param value         a value to be converted
     * @param defaultValue  a default value if conversion is not possible
     * @returns converted log level
     */
    public static toLogLevel(value: any, defaultValue: LogLevel = LogLevel.Info): LogLevel {
        if (value == null) return LogLevel.Info;

        value = StringConverter.toString(value).toUpperCase();
        if ("0" == value || "NOTHING" == value || "NONE" == value)
            return LogLevel.None;
        else if ("1" == value || "FATAL" == value)
            return LogLevel.Fatal;
        else if ("2" == value || "ERROR" == value)
            return LogLevel.Error;
        else if ("3" == value || "WARN" == value || "WARNING" == value)
            return LogLevel.Warn;
        else if ("4" == value || "INFO" == value)
            return LogLevel.Info;
        else if ("5" == value || "DEBUG" == value)
            return LogLevel.Debug;
        else if ("6" == value || "TRACE" == value)
            return LogLevel.Trace;
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
    public static toString(level: LogLevel): string {
        if (level == LogLevel.Fatal) return "FATAL";
        if (level == LogLevel.Error) return "ERROR";
        if (level == LogLevel.Warn) return "WARN";
        if (level == LogLevel.Info) return "INFO";
        if (level == LogLevel.Debug) return "DEBUG";
        if (level == LogLevel.Trace) return "TRACE";
        return "UNDEF";
    }

    /**
     * Converts log level to a number.
     * 
     * @param level     a log level to convert.
     * @returns log level number value.
     */
    public static toInteger(level: LogLevel): number {
        if (level == LogLevel.Fatal) return 1;
        if (level == LogLevel.Error) return 2;
        if (level == LogLevel.Warn) return 3;
        if (level == LogLevel.Info) return 4;
        if (level == LogLevel.Debug) return 5;
        if (level == LogLevel.Trace) return 6;
        return 0;
    }
}