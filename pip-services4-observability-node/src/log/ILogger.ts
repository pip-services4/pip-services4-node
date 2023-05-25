/** @module log */
import { LogLevel } from './LogLevel';

// Todo: solve issue with overloaded methods. Look at Python implementation
/**
 * Interface for logger components that capture execution log messages.
 */
export interface ILogger {
    /**
     * Gets the maximum log level. 
     * Messages with higher log level are filtered out.
     * 
     * @returns the maximum log level.
     */
    getLevel(): LogLevel;
    
    /**
     * Set the maximum log level.
     * 
     * @param value     a new maximum log level.
     */
    setLevel(value: LogLevel): void;
    
    /**
     * Logs a message at specified log level.
     * 
     * @param level             a log level.
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message. 
     */
    log(level: LogLevel, context: IContext, error: Error, message: string, ...args: any[]) : void;

    /**
     * Logs fatal (unrecoverable) message that caused the process to crash.
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message. 
     */
    fatal(context: IContext, error: Error, message: string, ...args: any[]) : void;
    // Todo: these overloads are not supported in TS
    //fatal(context: IContext, error: Error) : void;
    //fatal(context: IContext, message: string, ...args: any[]) : void;

    /**
     * Logs recoverable application error.
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message. 
     */
    error(context: IContext, error: Error, message: string, ...args: any[]) : void;
    // Todo: these overloads are not supported in TS
    //error(context: IContext, error: Error) : void;
    //error(context: IContext, message: string, ...args: any[]) : void;    

    /**
     * Logs a warning that may or may not have a negative impact.
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message. 
     */
    warn(context: IContext, message: string, ...args: any[]) : void;

    /**
     * Logs an important information message
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message. 
     */
    info(context: IContext, message: string, ...args: any[]) : void;

    /**
     * Logs a high-level debug information for troubleshooting.
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message. 
     */
    debug(context: IContext, message: string, ...args: any[]) : void;

    /**
     * Logs a low-level debug information for troubleshooting. 
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param message           a human-readable message to log.
     * @param args              arguments to parameterize the message. 
     */
    trace(context: IContext, message: string, ...args: any[]) : void;
}