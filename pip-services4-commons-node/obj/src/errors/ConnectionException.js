"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionException = void 0;
/** @module errors */
const ErrorCategory_1 = require("./ErrorCategory");
const ApplicationException_1 = require("./ApplicationException");
/**
 * Errors that occur during connections to remote services.
 * They can be related to misconfiguration, network issues, or the remote service itself.
 */
class ConnectionException extends ApplicationException_1.ApplicationException {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param trace_id    (optional) a unique transaction id to trace execution through call chain.
     * @param code              (optional) a unique error code. Default: "UNKNOWN"
     * @param message           (optional) a human-readable description of the error.
     *
     * @see [[ErrorCategory]]
     */
    constructor(trace_id = null, code = null, message = null) {
        super(ErrorCategory_1.ErrorCategory.NoResponse, trace_id, code, message);
        // Set the prototype explicitly.
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        this.__proto__ = ConnectionException.prototype;
        this.status = 500;
    }
}
exports.ConnectionException = ConnectionException;
//# sourceMappingURL=ConnectionException.js.map