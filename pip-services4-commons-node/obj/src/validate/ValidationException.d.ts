/** @module validate */
import { ValidationResult } from './ValidationResult';
import { BadRequestException } from '../errors/BadRequestException';
/**
 * Errors in schema validation.
 *
 * Validation errors are usually generated based in [[ValidationResult]].
 * If using strict mode, warnings will also raise validation exceptions.
 *
 * @see [[BadRequestException]]
 * @see [[ValidationResult]]
 */
export declare class ValidationException extends BadRequestException {
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
    constructor(correlationId: string, message?: string, results?: ValidationResult[]);
    /**
     * Composes human readable error message based on validation results.
     *
     * @param results   a list of validation results.
     * @returns a composed error message.
     *
     * @see [[ValidationResult]]
     */
    static composeMessage(results: ValidationResult[]): string;
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
    static fromResults(correlationId: string, results: ValidationResult[], strict: boolean): ValidationException;
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
    static throwExceptionIfNeeded(correlationId: string, results: ValidationResult[], strict: boolean): void;
}
