import chai = require('chai');
const assert = chai.assert;

import { TypeCode } from '../../src/convert/TypeCode';
import { TypeConverter } from '../../src/convert/TypeConverter';
import { DateTimeConverter } from '../../src/convert/DateTimeConverter';

suite('TypeConverter', ()=> {

    test('To Type Code', () => {
        // assert.equal(TypeCode.String, TypeConverter.toTypeCode(typeof("abc")));
		// assert.equal(TypeCode.Double, TypeConverter.toTypeCode(typeof(123)));
        // assert.equal(TypeCode.Double, TypeConverter.toTypeCode(typeof(123.456)));
        // assert.equal(TypeCode.Map, TypeConverter.toTypeCode(typeof(new Date())));
		// assert.equal(TypeCode.Map, TypeConverter.toTypeCode(typeof([])));
		// assert.equal(TypeCode.Map, TypeConverter.toTypeCode(typeof({})));
		// assert.equal(TypeCode.Object, TypeConverter.toTypeCode(typeof(() => true)));
		// assert.equal(TypeCode.Unknown, TypeConverter.toTypeCode(null));

		assert.equal(TypeCode.String, TypeConverter.toTypeCode("123"));
		assert.equal(TypeCode.Long, TypeConverter.toTypeCode(123));
		assert.equal(TypeCode.Double, TypeConverter.toTypeCode(123.456));
		assert.equal(TypeCode.DateTime, TypeConverter.toTypeCode(new Date()));
		//assert.equal(ConverterTypeCode.Enum, TypeConverter.toTypeCode(Enum.class));
		assert.equal(TypeCode.Array, TypeConverter.toTypeCode([]));
		assert.equal(TypeCode.Map, TypeConverter.toTypeCode({}));
        assert.equal(TypeCode.Object, TypeConverter.toTypeCode(() => true));
    });

    test('To Nullable Type', () => {
		assert.equal("123", TypeConverter.toNullableType<string>(TypeCode.String, 123));
		assert.equal(123, TypeConverter.toNullableType<number>(TypeCode.Integer, "123"));
		assert.equal(123, TypeConverter.toNullableType<number>(TypeCode.Long, 123.456));
		assert.isTrue(123 - TypeConverter.toNullableType<number>(TypeCode.Float, 123) < 0.001);
		assert.isTrue(123 - TypeConverter.toNullableType<number>(TypeCode.Double, 123) < 0.001);
        assert.equal(DateTimeConverter.toDateTime("1975-04-08T17:30:00.00Z").getTime(), 
            TypeConverter.toNullableType<Date>(TypeCode.DateTime, "1975-04-08T17:30:00.00Z").getTime());
        assert.equal(1, TypeConverter.toNullableType<any[]>(TypeCode.Array, 123).length);
		//assert.equal(1, TypeConverter.toNullableType<any>(TypeCode.Map, StringValueMap.fromString("abc=123")).length);
    });

    test('To Type', () => {
		assert.equal("123", TypeConverter.toType<string>(TypeCode.String, 123));
		assert.equal(123, TypeConverter.toType<number>(TypeCode.Integer, "123"));
		assert.equal(123, TypeConverter.toType<number>(TypeCode.Long, 123.456));
		assert.isTrue(123 - TypeConverter.toType<number>(TypeCode.Float, 123) < 0.001);
		assert.isTrue(123 - TypeConverter.toType<number>(TypeCode.Double, 123) < 0.001);
        assert.equal(DateTimeConverter.toDateTime("1975-04-08T17:30:00.00Z").getTime(), 
            TypeConverter.toType<Date>(TypeCode.DateTime, "1975-04-08T17:30:00.00Z").getTime());
        assert.equal(1, TypeConverter.toType<any[]>(TypeCode.Array, 123).length);
		//assert.equal(1, TypeConverter.toType<any>(TypeCode.Map, StringValueMap.fromString("abc=123")).length);
    });

    test('To Type With Default', () => {
		assert.equal("123", TypeConverter.toTypeWithDefault<string>(TypeCode.String, null, "123"));
		assert.equal(123, TypeConverter.toTypeWithDefault<number>(TypeCode.Integer, null, 123));
		assert.equal(123, TypeConverter.toTypeWithDefault<number>(TypeCode.Long, null, 123));
		assert.isTrue(123 - TypeConverter.toTypeWithDefault<number>(TypeCode.Float, null, 123) < 0.001);
		assert.isTrue(123 - TypeConverter.toTypeWithDefault<number>(TypeCode.Double, null, 123.) < 0.001);
        assert.equal(DateTimeConverter.toDateTime("1975-04-08T17:30:00.00Z").getTime(),
            TypeConverter.toTypeWithDefault<Date>(TypeCode.DateTime, "1975-04-08T17:30:00.00Z", null).getTime());
        assert.equal(1, TypeConverter.toTypeWithDefault<any[]>(TypeCode.Array, 123, null).length);
		//assert.equal(1, TypeConverter.toTypeWithDefault<any>(TypeCode.Map, StringValueMap.fromString("abc=123"), null)).length);
    });

});