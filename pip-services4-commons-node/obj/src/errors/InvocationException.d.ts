import { ApplicationException } from './ApplicationException';
/**
 * Errors returned by remote services or by the network during call attempts.
 */
export declare class InvocationException extends ApplicationException {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param correlation_id    (optional) a unique transaction id to trace execution through call chain.
     * @param code              (optional) a unique error code. Default: "UNKNOWN"
     * @param message           (optional) a human-readable description of the error.
     *
     * @see [[ErrorCategory]]
     */
    constructor(correlation_id?: string, code?: string, message?: string);
}
