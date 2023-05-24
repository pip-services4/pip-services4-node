/** @module validate */
import { IValidationRule } from './IValidationRule';
import { ValidationResult } from './ValidationResult';
import { ValidationException } from './ValidationException';
/**
 * Basic schema that validates values against a set of validation rules.
 *
 * This schema is used as a basis for specific schemas to validate
 * objects, project properties, arrays and maps.
 *
 * @see [[ObjectSchema]]
 * @see [[PropertySchema]]
 * @see [[ArraySchema]]
 * @see [[MapSchema]]
 */
export declare class Schema {
    private _required;
    private _rules;
    /**
     * Creates a new instance of validation schema and sets its values.
     *
     * @param required  (optional) true to always require non-null values.
     * @param rules     (optional) a list with validation rules.
     *
     * @see [[IValidationRule]]
     */
    constructor(required?: boolean, rules?: IValidationRule[]);
    /**
     * Gets a flag that always requires non-null values.
     * For null values it raises a validation error.
     *
     * @returns true to always require non-null values and false to allow null values.
     */
    isRequired(): boolean;
    /**
     * Sets a flag that always requires non-null values.
     *
     * @param value true to always require non-null values and false to allow null values.
     */
    setRequired(value: boolean): void;
    /**
     * Gets validation rules to check values against.
     *
     * @returns a list with validation rules.
     */
    getRules(): IValidationRule[];
    /**
     * Sets validation rules to check values against.
     *
     * @param value a list with validation rules.
     */
    setRules(value: IValidationRule[]): void;
    /**
     * Makes validated values always required (non-null).
     * For null values the schema will raise errors.
     *
     * This method returns reference to this exception to implement Builder pattern
     * to chain additional calls.
     *
     * @returns this validation schema
     *
     * @see [[makeOptional]]
     */
    makeRequired(): Schema;
    /**
     * Makes validated values optional.
     * Validation for null values will be skipped.
     *
     * This method returns reference to this exception to implement Builder pattern
     * to chain additional calls.
     *
     * @returns this validation schema
     *
     * @see [[makeRequired]]
     */
    makeOptional(): Schema;
    /**
     * Adds validation rule to this schema.
     *
     * This method returns reference to this exception to implement Builder pattern
     * to chain additional calls.
     *
     * @param rule  a validation rule to be added.
     * @returns this validation schema.
     */
    withRule(rule: IValidationRule): Schema;
    /**
     * Validates a given value against the schema and configured validation rules.
     *
     * @param path      a dot notation path to the value.
     * @param value     a value to be validated.
     * @param results   a list with validation results to add new results.
     */
    protected performValidation(path: string, value: any, results: ValidationResult[]): void;
    private typeToString;
    /**
     * Validates a given value to match specified type.
     * The type can be defined as a Schema, type, a type name or [[TypeCode]]
     * When type is a Schema, it executes validation recursively against that Schema.
     *
     * @param path      a dot notation path to the value.
     * @param type      a type to match the value type
     * @param value     a value to be validated.
     * @param results   a list with validation results to add new results.
     *
     * @see [[performValidation]]
     */
    protected performTypeValidation(path: string, type: any, value: any, results: ValidationResult[]): void;
    /**
     * Validates the given value and results validation results.
     *
     * @param value     a value to be validated.
     * @returns a list with validation results.
     *
     * @see [[ValidationResult]]
     */
    validate(value: any): ValidationResult[];
    /**
     * Validates the given value and returns a [[ValidationException]] if errors were found.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param value             a value to be validated.
     * @param strict            true to treat warnings as errors.
     */
    validateAndReturnException(correlationId: string, value: any, strict?: boolean): ValidationException;
    /**
     * Validates the given value and throws a [[ValidationException]] if errors were found.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param value             a value to be validated.
     * @param strict            true to treat warnings as errors.
     *
     * @see [[ValidationException.throwExceptionIfNeeded]]
     */
    validateAndThrowException(correlationId: string, value: any, strict?: boolean): void;
}
