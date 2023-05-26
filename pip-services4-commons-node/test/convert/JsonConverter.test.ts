import chai = require('chai');
const assert = chai.assert;

import { TypeCode } from '../../src/convert/TypeCode';
import { DateTimeConverter } from '../../src/convert/DateTimeConverter';
import { JsonConverter } from '../../src/convert/JsonConverter';

suite('JsonConverter', ()=> {

    test('To Json', () => {
      assert.isNull(JsonConverter.toJson(null));
      assert.equal("123", JsonConverter.toJson(123));
      assert.equal("\"ABC\"", JsonConverter.toJson("ABC"));
          
      const filter = { "Key1": 123, "Key2": "ABC" };
      const jsonFilter = JsonConverter.toJson(filter);
      assert.equal("{\"Key1\":123,\"Key2\":\"ABC\"}", jsonFilter);
      
      const array = [ 123, "ABC" ];
      const jsonArray = JsonConverter.toJson(array);
      assert.equal("[123,\"ABC\"]", jsonArray);

      const date = DateTimeConverter.toDateTime("1975-04-08T00:00:00.000Z");
      const jsonDate = JsonConverter.toJson(date);
      assert.equal("\"1975-04-08T00:00:00.000Z\"", jsonDate);
    });

    test('From Json', () => {
      assert.equal(123, JsonConverter.fromJson<number>(TypeCode.Integer, "123"));
      assert.equal("ABC", JsonConverter.fromJson<string>(TypeCode.String, "\"ABC\""));
          
      const filter = JsonConverter.fromJson(null, "{\"Key2\":\"ABC\",\"Key1\":\"123\"}");
      assert.isObject(filter);
		
      const array = JsonConverter.fromJson<any[]>(TypeCode.Array, "[123,\"ABC\"]");
      assert.equal(2, array.length);

      const date = DateTimeConverter.toDateTime("1975-04-08T00:00:00.000Z");
      const jsonDate = JsonConverter.fromJson<Date>(TypeCode.DateTime, "\"1975-04-08T00:00Z\"");
      assert.equal(date.getTime(), jsonDate.getTime());
    });

    test('To Json Map', () => {
		// Handling simple objects
      let value = "{ \"value1\":123, \"value2\":234 }";
      let result = JsonConverter.toNullableMap(value);
      assert.equal(123, result.value1);
      assert.equal(234, result.value2);

      // Recursive conversion
      value = "{ \"value1\":123, \"value2\": { \"value1\": 111, \"value2\": 222 } }";
      result = JsonConverter.toNullableMap(value);
      assert.isNotNull(result);
      assert.equal(123, result.value1);
      assert.isNotNull(result.value2);
      assert.isObject(result.value2);

      // Handling arrays
      value = "{ \"value1\": [{ \"value1\": 111, \"value2\": 222 }] }";
      result = JsonConverter.toNullableMap(value);
      assert.isNotNull(result);
      assert.isArray(result.value1);
      const resultElements: any[] = result.value1;
      const resultElement0: any = resultElements[0];
      assert.isNotNull(resultElement0);
      assert.equal(111, resultElement0.value1);
      assert.equal(222, resultElement0.value2);
    });

});
