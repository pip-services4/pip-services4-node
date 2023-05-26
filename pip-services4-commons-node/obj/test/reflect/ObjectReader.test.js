"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const TestClass_1 = require("./TestClass");
const ObjectReader_1 = require("../../src/reflect/ObjectReader");
suite('ObjectReader', () => {
    test('Get Object Property', () => {
        const obj = new TestClass_1.TestClass();
        let value = ObjectReader_1.ObjectReader.getProperty(obj, "privateField");
        //assert.isNull(value);
        value = ObjectReader_1.ObjectReader.getProperty(obj, "publicField");
        assert.equal("ABC", value);
        value = ObjectReader_1.ObjectReader.getProperty(obj, "PublicProp");
        assert.isNotNull(value);
    });
    test('Get Map Property', () => {
        const map = {
            "key1": 123,
            "key2": "ABC"
        };
        let value = ObjectReader_1.ObjectReader.getProperty(map, "key3");
        assert.isNull(value);
        value = ObjectReader_1.ObjectReader.getProperty(map, "Key1");
        assert.equal(123, value);
        value = ObjectReader_1.ObjectReader.getProperty(map, "KEY2");
        assert.equal("ABC", value);
    });
    test('Get Array Property', () => {
        const list = [123, "ABC"];
        let value = ObjectReader_1.ObjectReader.getProperty(list, "3");
        assert.isNull(value);
        value = ObjectReader_1.ObjectReader.getProperty(list, "0");
        assert.equal(123, value);
        value = ObjectReader_1.ObjectReader.getProperty(list, "1");
        assert.equal("ABC", value);
    });
    test('Get Object Properties', () => {
        const obj = new TestClass_1.TestClass();
        const names = ObjectReader_1.ObjectReader.getPropertyNames(obj);
        //assert.equal(2, names.length);
        assert.isTrue(names.indexOf("publicField") >= 0);
        assert.isTrue(names.indexOf("publicProp") >= 0);
        const map = ObjectReader_1.ObjectReader.getProperties(obj);
        //assert.equals(2, map.length);
        assert.equal("ABC", map["publicField"]);
        assert.isNotNull(map["publicProp"]);
    });
    test('Get Map Properties', () => {
        const map = {
            "key1": 123,
            "key2": "ABC"
        };
        const names = ObjectReader_1.ObjectReader.getPropertyNames(map);
        assert.equal(2, names.length);
        assert.isTrue(names.indexOf("key1") >= 0);
        assert.isTrue(names.indexOf("key2") >= 0);
        const values = ObjectReader_1.ObjectReader.getProperties(map);
        //assert.equal(2, values.lemgth);
        assert.equal(123, values["key1"]);
        assert.equal("ABC", values["key2"]);
    });
    test('Get Map Properties', () => {
        const list = [123, "ABC"];
        let names = ObjectReader_1.ObjectReader.getPropertyNames(list);
        assert.equal(2, names.length);
        assert.isTrue(names.indexOf("0") >= 0);
        assert.isTrue(names.indexOf("1") >= 0);
        let values = ObjectReader_1.ObjectReader.getProperties(list);
        //assert.equal(2, values.lenth);
        assert.equal(123, values["0"]);
        assert.equal("ABC", values["1"]);
        const array = [123, "ABC"];
        names = ObjectReader_1.ObjectReader.getPropertyNames(array);
        assert.equal(2, names.length);
        assert.isTrue(names.indexOf("0") >= 0);
        assert.isTrue(names.indexOf("1") >= 0);
        values = ObjectReader_1.ObjectReader.getProperties(array);
        //assert.equal(2, values.length);
        assert.equal(123, values["0"]);
        assert.equal("ABC", values["1"]);
    });
});
//# sourceMappingURL=ObjectReader.test.js.map