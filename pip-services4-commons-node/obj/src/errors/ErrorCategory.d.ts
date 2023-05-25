/** @module errors */
/**
 * Defines standard error categories to application exceptions
 * supported by PipServices toolkit.
 */
export declare class ErrorCategory {
    /**
     * Unknown or unexpected errors.
     */
    static readonly Unknown: string;
    /**
     * Internal errors caused by programming mistakes.
     */
    static readonly Internal: string;
    /**
     * Errors related to mistakes in user-defined configurations.
     */
    static readonly Misconfiguration: string;
    /**
     * Errors caused by incorrect object state..
     *
     * For example: business calls when the component is not ready.
     */
    static readonly InvalidState: string;
    /**
     * Errors caused by remote calls timeouted and not returning results.
     * It allows to clearly separate communication related problems
     * from other application errors.
     */
    static readonly NoResponse: string;
    /**
     * Errors caused by remote calls failed due to unidenfied reasons.
     */
    static readonly FailedInvocation: string;
    /**
     * Errors in read/write local disk operations.
     */
    static readonly FileError: string;
    /**
     * Errors due to incorrectly specified invocation parameters.
     *
     * For example: missing or incorrect parameters.
     */
    static readonly BadRequest: string;
    /**
     * Access errors caused by missing user identity (authentication error)
     * or incorrect security permissions (authorization error).
     */
    static readonly Unauthorized: string;
    /**
     * Errors caused by attempts to access missing objects.
     */
    static readonly NotFound: string;
    /**
     * Errors raised by conflicts between object versions that were
     * posted by the user and those that are stored on the server.
     */
    static readonly Conflict: string;
    /**
     * Errors caused by calls to unsupported or not yet implemented functionality.
     */
    static readonly Unsupported: string;
}
