"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcludedRule = void 0;
const ValidationResult_1 = require("./ValidationResult");
const ValidationResultType_1 = require("./ValidationResultType");
const ObjectComparator_1 = require("./ObjectComparator");
/**
 * Validation rule to check that value is excluded from the list of constants.
 *
 * @see [[IValidationRule]]
 *
 * ### Example ###
 *
 *     let schema = new Schema()
 *         .withRule(new ExcludedRule(1, 2, 3));
 *
 *     schema.validate(2);      // Result: 2 must not be one of 1, 2, 3
 *     schema.validate(10);     // Result: no errors
 */
class ExcludedRule {
    /**
     * Creates a new validation rule and sets its values.
     *
     * @param values    a list of constants that value must be excluded from
     */
    constructor(...values) {
        this._values = values;
    }
    /**
     * Validates the given value. None of the values set in this ExcludedRule object must exist
     * in the value that is given for validation to pass.
     *
     * @param path      the dot notation path to the value that is to be validated.
     * @param schema    (not used in this implementation).
     * @param value     the value that is to be validated.
     * @param results   the results of the validation.
     */
    validate(path, schema, value, results) {
        if (!this._values)
            return;
        const name = path || "value";
        let found = false;
        for (let i = 0; i < this._values.length && !found; i++) {
            const thisValue = this._values[i];
            if (ObjectComparator_1.ObjectComparator.compare(value, 'EQ', thisValue)) {
                found = true;
                break;
            }
        }
        if (found) {
            results.push(new ValidationResult_1.ValidationResult(path, ValidationResultType_1.ValidationResultType.Error, "VALUE_INCLUDED", name + " must not be one of " + this._values, this._values, null));
        }
    }
}
exports.ExcludedRule = ExcludedRule;
//# sourceMappingURL=ExcludedRule.js.map