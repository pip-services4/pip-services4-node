/** @module validate */
import { IValidationRule } from './IValidationRule';
import { Schema } from './Schema';
import { ValidationResult } from './ValidationResult';
/**
 * Validation rule to check that value is excluded from the list of constants.
 *
 * @see [[IValidationRule]]
 *
 * ### Example ###
 *
 *     let schema = new Schema()
 *         .withRule(new ExcludedRule(1, 2, 3));
 *
 *     schema.validate(2);      // Result: 2 must not be one of 1, 2, 3
 *     schema.validate(10);     // Result: no errors
 */
export declare class ExcludedRule implements IValidationRule {
    private readonly _values;
    /**
     * Creates a new validation rule and sets its values.
     *
     * @param values    a list of constants that value must be excluded from
     */
    constructor(...values: any[]);
    /**
     * Validates the given value. None of the values set in this ExcludedRule object must exist
     * in the value that is given for validation to pass.
     *
     * @param path      the dot notation path to the value that is to be validated.
     * @param schema    (not used in this implementation).
     * @param value     the value that is to be validated.
     * @param results   the results of the validation.
     */
    validate(path: string, schema: Schema, value: any, results: ValidationResult[]): void;
}
