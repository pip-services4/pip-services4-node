/** @module errors */
/**
 * Serializeable error description. It is use to pass information about errors
 * between microservices implemented in different languages. On the receiving side
 * [[ErrorDescription]] is used to recreate exception object close to its original type
 * without missing additional details.
 *
 * @see [[ApplicationException]]
 * @see [[ApplicationExceptionFactory]]
 */
export declare class ErrorDescription {
    /** Data type of the original error */
    type: string;
    /** Standard error category */
    category: string;
    /** HTTP status code associated with this error type */
    status: number;
    /** A unique error code */
    code: string;
    /** A human-readable error description (usually written in English) */
    message: string;
    /** A map with additional details that can be used to restore error description in other languages */
    details: any;
    /** A unique transaction id to trace execution throug call chain */
    correlation_id: string;
    /** Original error wrapped by this exception */
    cause: string;
    /** Stack trace of the exception */
    stack_trace: string;
}
