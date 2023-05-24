/** @module validate */
import { IValidationRule } from './IValidationRule';
import { Schema } from './Schema';
import { ValidationResult } from './ValidationResult';
/**
 * Validation rule that compares value to a constant.
 *
 * @see [[IValidationRule]]
 *
 * ### Example ###
 *
 *     let schema = new Schema()
 *         .withRule(new ValueComparisonRule("EQ", 1));
 *
 *     schema.validate(1);          // Result: no errors
 *     schema.validate(2);          // Result: 2 is not equal to 1
 */
export declare class ValueComparisonRule implements IValidationRule {
    private readonly _value;
    private readonly _operation;
    /**
     * Creates a new validation rule and sets its values.
     *
     * @param operation    a comparison operation: "==" ("=", "EQ"), "!= " ("<>", "NE"); "<"/">" ("LT"/"GT"), "<="/">=" ("LE"/"GE"); "LIKE".
     * @param value        a constant value to compare to
     */
    constructor(operation: string, value: any);
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
