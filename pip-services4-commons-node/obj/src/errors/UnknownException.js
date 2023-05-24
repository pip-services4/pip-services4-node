"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownException = void 0;
/** @module errors */
const ErrorCategory_1 = require("./ErrorCategory");
const ApplicationException_1 = require("./ApplicationException");
/**
 * Unknown or unexpected errors.
 */
class UnknownException extends ApplicationException_1.ApplicationException {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param correlation_id    (optional) a unique transaction id to trace execution through call chain.
     * @param code              (optional) a unique error code. Default: "UNKNOWN"
     * @param message           (optional) a human-readable description of the error.
     *
     * @see [[ErrorCategory]]
     */
    constructor(correlation_id = null, code = null, message = null) {
        super(ErrorCategory_1.ErrorCategory.Unknown, correlation_id, code, message);
        // Set the prototype explicitly.
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        this.__proto__ = UnknownException.prototype;
        this.status = 500;
    }
}
exports.UnknownException = UnknownException;
//# sourceMappingURL=UnknownException.js.map