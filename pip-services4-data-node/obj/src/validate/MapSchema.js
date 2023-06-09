"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapSchema = void 0;
/** @module validate */
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_commons_node_2 = require("pip-services4-commons-node");
const pip_services4_commons_node_3 = require("pip-services4-commons-node");
const pip_services4_commons_node_4 = require("pip-services4-commons-node");
const ValidationResult_1 = require("./ValidationResult");
const ValidationResultType_1 = require("./ValidationResultType");
const Schema_1 = require("./Schema");
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
class MapSchema extends Schema_1.Schema {
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
    constructor(keyType, valueType, required, rules) {
        super(required, rules);
        this._keyType = keyType;
        this._valueType = valueType;
    }
    /**
     * Gets the type of map keys.
     * Null means that keys may have any type.
     *
     * @returns the type of map keys.
     */
    getKeyType() {
        return this._keyType;
    }
    /**
     * Sets the type of map keys.
     * Null means that keys may have any type.
     *
     * @param value     a type of map keys.
     */
    setKeyType(value) {
        this._keyType = value;
    }
    /**
     * Gets the type of map values.
     * Null means that values may have any type.
     *
     * @returns the type of map values.
     */
    getValueType() {
        return this._valueType;
    }
    /**
     * Sets the type of map values.
     * Null means that values may have any type.
     *
     * @param value     a type of map values.
     */
    setValueType(value) {
        this._valueType = value;
    }
    /**
     * Validates a given value against the schema and configured validation rules.
     *
     * @param path      a dot notation path to the value.
     * @param value     a value to be validated.
     * @param results   a list with validation results to add new results.
     */
    performValidation(path, value, results) {
        value = pip_services4_commons_node_1.ObjectReader.getValue(value);
        super.performValidation(path, value, results);
        if (!value)
            return;
        const name = path || "value";
        const valueType = pip_services4_commons_node_3.TypeConverter.toTypeCode(value);
        const map = valueType === pip_services4_commons_node_2.TypeCode.Map ? value : null;
        if (map) {
            for (const key in map) {
                const elementPath = path != "" ? path + "." + key : pip_services4_commons_node_4.StringConverter.toString(key);
                this.performTypeValidation(elementPath, this.getKeyType(), key, results);
                this.performTypeValidation(elementPath, this.getValueType(), map[key], results);
            }
        }
        else {
            if (this.isRequired) {
                results.push(new ValidationResult_1.ValidationResult(path, ValidationResultType_1.ValidationResultType.Error, "VALUE_ISNOT_MAP", name + " type must be Map", pip_services4_commons_node_2.TypeCode.Map, valueType));
            }
        }
    }
}
exports.MapSchema = MapSchema;
//# sourceMappingURL=MapSchema.js.map