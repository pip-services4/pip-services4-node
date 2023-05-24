"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const TypeReflector_1 = require("../../src/reflect/TypeReflector");
suite('TypeReflector', () => {
    test('Get Type', () => {
        let type = TypeReflector_1.TypeReflector.getType("TestClass", __dirname + "/TestClass");
        assert.isNotNull(type);
    });
    test('Create Instance', () => {
        let value = TypeReflector_1.TypeReflector.createInstance("TestClass", __dirname + "/TestClass", 123);
        assert.isNotNull(value);
    });
});
//# sourceMappingURL=TypeReflector.test.js.map