/** @module validate */
import { IValidationRule } from './IValidationRule';
import { Schema } from './Schema';
import { ValidationResult } from './ValidationResult';
/**
 * Validation rule to combine rules with AND logical operation.
 * When all rules returns no errors, than this rule also returns no errors.
 * When one of the rules return errors, than the rules returns all errors.
 *
 * @see [[IValidationRule]]
 *
 * ### Example ###
 *
 *     let schema = new Schema()
 *         .withRule(new AndRule(
 *             new ValueComparisonRule("GTE", 1),
 *             new ValueComparisonRule("LTE", 10)
 *         ));
 *
 *     schema.validate(0);          // Result: 0 must be greater or equal to 1
 *     schema.validate(5);          // Result: no error
 *     schema.validate(20);         // Result: 20 must be letter or equal 10
 */
export declare class AndRule implements IValidationRule {
    private readonly _rules;
    /**
     * Creates a new validation rule and sets its values.
     *
     * @param rules     a list of rules to join with AND operator
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
