"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const MapConverter_1 = require("../../src/convert/MapConverter");
suite('MapConverter', () => {
    test('To Nullable Map', () => {
        assert.isNull(MapConverter_1.MapConverter.toNullableMap(null));
        assert.isNull(MapConverter_1.MapConverter.toNullableMap(5));
        let array = [1, 2];
        let map = MapConverter_1.MapConverter.toNullableMap(array);
        assert.isDefined(map);
        assert.equal(1, map["0"]);
        assert.equal(2, map["1"]);
        let obj = { field1: "abc", field2: 123 };
        map = MapConverter_1.MapConverter.toNullableMap(obj);
        assert.isDefined(map);
        assert.equal("abc", map.field1);
        assert.equal(123, map.field2);
        assert.equal(null, MapConverter_1.MapConverter.toNullableMap(null));
        assert.equal(null, MapConverter_1.MapConverter.toNullableMap('xyz'));
    });
});
//# sourceMappingURL=MapConverter.test.js.map