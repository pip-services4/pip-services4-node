"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationException = void 0;
/** @module errors */
const ErrorCategory_1 = require("./ErrorCategory");
const StringValueMap_1 = require("../data/StringValueMap");
/**
 * Defines a base class to defive various application exceptions.
 *
 * Most languages have own definition of base exception (error) types.
 * However, this class is implemented symmetrically in all languages
 * supported by PipServices toolkit. It allows to create portable implementations
 * and support proper error propagation in microservices calls.
 *
 * Error propagation means that when microservice implemented in one language
 * calls microservice(s) implemented in a different language(s), errors are returned
 * throught the entire call chain and restored in their original (or close) type.
 *
 * Since number of potential exception types is endless, PipServices toolkit
 * supports only 12 standard categories of exceptions defined in [[ErrorCategory]].
 * This [[ApplicationException]] class acts as a basis for
 * all other 12 standard exception types.
 *
 * Most exceptions have just free-form message that describes occured error.
 * That may not be sufficient to create meaninful error descriptions.
 * The [[ApplicationException]] class proposes an extended error definition
 * that has more standard fields:
 *
 * - message: is a human-readable error description
 * - category: one of 12 standard error categories of errors
 * - status: numeric HTTP status code for REST invocations
 * - code: a unique error code, usually defined as "MY_ERROR_CODE"
 * - correlation_id: a unique transaction id to trace execution through a call chain
 * - details: map with error parameters that can help to recreate meaningful error description in other languages
 * - stack_trace: a stack trace
 * - cause: original error that is wrapped by this exception
 *
 * ApplicationException class is not serializable. To pass errors through the wire
 * it is converted into [[ErrorDescription]] object and restored on receiving end into
 * identical exception type.
 *
 * @see [[ErrorCategory]]
 * @see [[ErrorDescription]]
 */
class ApplicationException extends Error {
    /**
     * Creates a new instance of application exception and assigns its values.
     *
     * @param category          (optional) a standard error category. Default: Unknown
     * @param correlation_id    (optional) a unique transaction id to trace execution through call chain.
     * @param code              (optional) a unique error code. Default: "UNKNOWN"
     * @param message           (optional) a human-readable description of the error.
     */
    constructor(category = null, correlation_id = null, code = null, message = null) {
        super(message);
        /** HTTP status code associated with this error type */
        this.status = 500;
        /** A unique error code */
        this.code = 'UNKNOWN';
        // Set the prototype explicitly.
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        this.__proto__ = ApplicationException.prototype;
        this.category = category || ErrorCategory_1.ErrorCategory.Unknown;
        this.correlation_id = correlation_id;
        this.code = code || 'UNKNOWN';
        if (!this.message)
            this.message = message || 'Unknown error';
        this.name = this.code;
    }
    /**
     * Gets original error wrapped by this exception as a string message.
     *
     * @returns an original error message.
     */
    getCauseString() {
        return this.cause != null ? this.cause.toString() : null;
    }
    /**
     * Sets original error wrapped by this exception as a string message.
     *
     * @param value an original error message.
     */
    setCauseString(value) {
        this.cause = value;
    }
    /**
     * Gets a stack trace where this exception occured.
     *
     * @returns a stack trace as a string.
     */
    getStackTraceString() {
        return this.stack_trace || this.stack;
    }
    /**
     * Sets a stack trace where this exception occured.
     *
     * @param value a stack trace as a string
     */
    setStackTraceString(value) {
        this.stack_trace = value;
    }
    /**
     * Sets a unique error code.
     *
     * This method returns reference to this exception to implement Builder pattern
     * to chain additional calls.
     *
     * @param code a unique error code
     * @returns this exception object
     */
    withCode(code) {
        this.code = code || 'UNKNOWN';
        this.name = this.code;
        return this;
    }
    /**
     * Sets a original error wrapped by this exception
     *
     * This method returns reference to this exception to implement Builder pattern
     * to chain additional calls.
     *
     * @param cause original error object
     * @returns this exception object
     */
    withCause(cause) {
        if (cause) {
            this.cause = cause.message;
        }
        return this;
    }
    /**
     * Sets a HTTP status code which shall be returned by REST calls.
     *
     * This method returns reference to this exception to implement Builder pattern
     * to chain additional calls.
     *
     * @param status an HTTP error code.
     * @returns this exception object
     */
    withStatus(status) {
        this.status = status || 500;
        return this;
    }
    /**
     * Sets a parameter for additional error details.
     * This details can be used to restore error description in other languages.
     *
     * This method returns reference to this exception to implement Builder pattern
     * to chain additional calls.
     *
     * @param key a details parameter name
     * @param value a details parameter name
     * @returns this exception object
     */
    withDetails(key, value) {
        this.details = this.details || new StringValueMap_1.StringValueMap();
        this.details.setAsObject(key, value);
        return this;
    }
    /**
     * Sets a correlation id which can be used to trace this error through a call chain.
     *
     * This method returns reference to this exception to implement Builder pattern
     * to chain additional calls.
     *
     * @param correlationId a unique transaction id to trace error through call chain
     * @returns this exception object
     */
    withCorrelationId(correlationId) {
        this.correlation_id = correlationId;
        return this;
    }
    /**
     * Sets a stack trace for this error.
     *
     * This method returns reference to this exception to implement Builder pattern
     * to chain additional calls.
     *
     * @param stackTrace a stack trace where this error occured
     * @returns this exception object
     */
    withStackTrace(stackTrace) {
        this.stack_trace = stackTrace;
        return this;
    }
    /**
     * Wraps another exception into an application exception object.
     *
     * If original exception is of ApplicationException type it is returned without changes.
     * Otherwise a new ApplicationException is created and original error is set as its cause.
     *
     * @param cause     an original error object
     * @returns an original or newly created ApplicationException
     */
    wrap(cause) {
        cause = ApplicationException.unwrapError(cause);
        if (cause instanceof ApplicationException) {
            return cause;
        }
        this.withCause(cause);
        return this;
    }
    /**
     * Wraps another exception into specified application exception object.
     *
     * If original exception is of ApplicationException type it is returned without changes.
     * Otherwise the original error is set as a cause to specified ApplicationException object.
     *
     * @param error         an ApplicationException object to wrap the cause
     * @param cause         an original error object
     * @returns an original or newly created ApplicationException
     *
     * @see [[wrap]]
     */
    static wrapError(error, cause) {
        cause = ApplicationException.unwrapError(cause);
        if (cause instanceof ApplicationException) {
            return cause;
        }
        error.withCause(cause);
        return error;
    }
    /**
     * Unwraps original exception through wrapped exception objects.
     *
     * Many frameworks like Seneca or restify wrap original exception.
     * That may result in propagating less specific errors and can hide
     * causes of the errors.
     *
     * @param error     an error object
     * @returns         an original error object
     */
    static unwrapError(error) {
        if (error == null)
            return null;
        // Unwrapping Seneca exceptions
        if (error.code == 'act_execute' && error.orig) {
            error = error.orig;
            if (error.orig) {
                error = error.orig;
            }
        }
        // Unwrapping restify exceptions 
        if (error.body && error.body != null) {
            error = error.body;
        }
        return error;
    }
}
exports.ApplicationException = ApplicationException;
//# sourceMappingURL=ApplicationException.js.map