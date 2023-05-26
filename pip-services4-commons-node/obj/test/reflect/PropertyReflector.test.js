"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const TestClass_1 = require("./TestClass");
const PropertyReflector_1 = require("../../src/reflect/PropertyReflector");
suite('PropertyReflector', () => {
    test('Get Property', () => {
        const obj = new TestClass_1.TestClass();
        let value = PropertyReflector_1.PropertyReflector.getProperty(obj, "privateField");
        //assert.isNull(value);
        value = PropertyReflector_1.PropertyReflector.getProperty(obj, "publicField");
        assert.equal("ABC", value);
        value = PropertyReflector_1.PropertyReflector.getProperty(obj, "PublicProp");
        assert.isNotNull(value);
    });
    test('Get Properties', () => {
        const obj = new TestClass_1.TestClass();
        const names = PropertyReflector_1.PropertyReflector.getPropertyNames(obj);
        //assert.equal(2, names.length);
        assert.isTrue(names.indexOf("publicField") >= 0);
        assert.isTrue(names.indexOf("publicProp") >= 0);
        const map = PropertyReflector_1.PropertyReflector.getProperties(obj);
        assert.isObject(map);
        assert.equal("ABC", map["publicField"]);
        assert.isNotNull(map["publicProp"]);
    });
});
//# sourceMappingURL=PropertyReflector.test.js.map