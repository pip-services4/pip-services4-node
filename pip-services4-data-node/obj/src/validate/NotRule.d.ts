/** @module validate */
import { IValidationRule } from './IValidationRule';
import { Schema } from './Schema';
import { ValidationResult } from './ValidationResult';
/**
 * Validation rule negate another rule.
 * When embedded rule returns no errors, than this rule return an error.
 * When embedded rule return errors, than the rule returns no errors.
 *
 * @see [[IValidationRule]]
 *
 * ### Example ###
 *
 *     let schema = new Schema()
 *         .withRule(new NotRule(
 *             new ValueComparisonRule("EQ", 1)
 *         ));
 *
 *     schema.validate(1);          // Result: error
 *     schema.validate(5);          // Result: no error
 */
export declare class NotRule implements IValidationRule {
    private readonly _rule;
    /**
     * Creates a new validation rule and sets its values
     *
     * @param rule     a rule to be negated.
     */
    constructor(rule: IValidationRule);
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
