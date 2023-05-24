"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArraySchema = void 0;
/** @module validate */
const Schema_1 = require("./Schema");
const ValidationResult_1 = require("./ValidationResult");
const ValidationResultType_1 = require("./ValidationResultType");
const ObjectReader_1 = require("../reflect/ObjectReader");
const TypeCode_1 = require("../convert/TypeCode");
const TypeConverter_1 = require("../convert/TypeConverter");
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
class ArraySchema extends Schema_1.Schema {
    /**
     * Creates a new instance of validation schema and sets its values.
     *
     * @param valueType     a type of array elements. Null means that elements may have any type.
     * @param required      (optional) true to always require non-null values.
     * @param rules         (optional) a list with validation rules.
     *
     * @see [[TypeCode]]
     */
    constructor(valueType, required, rules) {
        super(required, rules);
        this._valueType = valueType;
    }
    /**
     * Gets the type of array elements.
     * Null means that elements may have any type.
     *
     * @returns the type of array elements.
     */
    getValueType() {
        return this._valueType;
    }
    /**
     * Sets the type of array elements.
     * Null means that elements may have any type.
     *
     * @param value     a type of array elements.
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
        let name = path || "value";
        value = ObjectReader_1.ObjectReader.getValue(value);
        super.performValidation(path, value, results);
        if (!value)
            return;
        if (Array.isArray(value)) {
            for (let index = 0; index < value.length; index++) {
                let elementPath = path != "" ? path + "." + index : index.toString();
                this.performTypeValidation(elementPath, this.getValueType(), value[index], results);
            }
        }
        else {
            results.push(new ValidationResult_1.ValidationResult(path, ValidationResultType_1.ValidationResultType.Error, "VALUE_ISNOT_ARRAY", name + " type must to be List or Array", TypeCode_1.TypeCode.Array, TypeConverter_1.TypeConverter.toTypeCode(value)));
        }
    }
}
exports.ArraySchema = ArraySchema;
//# sourceMappingURL=ArraySchema.js.map