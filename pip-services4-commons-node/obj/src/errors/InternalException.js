"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalException = void 0;
/** @module errors */
const ErrorCategory_1 = require("./ErrorCategory");
const ApplicationException_1 = require("./ApplicationException");
/**
 * Errors caused by programming mistakes.
 */
class InternalException extends ApplicationException_1.ApplicationException {
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
        super(ErrorCategory_1.ErrorCategory.Internal, correlation_id, code, message);
        // Set the prototype explicitly.
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        this.__proto__ = InternalException.prototype;
        this.status = 500;
    }
}
exports.InternalException = InternalException;
//# sourceMappingURL=InternalException.js.map