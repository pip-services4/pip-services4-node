const assert = require('chai').assert;

import { MapConverter } from '../../src/convert/MapConverter';

suite('MapConverter', ()=> {

    test('To Nullable Map', () => {
		assert.isNull(MapConverter.toNullableMap(null));
		assert.isNull(MapConverter.toNullableMap(5));
		
		let array = [1, 2];
        let map = MapConverter.toNullableMap(array);
        assert.isDefined(map);
        assert.equal(1, map["0"]);
        assert.equal(2, map["1"]);
        
        let obj = { field1: "abc", field2: 123 };
        map = MapConverter.toNullableMap(obj);
        assert.isDefined(map);
        assert.equal("abc", map.field1);
        assert.equal(123, map.field2);

        assert.equal(null, MapConverter.toNullableMap(null));
        assert.equal(null, MapConverter.toNullableMap('xyz'));
    });

});
