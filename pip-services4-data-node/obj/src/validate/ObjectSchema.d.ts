/** @module validate */
import { IValidationRule } from './IValidationRule';
import { ValidationResult } from './ValidationResult';
import { Schema } from './Schema';
import { PropertySchema } from './PropertySchema';
/**
 * Schema to validate user defined objects.
 *
 * ### Example ###
 *
 *     let schema = new ObjectSchema(false)
 *         .withOptionalProperty("id", TypeCode.String)
 *         .withRequiredProperty("name", TypeCode.String);
 *
 *     schema.validate({ id: "1", name: "ABC" });       // Result: no errors
 *     schema.validate({ name: "ABC" });                // Result: no errors
 *     schema.validate({ id: 1, name: "ABC" });         // Result: id type mismatch
 *     schema.validate({ id: 1, _name: "ABC" });        // Result: name is missing, unexpected _name
 *     schema.validate("ABC");                          // Result: type mismatch
 */
export declare class ObjectSchema extends Schema {
    private _properties;
    private _allowUndefined;
    /**
     * Creates a new validation schema and sets its values.
     *
     * @param allowUndefined    true to allow properties undefines in the schema
     * @param required          (optional) true to always require non-null values.
     * @param rules             (optional) a list with validation rules.
     *
     * @see [[IValidationRule]]
     */
    constructor(allowUndefined?: boolean, required?: boolean, rules?: IValidationRule[]);
    /**
     * Gets validation schemas for object properties.
     *
     * @returns the list of property validation schemas.
     *
     * @see [[PropertySchema]]
     */
    getProperties(): PropertySchema[];
    /**
     * Sets validation schemas for object properties.
     *
     * @param value     a list of property validation schemas.
     *
     * @see [[PropertySchema]]
     */
    setProperties(value: PropertySchema[]): void;
    /**
     * Gets flag to allow undefined properties
     *
     * @returns true to allow undefined properties and false to disallow.
     */
    get isUndefinedAllowed(): boolean;
    /**
     * Sets flag to allow undefined properties
     *
     * @param value     true to allow undefined properties and false to disallow.
     */
    set isUndefinedAllowed(value: boolean);
    /**
     * Sets flag to allow undefined properties
     *
     * This method returns reference to this exception to implement Builder pattern
     * to chain additional calls.
     *
     * @param value     true to allow undefined properties and false to disallow.
     * @returns this validation schema.
     */
    allowUndefined(value: boolean): ObjectSchema;
    /**
     * Adds a validation schema for an object property.
     *
     * This method returns reference to this exception to implement Builder pattern
     * to chain additional calls.
     *
     * @param schema    a property validation schema to be added.
     * @returns this validation schema.
     *
     * @see [[PropertySchema]]
     */
    withProperty(schema: PropertySchema): ObjectSchema;
    /**
     * Adds a validation schema for a required object property.
     *
     * @param name      a property name.
     * @param type      (optional) a property schema or type.
     * @param rules     (optional) a list of property validation rules.
     */
    withRequiredProperty(name: string, type?: any, ...rules: IValidationRule[]): ObjectSchema;
    /**
     * Adds a validation schema for an optional object property.
     *
     * @param name      a property name.
     * @param type      (optional) a property schema or type.
     * @param rules     (optional) a list of property validation rules.
     */
    withOptionalProperty(name: string, type?: any, ...rules: IValidationRule[]): ObjectSchema;
    /**
     * Validates a given value against the schema and configured validation rules.
     *
     * @param path      a dot notation path to the value.
     * @param value     a value to be validated.
     * @param results   a list with validation results to add new results.
     */
    protected performValidation(path: string, value: any, results: ValidationResult[]): void;
}
