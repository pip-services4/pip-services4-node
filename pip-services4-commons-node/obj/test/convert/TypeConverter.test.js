"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const TypeCode_1 = require("../../src/convert/TypeCode");
const TypeConverter_1 = require("../../src/convert/TypeConverter");
const DateTimeConverter_1 = require("../../src/convert/DateTimeConverter");
suite('TypeConverter', () => {
    test('To Type Code', () => {
        // assert.equal(TypeCode.String, TypeConverter.toTypeCode(typeof("abc")));
        // assert.equal(TypeCode.Double, TypeConverter.toTypeCode(typeof(123)));
        // assert.equal(TypeCode.Double, TypeConverter.toTypeCode(typeof(123.456)));
        // assert.equal(TypeCode.Map, TypeConverter.toTypeCode(typeof(new Date())));
        // assert.equal(TypeCode.Map, TypeConverter.toTypeCode(typeof([])));
        // assert.equal(TypeCode.Map, TypeConverter.toTypeCode(typeof({})));
        // assert.equal(TypeCode.Object, TypeConverter.toTypeCode(typeof(() => true)));
        // assert.equal(TypeCode.Unknown, TypeConverter.toTypeCode(null));
        assert.equal(TypeCode_1.TypeCode.String, TypeConverter_1.TypeConverter.toTypeCode("123"));
        assert.equal(TypeCode_1.TypeCode.Long, TypeConverter_1.TypeConverter.toTypeCode(123));
        assert.equal(TypeCode_1.TypeCode.Double, TypeConverter_1.TypeConverter.toTypeCode(123.456));
        assert.equal(TypeCode_1.TypeCode.DateTime, TypeConverter_1.TypeConverter.toTypeCode(new Date()));
        //assert.equal(ConverterTypeCode.Enum, TypeConverter.toTypeCode(Enum.class));
        assert.equal(TypeCode_1.TypeCode.Array, TypeConverter_1.TypeConverter.toTypeCode([]));
        assert.equal(TypeCode_1.TypeCode.Map, TypeConverter_1.TypeConverter.toTypeCode({}));
        assert.equal(TypeCode_1.TypeCode.Object, TypeConverter_1.TypeConverter.toTypeCode(() => true));
    });
    test('To Nullable Type', () => {
        assert.equal("123", TypeConverter_1.TypeConverter.toNullableType(TypeCode_1.TypeCode.String, 123));
        assert.equal(123, TypeConverter_1.TypeConverter.toNullableType(TypeCode_1.TypeCode.Integer, "123"));
        assert.equal(123, TypeConverter_1.TypeConverter.toNullableType(TypeCode_1.TypeCode.Long, 123.456));
        assert.isTrue(123 - TypeConverter_1.TypeConverter.toNullableType(TypeCode_1.TypeCode.Float, 123) < 0.001);
        assert.isTrue(123 - TypeConverter_1.TypeConverter.toNullableType(TypeCode_1.TypeCode.Double, 123) < 0.001);
        assert.equal(DateTimeConverter_1.DateTimeConverter.toDateTime("1975-04-08T17:30:00.00Z").getTime(), TypeConverter_1.TypeConverter.toNullableType(TypeCode_1.TypeCode.DateTime, "1975-04-08T17:30:00.00Z").getTime());
        assert.equal(1, TypeConverter_1.TypeConverter.toNullableType(TypeCode_1.TypeCode.Array, 123).length);
        //assert.equal(1, TypeConverter.toNullableType<any>(TypeCode.Map, StringValueMap.fromString("abc=123")).length);
    });
    test('To Type', () => {
        assert.equal("123", TypeConverter_1.TypeConverter.toType(TypeCode_1.TypeCode.String, 123));
        assert.equal(123, TypeConverter_1.TypeConverter.toType(TypeCode_1.TypeCode.Integer, "123"));
        assert.equal(123, TypeConverter_1.TypeConverter.toType(TypeCode_1.TypeCode.Long, 123.456));
        assert.isTrue(123 - TypeConverter_1.TypeConverter.toType(TypeCode_1.TypeCode.Float, 123) < 0.001);
        assert.isTrue(123 - TypeConverter_1.TypeConverter.toType(TypeCode_1.TypeCode.Double, 123) < 0.001);
        assert.equal(DateTimeConverter_1.DateTimeConverter.toDateTime("1975-04-08T17:30:00.00Z").getTime(), TypeConverter_1.TypeConverter.toType(TypeCode_1.TypeCode.DateTime, "1975-04-08T17:30:00.00Z").getTime());
        assert.equal(1, TypeConverter_1.TypeConverter.toType(TypeCode_1.TypeCode.Array, 123).length);
        //assert.equal(1, TypeConverter.toType<any>(TypeCode.Map, StringValueMap.fromString("abc=123")).length);
    });
    test('To Type With Default', () => {
        assert.equal("123", TypeConverter_1.TypeConverter.toTypeWithDefault(TypeCode_1.TypeCode.String, null, "123"));
        assert.equal(123, TypeConverter_1.TypeConverter.toTypeWithDefault(TypeCode_1.TypeCode.Integer, null, 123));
        assert.equal(123, TypeConverter_1.TypeConverter.toTypeWithDefault(TypeCode_1.TypeCode.Long, null, 123));
        assert.isTrue(123 - TypeConverter_1.TypeConverter.toTypeWithDefault(TypeCode_1.TypeCode.Float, null, 123) < 0.001);
        assert.isTrue(123 - TypeConverter_1.TypeConverter.toTypeWithDefault(TypeCode_1.TypeCode.Double, null, 123.) < 0.001);
        assert.equal(DateTimeConverter_1.DateTimeConverter.toDateTime("1975-04-08T17:30:00.00Z").getTime(), TypeConverter_1.TypeConverter.toTypeWithDefault(TypeCode_1.TypeCode.DateTime, "1975-04-08T17:30:00.00Z", null).getTime());
        assert.equal(1, TypeConverter_1.TypeConverter.toTypeWithDefault(TypeCode_1.TypeCode.Array, 123, null).length);
        //assert.equal(1, TypeConverter.toTypeWithDefault<any>(TypeCode.Map, StringValueMap.fromString("abc=123"), null)).length);
    });
});
//# sourceMappingURL=TypeConverter.test.js.map