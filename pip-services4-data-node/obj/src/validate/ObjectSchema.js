"use strict";
/** @module validate */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectSchema = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const ValidationResult_1 = require("./ValidationResult");
const ValidationResultType_1 = require("./ValidationResultType");
const Schema_1 = require("./Schema");
const PropertySchema_1 = require("./PropertySchema");
const ObjectComparator_1 = require("./ObjectComparator");
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
class ObjectSchema extends Schema_1.Schema {
    /**
     * Creates a new validation schema and sets its values.
     *
     * @param allowUndefined    true to allow properties undefines in the schema
     * @param required          (optional) true to always require non-null values.
     * @param rules             (optional) a list with validation rules.
     *
     * @see [[IValidationRule]]
     */
    constructor(allowUndefined, required, rules) {
        super(required, rules);
        this._allowUndefined = allowUndefined;
    }
    /**
     * Gets validation schemas for object properties.
     *
     * @returns the list of property validation schemas.
     *
     * @see [[PropertySchema]]
     */
    getProperties() {
        return this._properties;
    }
    /**
     * Sets validation schemas for object properties.
     *
     * @param value     a list of property validation schemas.
     *
     * @see [[PropertySchema]]
     */
    setProperties(value) {
        this._properties = value;
    }
    /**
     * Gets flag to allow undefined properties
     *
     * @returns true to allow undefined properties and false to disallow.
     */
    get isUndefinedAllowed() {
        return this._allowUndefined;
    }
    /**
     * Sets flag to allow undefined properties
     *
     * @param value     true to allow undefined properties and false to disallow.
     */
    set isUndefinedAllowed(value) {
        this._allowUndefined = value;
    }
    /**
     * Sets flag to allow undefined properties
     *
     * This method returns reference to this exception to implement Builder pattern
     * to chain additional calls.
     *
     * @param value     true to allow undefined properties and false to disallow.
     * @returns this validation schema.
     */
    allowUndefined(value) {
        this.isUndefinedAllowed = value;
        return this;
    }
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
    withProperty(schema) {
        this._properties = this._properties || [];
        this._properties.push(schema);
        return this;
    }
    /**
     * Adds a validation schema for a required object property.
     *
     * @param name      a property name.
     * @param type      (optional) a property schema or type.
     * @param rules     (optional) a list of property validation rules.
     */
    withRequiredProperty(name, type, ...rules) {
        const schema = new PropertySchema_1.PropertySchema(name, type);
        schema.setRules(rules.slice());
        schema.makeRequired();
        return this.withProperty(schema);
    }
    /**
     * Adds a validation schema for an optional object property.
     *
     * @param name      a property name.
     * @param type      (optional) a property schema or type.
     * @param rules     (optional) a list of property validation rules.
     */
    withOptionalProperty(name, type, ...rules) {
        const schema = new PropertySchema_1.PropertySchema(name, type);
        schema.setRules(rules.slice());
        schema.makeOptional();
        return this.withProperty(schema);
    }
    /**
     * Validates a given value against the schema and configured validation rules.
     *
     * @param path      a dot notation path to the value.
     * @param value     a value to be validated.
     * @param results   a list with validation results to add new results.
     */
    performValidation(path, value, results) {
        super.performValidation(path, value, results);
        if (!value)
            return;
        const name = path || "value";
        const properties = pip_services4_commons_node_1.ObjectReader.getProperties(value);
        if (this._properties) {
            for (let i = 0; i < this._properties.length; i++) {
                const propertySchema = this._properties[i];
                let processedName = null;
                for (const key in properties) {
                    const propertyName = key;
                    const propertyValue = properties[key];
                    if (ObjectComparator_1.ObjectComparator.areEqual(propertySchema.getName(), propertyName)) {
                        propertySchema.performValidation(path, propertyValue, results);
                        processedName = propertyName;
                        break;
                    }
                }
                if (processedName) {
                    delete properties[processedName];
                }
                else {
                    propertySchema.performValidation(path, null, results);
                }
            }
        }
        if (!this._allowUndefined)
            for (const key in properties) {
                const propertyPath = key && path != "" ? path + "." + key : key;
                results.push(new ValidationResult_1.ValidationResult(propertyPath, ValidationResultType_1.ValidationResultType.Warning, "UNEXPECTED_PROPERTY", name + " contains unexpected property " + key, null, key));
            }
    }
}
exports.ObjectSchema = ObjectSchema;
//# sourceMappingURL=ObjectSchema.js.map