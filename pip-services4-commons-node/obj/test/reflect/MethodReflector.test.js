"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const TestClass_1 = require("./TestClass");
const MethodReflector_1 = require("../../src/reflect/MethodReflector");
suite('MethodReflector', () => {
    test('Get Methods', () => {
        const obj = new TestClass_1.TestClass();
        const methods = MethodReflector_1.MethodReflector.getMethodNames(obj);
        assert.equal(3, methods.length);
        const result = MethodReflector_1.MethodReflector.invokeMethod(obj, "PUBLICMETHOD", 1, 2);
        assert.equal(3, result);
    });
    test('Has Methods', () => {
        const obj = new TestClass_1.TestClass();
        const result = MethodReflector_1.MethodReflector.hasMethod(obj, "publicMethod");
        assert.isTrue(result);
    });
});
//# sourceMappingURL=MethodReflector.test.js.map