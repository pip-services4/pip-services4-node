"use strict";
/** @module validate */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtLeastOneExistsRule = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const ValidationResult_1 = require("./ValidationResult");
const ValidationResultType_1 = require("./ValidationResultType");
/**
 * Validation rule that check that at least one of the object properties is not null.
 *
 * @see [[IValidationRule]]
 *
 * ### Example ###
 *
 *     let schema = new Schema()
 *         .withRule(new AtLeastOneExistsRule("field1", "field2"));
 *
 *     schema.validate({ field1: 1, field2: "A" });     // Result: no errors
 *     schema.validate({ field1: 1 });                  // Result: no errors
 *     schema.validate({ });                            // Result: at least one of properties field1, field2 must exist
 */
class AtLeastOneExistsRule {
    /**
     * Creates a new validation rule and sets its values
     *
     * @param properties    a list of property names where at least one property must exist
     */
    constructor(...properties) {
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
    validate(path, schema, value, results) {
        let name = path || "value";
        let found = [];
        for (var i = 0; i < this._properties.length; i++) {
            let propertyValue = pip_services4_commons_node_1.ObjectReader.getProperty(value, this._properties[i]);
            if (propertyValue != null) {
                found.push(this._properties[i]);
            }
        }
        if (found.length === 0) {
            results.push(new ValidationResult_1.ValidationResult(path, ValidationResultType_1.ValidationResultType.Error, "VALUE_NULL", name + " must have at least one property from " + this._properties, this._properties, null));
        }
    }
}
exports.AtLeastOneExistsRule = AtLeastOneExistsRule;
//# sourceMappingURL=AtLeastOneExistsRule.js.map