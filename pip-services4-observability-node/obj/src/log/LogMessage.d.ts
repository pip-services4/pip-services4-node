/** @module log */
import { ErrorDescription } from 'pip-services4-commons-node';
/**
 * Data object to store captured log messages.
 * This object is used by [[CachedLogger]].
 */
export declare class LogMessage {
    /** The time then message was generated */
    time: Date;
    /** The source (context name) */
    source: string;
    /** This log level */
    level: string;
    /** The transaction id to trace execution through call chain. */
    trace_id: string;
    /**
     * The description of the captured error
     *
     * [[https://pip-services4-node.github.io/pip-services4-components-node/classes/errors.errordescription.html ErrorDescription]]
     * [[https://pip-services4-node.github.io/pip-services4-components-node/classes/errors.applicationexception.html ApplicationException]]
     */
    error: ErrorDescription;
    /** The human-readable message */
    message: string;
}
