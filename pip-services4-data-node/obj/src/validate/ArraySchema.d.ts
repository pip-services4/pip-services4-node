import { Schema } from './Schema';
import { ValidationResult } from './ValidationResult';
import { IValidationRule } from './IValidationRule';
/**
 * Schema to validate arrays.
 *
 * ### Example ###
 *
 *     let schema = new ArraySchema(TypeCode.String);
 *
 *     schema.validate(["A", "B", "C"]);    // Result: no errors
 *     schema.validate([1, 2, 3]);          // Result: element type mismatch
 *     schema.validate("A");                // Result: type mismatch
 */
export declare class ArraySchema extends Schema {
    private _valueType;
    /**
     * Creates a new instance of validation schema and sets its values.
     *
     * @param valueType     a type of array elements. Null means that elements may have any type.
     * @param required      (optional) true to always require non-null values.
     * @param rules         (optional) a list with validation rules.
     *
     * @see [[TypeCode]]
     */
    constructor(valueType?: any, required?: boolean, rules?: IValidationRule[]);
    /**
     * Gets the type of array elements.
     * Null means that elements may have any type.
     *
     * @returns the type of array elements.
     */
    getValueType(): any;
    /**
     * Sets the type of array elements.
     * Null means that elements may have any type.
     *
     * @param value     a type of array elements.
     */
    setValueType(value: any): void;
    /**
     * Validates a given value against the schema and configured validation rules.
     *
     * @param path      a dot notation path to the value.
     * @param value     a value to be validated.
     * @param results   a list with validation results to add new results.
     */
    protected performValidation(path: string, value: any, results: ValidationResult[]): void;
}
