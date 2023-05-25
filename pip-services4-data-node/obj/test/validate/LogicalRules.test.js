"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const Schema_1 = require("../../src/validate/Schema");
const OrRule_1 = require("../../src/validate/OrRule");
const AndRule_1 = require("../../src/validate/AndRule");
const ValueComparisonRule_1 = require("../../src/validate/ValueComparisonRule");
suite('Logical Rules', () => {
    test('OrRule', () => {
        let schema = new Schema_1.Schema().withRule(new OrRule_1.OrRule(new ValueComparisonRule_1.ValueComparisonRule("=", 1), new ValueComparisonRule_1.ValueComparisonRule("=", 2)));
        let results = schema.validate(-100);
        assert.equal(results.length, 2);
        results = schema.validate(1);
        assert.equal(results.length, 0);
        results = schema.validate(200);
        assert.equal(results.length, 2);
    });
    test('AndRule', () => {
        let schema = new Schema_1.Schema().withRule(new AndRule_1.AndRule(new ValueComparisonRule_1.ValueComparisonRule(">", 0), new ValueComparisonRule_1.ValueComparisonRule("<", 200)));
        let results1 = schema.validate(-100);
        assert.equal(results1.length, 1);
        let results2 = schema.validate(100);
        assert.equal(results2.length, 0);
        let results3 = schema.validate(200);
        assert.equal(results3.length, 1);
    });
});
//# sourceMappingURL=LogicalRules.test.js.map