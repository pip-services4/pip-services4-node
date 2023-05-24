"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorDescriptionFactory = void 0;
/** @module errors */
const ErrorCategory_1 = require("./ErrorCategory");
const ErrorDescription_1 = require("./ErrorDescription");
const ApplicationException_1 = require("./ApplicationException");
/**
 * Factory to create serializeable [[ErrorDescription]] from [[ApplicationException]]
 * or from arbitrary errors.
 *
 * The ErrorDescriptions are used to pass errors through the wire between microservices
 * implemented in different languages. They allow to restore exceptions on the receiving side
 * close to the original type and preserve additional information.
 *
 * @see [[ErrorDescription]]
 * @see [[ApplicationException]]
 */
class ErrorDescriptionFactory {
    /**
     * Creates a serializable ErrorDescription from error object.
     *
     * @param error  	an error object
     * @returns a serializeable ErrorDescription object that describes the error.
     */
    static create(error) {
        let description = new ErrorDescription_1.ErrorDescription();
        if (error instanceof ApplicationException_1.ApplicationException) {
            let ex = error;
            description.category = ex.category;
            description.status = ex.status;
            description.code = ex.code;
            description.message = ex.message;
            description.details = ex.details;
            description.correlation_id = ex.correlation_id;
            description.cause = ex.getCauseString();
            description.stack_trace = ex.getStackTraceString();
        }
        else {
            error = error || {};
            description.type = error.name;
            description.category = ErrorCategory_1.ErrorCategory.Unknown;
            description.status = 500;
            description.code = "UNKNOWN";
            description.message = error.message || error.toString();
            description.stack_trace = error.stack;
        }
        return description;
    }
}
exports.ErrorDescriptionFactory = ErrorDescriptionFactory;
//# sourceMappingURL=ErrorDescriptionFactory.js.map