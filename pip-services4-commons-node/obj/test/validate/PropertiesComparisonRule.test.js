"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const TestObject_1 = require("./TestObject");
const Schema_1 = require("../../src/validate/Schema");
const PropertiesComparisonRule_1 = require("../../src/validate/PropertiesComparisonRule");
suite('PropertiesComparisonRule', () => {
    test('PropertiesComparisonRule', () => {
        let obj = new TestObject_1.TestObject();
        let schema = new Schema_1.Schema().withRule(new PropertiesComparisonRule_1.PropertiesComparisonRule("stringProperty", "EQ", "nullProperty"));
        obj.stringProperty = "ABC";
        obj.nullProperty = "ABC";
        let results = schema.validate(obj);
        assert.equal(results.length, 0);
        obj.nullProperty = "XYZ";
        results = schema.validate(obj);
        assert.equal(results.length, 1);
    });
});
//# sourceMappingURL=PropertiesComparisonRule.test.js.map