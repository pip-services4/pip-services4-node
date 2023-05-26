"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesComparisonRule = void 0;
/** @module validate */
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const ValidationResult_1 = require("./ValidationResult");
const ObjectComparator_1 = require("./ObjectComparator");
const ValidationResultType_1 = require("./ValidationResultType");
/**
 * Validation rule that compares two object properties.
 *
 * @see [[IValidationRule]]
 *
 * ### Example ###
 *
 *     let schema = new ObjectSchema()
 *         .withRule(new PropertyComparisonRule("field1", "NE", "field2"));
 *
 *     schema.validate({ field1: 1, field2: 2 });       // Result: no errors
 *     schema.validate({ field1: 1, field2: 1 });       // Result: field1 shall not be equal to field2
 *     schema.validate({});                             // Result: no errors
 */
class PropertiesComparisonRule {
    /**
     * Creates a new validation rule and sets its arguments.
     *
     * @param property1    a name of the first property to compare.
     * @param operation    a comparison operation: "==" ("=", "EQ"), "!= " ("<>", "NE"); "<"/">" ("LT"/"GT"), "<="/">=" ("LE"/"GE"); "LIKE".
     * @param property2    a name of the second property to compare.
     *
     * @see [[ObjectComparator.compare]]
     */
    constructor(property1, operation, property2) {
        this._property1 = property1;
        this._property2 = property2;
        this._operation = operation;
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
        const name = path || "value";
        const value1 = pip_services4_commons_node_1.ObjectReader.getProperty(value, this._property1);
        const value2 = pip_services4_commons_node_1.ObjectReader.getProperty(value, this._property2);
        if (!ObjectComparator_1.ObjectComparator.compare(value1, this._operation, value2)) {
            results.push(new ValidationResult_1.ValidationResult(path, ValidationResultType_1.ValidationResultType.Error, "PROPERTIES_NOT_MATCH", name + " must have " + this._property1 + " " + this._operation + " " + this._property2, value2, value1));
        }
    }
}
exports.PropertiesComparisonRule = PropertiesComparisonRule;
//# sourceMappingURL=PropertiesComparisonRule.js.map