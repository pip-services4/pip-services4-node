"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const TestClass_1 = require("./TestClass");
const ObjectWriter_1 = require("../../src/reflect/ObjectWriter");
suite('ObjectWriter', () => {
    test('Set Object Property', () => {
        const obj = new TestClass_1.TestClass();
        ObjectWriter_1.ObjectWriter.setProperty(obj, "privateField", "XYZ");
        ObjectWriter_1.ObjectWriter.setProperty(obj, "publicField", "AAAA");
        assert.equal("AAAA", obj.publicField);
        const now = new Date();
        ObjectWriter_1.ObjectWriter.setProperty(obj, "publicProp", now);
        assert.equal(now, obj.publicProp);
        ObjectWriter_1.ObjectWriter.setProperty(obj, "publicProp", "BBBB");
        //assert.equal(now, obj.publicProp);
    });
    test('Set Map Property', () => {
        const map = {
            "key1": 123,
            "key2": "ABC"
        };
        ObjectWriter_1.ObjectWriter.setProperty(map, "key3", "AAAA");
        assert.equal("AAAA", map["key3"]);
        ObjectWriter_1.ObjectWriter.setProperty(map, "Key1", 5555);
        assert.equal(5555, map["key1"]);
        ObjectWriter_1.ObjectWriter.setProperty(map, "Key2", "BBBB");
        assert.equal("BBBB", map["key2"]);
    });
    test('Set Array Property', () => {
        const list = [123, "ABC"];
        ObjectWriter_1.ObjectWriter.setProperty(list, "3", "AAAA");
        assert.equal(4, list.length);
        assert.equal("AAAA", list[3]);
        ObjectWriter_1.ObjectWriter.setProperty(list, "0", 1111);
        assert.equal(1111, list[0]);
        ObjectWriter_1.ObjectWriter.setProperty(list, "1", "BBBB");
        assert.equal("BBBB", list[1]);
        const array = [123, "ABC"];
        ObjectWriter_1.ObjectWriter.setProperty(array, "3", "AAAA");
        assert.equal(4, array.length);
        ObjectWriter_1.ObjectWriter.setProperty(array, "0", 1111);
        assert.equal(1111, array[0]);
        ObjectWriter_1.ObjectWriter.setProperty(array, "1", "BBBB");
        assert.equal("BBBB", array[1]);
    });
});
//# sourceMappingURL=ObjectWriter.test.js.map