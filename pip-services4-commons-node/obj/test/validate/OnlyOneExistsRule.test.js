"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const TestObject_1 = require("./TestObject");
const Schema_1 = require("../../src/validate/Schema");
const OnlyOneExistsRule_1 = require("../../src/validate/OnlyOneExistsRule");
suite('OnlyOneExistsRule', () => {
    test('OnlyOneExistsRule', () => {
        let obj = new TestObject_1.TestObject();
        let schema = new Schema_1.Schema().withRule(new OnlyOneExistsRule_1.OnlyOneExistsRule("missingProperty", "stringProperty", "nullProperty"));
        let results = schema.validate(obj);
        assert.equal(results.length, 0);
        schema = new Schema_1.Schema().withRule(new OnlyOneExistsRule_1.OnlyOneExistsRule("stringProperty", "nullProperty", "intField"));
        results = schema.validate(obj);
        assert.equal(results.length, 1);
    });
});
//# sourceMappingURL=OnlyOneExistsRule.test.js.map