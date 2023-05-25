import { IValidationRule } from './IValidationRule';
import { ValidationResult } from './ValidationResult';
import { Schema } from './Schema';
/**
 * Schema to validate maps.
 *
 * ### Example ###
 *
 *     let schema = new MapSchema(TypeCode.String, TypeCode.Integer);
 *
 *     schema.validate({ "key1": "A", "key2": "B" });       // Result: no errors
 *     schema.validate({ "key1": 1, "key2": 2 });           // Result: element type mismatch
 *     schema.validate([ 1, 2, 3 ]);                        // Result: type mismatch
 */
export declare class MapSchema extends Schema {
    private _keyType;
    private _valueType;
    /**
     * Creates a new instance of validation schema and sets its values.
     *
     * @param keyType       a type of map keys. Null means that keys may have any type.
     * @param valueType     a type of map values. Null means that values may have any type.
     * @param required      (optional) true to always require non-null values.
     * @param rules         (optional) a list with validation rules.
     *
     * @see [[IValidationRule]]
     * @see [[TypeCode]]
     */
    constructor(keyType?: any, valueType?: any, required?: boolean, rules?: IValidationRule[]);
    /**
     * Gets the type of map keys.
     * Null means that keys may have any type.
     *
     * @returns the type of map keys.
     */
    getKeyType(): any;
    /**
     * Sets the type of map keys.
     * Null means that keys may have any type.
     *
     * @param value     a type of map keys.
     */
    setKeyType(value: any): void;
    /**
     * Gets the type of map values.
     * Null means that values may have any type.
     *
     * @returns the type of map values.
     */
    getValueType(): any;
    /**
     * Sets the type of map values.
     * Null means that values may have any type.
     *
     * @param value     a type of map values.
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
