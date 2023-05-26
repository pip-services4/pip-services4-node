/** @module validate */

import { ObjectReader } from 'pip-services4-commons-node';

import { IValidationRule } from './IValidationRule';
import { Schema } from './Schema';
import { ValidationResult } from './ValidationResult';
import { ValidationResultType } from './ValidationResultType';

/**
 * Validation rule that check that at exactly one of the object properties is not null.
 * 
 * @see [[IValidationRule]]
 * 
 * ### Example ###
 * 
 *     let schema = new Schema()
 *         .withRule(new OnlyOneExistsRule("field1", "field2"));
 *     
 *     schema.validate({ field1: 1, field2: "A" });     // Result: only one of properties field1, field2 must exist
 *     schema.validate({ field1: 1 });                  // Result: no errors
 *     schema.validate({ });                            // Result: only one of properties field1, field2 must exist
 */
export class OnlyOneExistsRule implements IValidationRule {
    private readonly _properties: string[];

    /**
     * Creates a new validation rule and sets its values
     * 
     * @param properties    a list of property names where at only one property must exist
     */
    public constructor(...properties: string[]) {
        this._properties = properties;
    }

    /**
     * Validates a given value against this rule.
     * 
     * @param path      a dot notation path to the value.
     * @param schema    a schema this rule is called from
     * @param value     a value to be validated.
     * @param results   a list with validation results to add new results.
     */
    public validate(path: string, schema: Schema, value: any, results: ValidationResult[]): void {
        const name = path || "value";
        const found: string[] = [];

        for (let i = 0; i < this._properties.length; i++) {
            const property: string = this._properties[i];

            const propertyValue = ObjectReader.getProperty(value, property);

            if (propertyValue) {
                found.push(property);
            }
        }

        if (found.length == 0) {
            results.push(
                new ValidationResult(
                    path,
                    ValidationResultType.Error,
                    "VALUE_NULL",
                    name + " must have at least one property from " + this._properties,
                    this._properties,
                    null
                )
            );
        } else if (found.length > 1) {
            results.push(
                new ValidationResult(
                    path,
                    ValidationResultType.Error,
                    "VALUE_ONLY_ONE",
                    name + " must have only one property from " + this._properties,
                    this._properties,
                    null
                )
            );
        }
    }

}
