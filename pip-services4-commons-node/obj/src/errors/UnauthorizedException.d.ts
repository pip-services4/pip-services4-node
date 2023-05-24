import { ApplicationException } from './ApplicationException';
/**
 * Access errors caused by missing user identity (authentication error) or incorrect security permissions (authorization error).
 */
export declare class UnauthorizedException extends ApplicationException {
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
