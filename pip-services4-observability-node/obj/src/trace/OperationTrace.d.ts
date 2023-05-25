/** @module trace */
import { ErrorDescription } from 'pip-services4-commons-node';
/**
 * Data object to store captured operation traces.
 * This object is used by [[CachedTracer]].
 */
export declare class OperationTrace {
    /** The time when operation was executed */
    time: Date;
    /** The source (context name) */
    source: string;
    /** The name of component */
    component: string;
    /** The name of the executed operation */
    operation: string;
    /** The transaction id to trace execution through call chain. */
    trace_id: string;
    /** The duration of the operation in milliseconds */
    duration: number;
    /**
     * The description of the captured error
     *
     * [[https://pip-services4-node.github.io/pip-services4-components-node/classes/errors.errordescription.html ErrorDescription]]
     * [[https://pip-services4-node.github.io/pip-services4-components-node/classes/errors.applicationexception.html ApplicationException]]
     */
    error: ErrorDescription;
}
