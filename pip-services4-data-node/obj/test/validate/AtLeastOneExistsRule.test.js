"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const TestObject_1 = require("./TestObject");
const Schema_1 = require("../../src/validate/Schema");
const AtLeastOneExistsRule_1 = require("../../src/validate/AtLeastOneExistsRule");
suite('AtLeastOneExistsRule', () => {
    test('Only One Exists Rule', () => {
        let obj = new TestObject_1.TestObject();
        let schema = new Schema_1.Schema().withRule(new AtLeastOneExistsRule_1.AtLeastOneExistsRule("missingProperty", "stringProperty", "nullProperty"));
        let results = schema.validate(obj);
        assert.equal(results.length, 0);
        schema = new Schema_1.Schema().withRule(new AtLeastOneExistsRule_1.AtLeastOneExistsRule("stringProperty", "nullProperty", "intField"));
        results = schema.validate(obj);
        assert.equal(results.length, 0);
        schema = new Schema_1.Schema().withRule(new AtLeastOneExistsRule_1.AtLeastOneExistsRule("missingProperty", "nullProperty"));
        results = schema.validate(obj);
        assert.equal(results.length, 1);
    });
});
//# sourceMappingURL=AtLeastOneExistsRule.test.js.map