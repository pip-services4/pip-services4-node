/** @module validate */
import { IValidationRule } from './IValidationRule';
import { ValidationResult } from './ValidationResult';
import { Schema } from './Schema';
/**
 * Schema to validate object properties
 *
 * @see [[ObjectSchema]]
 *
 * ### Example ###
 *
 *     let schema = new ObjectSchema()
 *         .withProperty(new PropertySchema("id", TypeCode.String));
 *
 *     schema.validate({ id: "1", name: "ABC" });       // Result: no errors
 *     schema.validate({ name: "ABC" });                // Result: no errors
 *     schema.validate({ id: 1, name: "ABC" });         // Result: id type mismatch
 */
export declare class PropertySchema extends Schema {
    private _name;
    private _type;
    /**
     * Creates a new validation schema and sets its values.
     *
     * @param name          (optional) a property name
     * @param type          (optional) a property type
     * @param required      (optional) true to always require non-null values.
     * @param rules         (optional) a list with validation rules.
     *
     * @see [[IValidationRule]]
     * @see [[TypeCode]]
     */
    constructor(name?: string, type?: any, required?: boolean, rules?: IValidationRule[]);
    /**
     * Gets the property name.
     *
     * @returns the property name.
     */
    getName(): string;
    /**
     * Sets the property name.
     *
     * @param value     a new property name.
     */
    setName(value: string): void;
    /**
     * Gets the property type.
     *
     * @returns the property type.
     */
    getType(): any;
    /**
     * Sets a new property type.
     * The type can be defined as type, type name or [[TypeCode]]
     *
     * @param value     a new property type.
     */
    setType(value: any): void;
    /**
     * Validates a given value against the schema and configured validation rules.
     *
     * @param path      a dot notation path to the value.
     * @param value     a value to be validated.
     * @param results   a list with validation results to add new results.
     */
    performValidation(path: string, value: any, results: ValidationResult[]): void;
}
