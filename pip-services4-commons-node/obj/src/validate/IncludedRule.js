"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncludedRule = void 0;
const ValidationResult_1 = require("./ValidationResult");
const ValidationResultType_1 = require("./ValidationResultType");
const ObjectComparator_1 = require("./ObjectComparator");
/**
 * Validation rule to check that value is included into the list of constants.
 *
 * @see [[IValidationRule]]
 *
 * ### Example ###
 *
 *     let schema = new Schema()
 *         .withRule(new IncludedRule(1, 2, 3));
 *
 *     schema.validate(2);      // Result: no errors
 *     schema.validate(10);     // Result: 10 must be one of 1, 2, 3
 */
class IncludedRule {
    /**
     * Creates a new validation rule and sets its values.
     *
     * @param values    a list of constants that value must be included to
     */
    constructor(...values) {
        this._values = values;
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
        if (!this._values)
            return;
        let name = path || "value";
        let found = false;
        for (var i = 0; i < this._values.length && !found; i++) {
            let thisValue = this._values[i];
            if (ObjectComparator_1.ObjectComparator.compare(value, 'EQ', thisValue)) {
                found = true;
                break;
            }
        }
        if (!found) {
            results.push(new ValidationResult_1.ValidationResult(path, ValidationResultType_1.ValidationResultType.Error, "VALUE_NOT_INCLUDED", name + " must be one of " + this._values, this._values, null));
        }
    }
}
exports.IncludedRule = IncludedRule;
//# sourceMappingURL=IncludedRule.js.map