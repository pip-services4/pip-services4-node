"use strict";
/** @module validate */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_commons_node_2 = require("pip-services4-commons-node");
const pip_services4_commons_node_3 = require("pip-services4-commons-node");
const ValidationResult_1 = require("./ValidationResult");
const ValidationResultType_1 = require("./ValidationResultType");
const ValidationException_1 = require("./ValidationException");
/**
 * Basic schema that validates values against a set of validation rules.
 *
 * This schema is used as a basis for specific schemas to validate
 * objects, project properties, arrays and maps.
 *
 * @see [[ObjectSchema]]
 * @see [[PropertySchema]]
 * @see [[ArraySchema]]
 * @see [[MapSchema]]
 */
class Schema {
    /**
     * Creates a new instance of validation schema and sets its values.
     *
     * @param required  (optional) true to always require non-null values.
     * @param rules     (optional) a list with validation rules.
     *
     * @see [[IValidationRule]]
     */
    constructor(required, rules) {
        this._required = required;
        this._rules = rules;
    }
    /**
     * Gets a flag that always requires non-null values.
     * For null values it raises a validation error.
     *
     * @returns true to always require non-null values and false to allow null values.
     */
    isRequired() {
        return this._required;
    }
    /**
     * Sets a flag that always requires non-null values.
     *
     * @param value true to always require non-null values and false to allow null values.
     */
    setRequired(value) {
        this._required = value;
    }
    /**
     * Gets validation rules to check values against.
     *
     * @returns a list with validation rules.
     */
    getRules() {
        return this._rules;
    }
    /**
     * Sets validation rules to check values against.
     *
     * @param value a list with validation rules.
     */
    setRules(value) {
        this._rules = value;
    }
    /**
     * Makes validated values always required (non-null).
     * For null values the schema will raise errors.
     *
     * This method returns reference to this exception to implement Builder pattern
     * to chain additional calls.
     *
     * @returns this validation schema
     *
     * @see [[makeOptional]]
     */
    makeRequired() {
        this._required = true;
        return this;
    }
    /**
     * Makes validated values optional.
     * Validation for null values will be skipped.
     *
     * This method returns reference to this exception to implement Builder pattern
     * to chain additional calls.
     *
     * @returns this validation schema
     *
     * @see [[makeRequired]]
     */
    makeOptional() {
        this._required = false;
        return this;
    }
    /**
     * Adds validation rule to this schema.
     *
     * This method returns reference to this exception to implement Builder pattern
     * to chain additional calls.
     *
     * @param rule  a validation rule to be added.
     * @returns this validation schema.
     */
    withRule(rule) {
        this._rules = this._rules || [];
        this._rules.push(rule);
        return this;
    }
    /**
     * Validates a given value against the schema and configured validation rules.
     *
     * @param path      a dot notation path to the value.
     * @param value     a value to be validated.
     * @param results   a list with validation results to add new results.
     */
    performValidation(path, value, results) {
        let name = path || "value";
        if (value == null) {
            if (this.isRequired()) {
                results.push(new ValidationResult_1.ValidationResult(path, ValidationResultType_1.ValidationResultType.Error, "VALUE_IS_NULL", name + " must not be null", "NOT NULL", null));
            }
        }
        else {
            value = pip_services4_commons_node_1.ObjectReader.getValue(value);
            // Check validation rules
            if (this._rules != null) {
                for (let i = 0; i < this._rules.length; i++) {
                    let rule = this._rules[i];
                    rule.validate(path, this, value, results);
                }
            }
        }
    }
    typeToString(type) {
        if (type == null) {
            return "unknown";
        }
        if (typeof type === "number") {
            return pip_services4_commons_node_3.TypeConverter.toString(type);
        }
        return type.toString();
    }
    /**
     * Validates a given value to match specified type.
     * The type can be defined as a Schema, type, a type name or [[TypeCode]]
     * When type is a Schema, it executes validation recursively against that Schema.
     *
     * @param path      a dot notation path to the value.
     * @param type      a type to match the value type
     * @param value     a value to be validated.
     * @param results   a list with validation results to add new results.
     *
     * @see [[performValidation]]
     */
    performTypeValidation(path, type, value, results) {
        // If type it not defined then skip
        if (type == null)
            return;
        // Perform validation against the schema
        if (type instanceof Schema) {
            let schema = type;
            schema.performValidation(path, value, results);
            return;
        }
        // If value is null then skip
        value = pip_services4_commons_node_1.ObjectReader.getValue(value);
        if (value == null)
            return;
        let name = path || "value";
        let valueType = pip_services4_commons_node_3.TypeConverter.toTypeCode(value);
        // Match types
        if (pip_services4_commons_node_2.TypeMatcher.matchType(type, valueType, value)) {
            return;
        }
        results.push(new ValidationResult_1.ValidationResult(path, ValidationResultType_1.ValidationResultType.Error, "TYPE_MISMATCH", name + " type must be " + this.typeToString(type) + " but found " + this.typeToString(valueType), type, valueType.toString()));
    }
    /**
     * Validates the given value and results validation results.
     *
     * @param value     a value to be validated.
     * @returns a list with validation results.
     *
     * @see [[ValidationResult]]
     */
    validate(value) {
        let results = [];
        this.performValidation("", value, results);
        return results;
    }
    /**
     * Validates the given value and returns a [[ValidationException]] if errors were found.
     *
     * @param traceId     (optional) transaction id to trace execution through call chain.
     * @param value             a value to be validated.
     * @param strict            true to treat warnings as errors.
     */
    validateAndReturnException(traceId, value, strict = false) {
        let results = this.validate(value);
        return ValidationException_1.ValidationException.fromResults(traceId, results, strict);
    }
    /**
     * Validates the given value and throws a [[ValidationException]] if errors were found.
     *
     * @param traceId     (optional) transaction id to trace execution through call chain.
     * @param value             a value to be validated.
     * @param strict            true to treat warnings as errors.
     *
     * @see [[ValidationException.throwExceptionIfNeeded]]
     */
    validateAndThrowException(traceId, value, strict = false) {
        let results = this.validate(value);
        ValidationException_1.ValidationException.throwExceptionIfNeeded(traceId, results, strict);
    }
}
exports.Schema = Schema;
//# sourceMappingURL=Schema.js.map