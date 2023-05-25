import { ApplicationException } from './ApplicationException';
/**
 * Errors caused by attempts to access missing objects.
 */
export declare class NotFoundException extends ApplicationException {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param trace_id    (optional) a unique transaction id to trace execution through call chain.
     * @param code              (optional) a unique error code. Default: "UNKNOWN"
     * @param message           (optional) a human-readable description of the error.
     *
     * @see [[ErrorCategory]]
     */
    constructor(trace_id?: string, code?: string, message?: string);
}
