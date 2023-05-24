import { LogLevel } from './LogLevel';
/**
 * Helper class to convert log level values.
 *
 * @see [[LogLevel]]
 */
export declare class LogLevelConverter {
    /**
     * Converts numbers and strings to standard log level values.
     *
     * @param value         a value to be converted
     * @param defaultValue  a default value if conversion is not possible
     * @returns converted log level
     */
    static toLogLevel(value: any, defaultValue?: LogLevel): LogLevel;
    /**
     * Converts log level to a string.
     *
     * @param level     a log level to convert
     * @returns log level name string.
     *
     * @see [[LogLevel]]
     */
    static toString(level: LogLevel): string;
    /**
     * Converts log level to a number.
     *
     * @param level     a log level to convert.
     * @returns log level number value.
     */
    static toInteger(level: LogLevel): number;
}
