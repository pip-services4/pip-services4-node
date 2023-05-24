import { ApplicationException } from './ApplicationException';
/**
 * Errors related to calling operations, which require the component to be in a specific state.
 *
 * For instance: business calls when the component is not ready.
 */
export declare class InvalidStateException extends ApplicationException {
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
