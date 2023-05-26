"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const TypeCode_1 = require("../../src/convert/TypeCode");
const TypeMatcher_1 = require("../../src/reflect/TypeMatcher");
suite('TypeMatcher', () => {
    test('Match Integer', () => {
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueTypeByName("int", 123));
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueTypeByName("Integer", 123));
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueType(TypeCode_1.TypeCode.Long, 123));
    });
    test('Match Boolean', () => {
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueTypeByName("bool", true));
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueTypeByName("Boolean", true));
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueType(TypeCode_1.TypeCode.Boolean, true));
    });
    test('Match Double', () => {
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueTypeByName("double", 123.456));
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueTypeByName("Double", 123.456));
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueType(TypeCode_1.TypeCode.Double, 123.456));
    });
    test('Match String', () => {
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueTypeByName("string", "ABC"));
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueType(TypeCode_1.TypeCode.String, "ABC"));
    });
    test('Match DateTime', () => {
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueTypeByName("date", new Date()));
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueTypeByName("DateTime", new Date()));
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueType(TypeCode_1.TypeCode.DateTime, new Date()));
    });
    test('Match Map', () => {
        const map = {};
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueTypeByName("map", map));
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueTypeByName("dict", map));
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueTypeByName("Dictionary", map));
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueType(TypeCode_1.TypeCode.Map, map));
    });
    test('Match Array', () => {
        const array = [];
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueTypeByName("list", array));
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueTypeByName("array", array));
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueTypeByName("object[]", array));
        assert.isTrue(TypeMatcher_1.TypeMatcher.matchValueType(TypeCode_1.TypeCode.Array, array));
    });
});
//# sourceMappingURL=TypeMatcher.test.js.map