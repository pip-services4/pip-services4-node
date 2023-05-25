/** @module validate */
import { IValidationRule } from './IValidationRule';
import { Schema } from './Schema';
import { ValidationResult } from './ValidationResult';
/**
 * Validation rule to combine rules with OR logical operation.
 * When one of rules returns no errors, than this rule also returns no errors.
 * When all rules return errors, than the rule returns all errors.
 *
 * @see [[IValidationRule]]
 *
 * ### Example ###
 *
 *     let schema = new Schema()
 *         .withRule(new OrRule(
 *             new ValueComparisonRule("LT", 1),
 *             new ValueComparisonRule("GT", 10)
 *         ));
 *
 *     schema.validate(0);          // Result: no error
 *     schema.validate(5);          // Result: 5 must be less than 1 or 5 must be more than 10
 *     schema.validate(20);         // Result: no error
 */
export declare class OrRule implements IValidationRule {
    private readonly _rules;
    /**
     * Creates a new validation rule and sets its values.
     *
     * @param rules     a list of rules to join with OR operator
     */
    constructor(...rules: IValidationRule[]);
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
