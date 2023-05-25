/** @module validate */
import { IValidationRule } from './IValidationRule';
import { Schema } from './Schema';
import { ValidationResult } from './ValidationResult';
/**
 * Validation rule to check that value is included into the list of constants.
 *
 * @see [[IValidationRule]]
 *
 * ### Example ###
 *
 *     let schema = new Schema()
 *         .withRule(new IncludedRule(1, 2, 3));
 *
 *     schema.validate(2);      // Result: no errors
 *     schema.validate(10);     // Result: 10 must be one of 1, 2, 3
 */
export declare class IncludedRule implements IValidationRule {
    private readonly _values;
    /**
     * Creates a new validation rule and sets its values.
     *
     * @param values    a list of constants that value must be included to
     */
    constructor(...values: any[]);
    /**
     * Validates a given value against this rule.
     *
     * @param path      a dot notation path to the value.
     * @param schema    a schema this rule is called from
     * @param value     a value to be validated.
     * @param results   a list with validation results to add new results.
     */
    validate(path: string, schema: Schema, value: any, results: ValidationResult[]): void;
}
