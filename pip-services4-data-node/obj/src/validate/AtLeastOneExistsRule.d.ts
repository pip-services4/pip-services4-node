/** @module validate */
import { IValidationRule } from './IValidationRule';
import { Schema } from './Schema';
import { ValidationResult } from './ValidationResult';
/**
 * Validation rule that check that at least one of the object properties is not null.
 *
 * @see [[IValidationRule]]
 *
 * ### Example ###
 *
 *     let schema = new Schema()
 *         .withRule(new AtLeastOneExistsRule("field1", "field2"));
 *
 *     schema.validate({ field1: 1, field2: "A" });     // Result: no errors
 *     schema.validate({ field1: 1 });                  // Result: no errors
 *     schema.validate({ });                            // Result: at least one of properties field1, field2 must exist
 */
export declare class AtLeastOneExistsRule implements IValidationRule {
    private readonly _properties;
    /**
     * Creates a new validation rule and sets its values
     *
     * @param properties    a list of property names where at least one property must exist
     */
    constructor(...properties: string[]);
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
