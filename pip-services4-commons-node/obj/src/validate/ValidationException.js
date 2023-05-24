"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = void 0;
const ValidationResultType_1 = require("./ValidationResultType");
const BadRequestException_1 = require("../errors/BadRequestException");
/**
 * Errors in schema validation.
 *
 * Validation errors are usually generated based in [[ValidationResult]].
 * If using strict mode, warnings will also raise validation exceptions.
 *
 * @see [[BadRequestException]]
 * @see [[ValidationResult]]
 */
class ValidationException extends BadRequestException_1.BadRequestException {
    /**
     * Creates a new instance of validation exception and assigns its values.
     *
     * @param category          (optional) a standard error category. Default: Unknown
     * @param correlation_id    (optional) a unique transaction id to trace execution through call chain.
     * @param results           (optional) a list of validation results
     * @param message           (optional) a human-readable description of the error.
     *
     * @see [[ValidationResult]]
     */
    constructor(correlationId, message, results) {
        super(correlationId, "INVALID_DATA", message || ValidationException.composeMessage(results));
        if (results) {
            this.withDetails("results", results);
        }
    }
    /**
     * Composes human readable error message based on validation results.
     *
     * @param results   a list of validation results.
     * @returns a composed error message.
     *
     * @see [[ValidationResult]]
     */
    static composeMessage(results) {
        let builder = "Validation failed";
        if (results && results.length > 0) {
            let first = true;
            for (let i = 0; i < results.length; i++) {
                let result = results[i];
                if (result.getType() == ValidationResultType_1.ValidationResultType.Information) {
                    continue;
                }
                builder += first ? ": " : ", ";
                builder += result.getMessage();
                first = false;
            }
        }
        return builder;
    }
    /**
     * Creates a new ValidationException based on errors in validation results.
     * If validation results have no errors, than null is returned.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param results           list of validation results that may contain errors
     * @param strict            true to treat warnings as errors.
     * @returns a newly created ValidationException or null if no errors in found.
     *
     * @see [[ValidationResult]]
     */
    static fromResults(correlationId, results, strict) {
        let hasErrors = false;
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            if (result.getType() == ValidationResultType_1.ValidationResultType.Error) {
                hasErrors = true;
            }
            if (strict && result.getType() == ValidationResultType_1.ValidationResultType.Warning) {
                hasErrors = true;
            }
        }
        return hasErrors ? new ValidationException(correlationId, null, results) : null;
    }
    /**
     * Throws ValidationException based on errors in validation results.
     * If validation results have no errors, than no exception is thrown.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param results           list of validation results that may contain errors
     * @param strict            true to treat warnings as errors.
     *
     * @see [[ValidationResult]]
     * @see [[ValidationException]]
     */
    static throwExceptionIfNeeded(correlationId, results, strict) {
        let ex = ValidationException.fromResults(correlationId, results, strict);
        if (ex)
            throw ex;
    }
}
exports.ValidationException = ValidationException;
//# sourceMappingURL=ValidationException.js.map