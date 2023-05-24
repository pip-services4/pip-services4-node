"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const Schema_1 = require("../../src/validate/Schema");
const IncludedRule_1 = require("../../src/validate/IncludedRule");
const ExcludedRule_1 = require("../../src/validate/ExcludedRule");
suite('Inclusion Rules', () => {
    test('IncludedRule', () => {
        let schema = new Schema_1.Schema().withRule(new IncludedRule_1.IncludedRule("AAA", "BBB", "CCC", null));
        let results = schema.validate("AAA");
        assert.equal(results.length, 0);
        results = schema.validate("ABC");
        assert.equal(results.length, 1);
    });
    test('ExcludedRule', () => {
        let schema = new Schema_1.Schema().withRule(new ExcludedRule_1.ExcludedRule("AAA", "BBB", "CCC", null));
        let results = schema.validate("AAA");
        assert.equal(results.length, 1);
        results = schema.validate("ABC");
        assert.equal(results.length, 0);
    });
});
//# sourceMappingURL=InclusionRules.test.js.map