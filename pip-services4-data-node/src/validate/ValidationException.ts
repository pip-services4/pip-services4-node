/** @module validate */
import { BadRequestException } from 'pip-services4-commons-node';

import { ValidationResult } from './ValidationResult';
import { ValidationResultType } from './ValidationResultType';

/**
 * Errors in schema validation.
 * 
 * Validation errors are usually generated based in [[ValidationResult]].
 * If using strict mode, warnings will also raise validation exceptions.
 * 
 * @see [[BadRequestException]]
 * @see [[ValidationResult]]
 */
export class ValidationException extends BadRequestException {
    /**
     * Creates a new instance of validation exception and assigns its values.
     * 
     * @param category          (optional) a standard error category. Default: Unknown
     * @param traceId    (optional) a unique transaction id to trace execution through call chain.
     * @param results           (optional) a list of validation results
     * @param message           (optional) a human-readable description of the error.
     * 
     * @see [[ValidationResult]]
     */
    public constructor(traceId: string, message?: string, results?: ValidationResult[]) {
        super(traceId, "INVALID_DATA", message || ValidationException.composeMessage(results));

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
    public static composeMessage(results: ValidationResult[]): string {
        let builder = "Validation failed";

        if (results && results.length > 0) {
            let first = true;
            for (let i = 0; i < results.length; i++) {
                const result: ValidationResult = results[i];

                if (result.getType() == ValidationResultType.Information) {
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
     * @param traceId     (optional) transaction id to trace execution through call chain.
     * @param results           list of validation results that may contain errors
     * @param strict            true to treat warnings as errors.
     * @returns a newly created ValidationException or null if no errors in found.
     * 
     * @see [[ValidationResult]]
     */
    public static fromResults(traceId: string, results: ValidationResult[], strict: boolean): ValidationException {
        let hasErrors = false;

        for (let i = 0; i < results.length; i++) {
            const result: ValidationResult = results[i];

            if (result.getType() == ValidationResultType.Error) {
                hasErrors = true;
            }

            if (strict && result.getType() == ValidationResultType.Warning) {
                hasErrors = true;
            }
        }

        return hasErrors ? new ValidationException(traceId, null, results) : null;
    }

    /**
     * Throws ValidationException based on errors in validation results.
     * If validation results have no errors, than no exception is thrown.
     * 
     * @param traceId     (optional) transaction id to trace execution through call chain.
     * @param results           list of validation results that may contain errors
     * @param strict            true to treat warnings as errors.
     * 
     * @see [[ValidationResult]]
     * @see [[ValidationException]]
     */
    public static throwExceptionIfNeeded(traceId: string, results: ValidationResult[], strict: boolean): void {
        const ex = ValidationException.fromResults(traceId, results, strict);
        if (ex) throw ex;
    }

}
