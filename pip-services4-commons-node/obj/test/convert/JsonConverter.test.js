"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const TypeCode_1 = require("../../src/convert/TypeCode");
const DateTimeConverter_1 = require("../../src/convert/DateTimeConverter");
const JsonConverter_1 = require("../../src/convert/JsonConverter");
suite('JsonConverter', () => {
    test('To Json', () => {
        assert.isNull(JsonConverter_1.JsonConverter.toJson(null));
        assert.equal("123", JsonConverter_1.JsonConverter.toJson(123));
        assert.equal("\"ABC\"", JsonConverter_1.JsonConverter.toJson("ABC"));
        const filter = { "Key1": 123, "Key2": "ABC" };
        const jsonFilter = JsonConverter_1.JsonConverter.toJson(filter);
        assert.equal("{\"Key1\":123,\"Key2\":\"ABC\"}", jsonFilter);
        const array = [123, "ABC"];
        const jsonArray = JsonConverter_1.JsonConverter.toJson(array);
        assert.equal("[123,\"ABC\"]", jsonArray);
        const date = DateTimeConverter_1.DateTimeConverter.toDateTime("1975-04-08T00:00:00.000Z");
        const jsonDate = JsonConverter_1.JsonConverter.toJson(date);
        assert.equal("\"1975-04-08T00:00:00.000Z\"", jsonDate);
    });
    test('From Json', () => {
        assert.equal(123, JsonConverter_1.JsonConverter.fromJson(TypeCode_1.TypeCode.Integer, "123"));
        assert.equal("ABC", JsonConverter_1.JsonConverter.fromJson(TypeCode_1.TypeCode.String, "\"ABC\""));
        const filter = JsonConverter_1.JsonConverter.fromJson(null, "{\"Key2\":\"ABC\",\"Key1\":\"123\"}");
        assert.isObject(filter);
        const array = JsonConverter_1.JsonConverter.fromJson(TypeCode_1.TypeCode.Array, "[123,\"ABC\"]");
        assert.equal(2, array.length);
        const date = DateTimeConverter_1.DateTimeConverter.toDateTime("1975-04-08T00:00:00.000Z");
        const jsonDate = JsonConverter_1.JsonConverter.fromJson(TypeCode_1.TypeCode.DateTime, "\"1975-04-08T00:00Z\"");
        assert.equal(date.getTime(), jsonDate.getTime());
    });
    test('To Json Map', () => {
        // Handling simple objects
        let value = "{ \"value1\":123, \"value2\":234 }";
        let result = JsonConverter_1.JsonConverter.toNullableMap(value);
        assert.equal(123, result.value1);
        assert.equal(234, result.value2);
        // Recursive conversion
        value = "{ \"value1\":123, \"value2\": { \"value1\": 111, \"value2\": 222 } }";
        result = JsonConverter_1.JsonConverter.toNullableMap(value);
        assert.isNotNull(result);
        assert.equal(123, result.value1);
        assert.isNotNull(result.value2);
        assert.isObject(result.value2);
        // Handling arrays
        value = "{ \"value1\": [{ \"value1\": 111, \"value2\": 222 }] }";
        result = JsonConverter_1.JsonConverter.toNullableMap(value);
        assert.isNotNull(result);
        assert.isArray(result.value1);
        const resultElements = result.value1;
        const resultElement0 = resultElements[0];
        assert.isNotNull(resultElement0);
        assert.equal(111, resultElement0.value1);
        assert.equal(222, resultElement0.value2);
    });
});
//# sourceMappingURL=JsonConverter.test.js.map