import chai = require('chai');
const assert = chai.assert;

import { RecursiveMapConverter } from '../../src/convert/RecursiveMapConverter';

suite('RecursiveMapConverter', ()=> {

    test('ToNullableMap leave as is Null', () => {
      assert.isNull(RecursiveMapConverter.toNullableMap(null));
    });

    test('ToNullableMap leave as is primitive types', () => {
      assert.equal(5, RecursiveMapConverter.toNullableMap(5));
      assert.equal("ABC", RecursiveMapConverter.toNullableMap("ABC"));
    });

    test('Array of Map to Map', () => {
        const array = [{field1: 1, field2: 2}, [ 7, 8]];
        const map = RecursiveMapConverter.toNullableMap(array);
        assert.isNotNull(map);

        const map0 = map["0"];
        const map1 = map["1"];

        assert.isNotNull(map0);
        assert.isNotNull(map1);
        
        assert.equal(map0.field1, 1);
        assert.equal(map0.field2, 2);

        assert.equal(map1["0"], 7);
        assert.equal(map1["1"], 8);
    });

});
