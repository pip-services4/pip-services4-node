"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const TestClass_1 = require("./TestClass");
const MethodReflector_1 = require("../../src/reflect/MethodReflector");
suite('MethodReflector', () => {
    test('Get Methods', () => {
        let obj = new TestClass_1.TestClass();
        let methods = MethodReflector_1.MethodReflector.getMethodNames(obj);
        assert.equal(3, methods.length);
        let result = MethodReflector_1.MethodReflector.invokeMethod(obj, "PUBLICMETHOD", 1, 2);
        assert.equal(3, result);
    });
    test('Has Methods', () => {
        let obj = new TestClass_1.TestClass();
        let result = MethodReflector_1.MethodReflector.hasMethod(obj, "publicMethod");
        assert.isTrue(result);
    });
});
//# sourceMappingURL=MethodReflector.test.js.map