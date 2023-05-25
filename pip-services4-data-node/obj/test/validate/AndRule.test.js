"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const TestObject_1 = require("./TestObject");
const Schema_1 = require("../../src/validate/Schema");
const AndRule_1 = require("../../src/validate/AndRule");
const AtLeastOneExistsRule_1 = require("../../src/validate/AtLeastOneExistsRule");
suite('AndRule', () => {
    test('AndRule', () => {
        let obj = new TestObject_1.TestObject();
        let schema = new Schema_1.Schema().withRule(new AndRule_1.AndRule(new AtLeastOneExistsRule_1.AtLeastOneExistsRule("missingProperty", "stringProperty", "nullProperty"), new AtLeastOneExistsRule_1.AtLeastOneExistsRule("stringProperty", "nullProperty", "intField")));
        let results = schema.validate(obj);
        assert.equal(results.length, 0);
        schema = new Schema_1.Schema().withRule(new AndRule_1.AndRule(new AtLeastOneExistsRule_1.AtLeastOneExistsRule("missingProperty", "stringProperty", "nullProperty"), new AtLeastOneExistsRule_1.AtLeastOneExistsRule("missingProperty", "nullProperty")));
        results = schema.validate(obj);
        assert.equal(results.length, 1);
    });
});
//# sourceMappingURL=AndRule.test.js.map