"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertySchema = void 0;
const Schema_1 = require("./Schema");
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
class PropertySchema extends Schema_1.Schema {
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
    constructor(name, type, required, rules) {
        super(required, rules);
        this._name = name;
        this._type = type;
    }
    /**
     * Gets the property name.
     *
     * @returns the property name.
     */
    getName() {
        return this._name;
    }
    /**
     * Sets the property name.
     *
     * @param value     a new property name.
     */
    setName(value) {
        this._name = value;
    }
    /**
     * Gets the property type.
     *
     * @returns the property type.
     */
    getType() {
        return this._type;
    }
    /**
     * Sets a new property type.
     * The type can be defined as type, type name or [[TypeCode]]
     *
     * @param value     a new property type.
     */
    setType(value) {
        this._type = value;
    }
    /**
     * Validates a given value against the schema and configured validation rules.
     *
     * @param path      a dot notation path to the value.
     * @param value     a value to be validated.
     * @param results   a list with validation results to add new results.
     */
    performValidation(path, value, results) {
        path = path != "" ? path + "." + this.getName() : this.getName();
        super.performValidation(path, value, results);
        super.performTypeValidation(path, this.getType(), value, results);
    }
}
exports.PropertySchema = PropertySchema;
//# sourceMappingURL=PropertySchema.js.map