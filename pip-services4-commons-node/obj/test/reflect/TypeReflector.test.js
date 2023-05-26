"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const TypeReflector_1 = require("../../src/reflect/TypeReflector");
suite('TypeReflector', () => {
    test('Get Type', () => {
        const type = TypeReflector_1.TypeReflector.getType("TestClass", __dirname + "/TestClass");
        assert.isNotNull(type);
    });
    test('Create Instance', () => {
        const value = TypeReflector_1.TypeReflector.createInstance("TestClass", __dirname + "/TestClass", 123);
        assert.isNotNull(value);
    });
});
//# sourceMappingURL=TypeReflector.test.js.map