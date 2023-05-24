"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const CharReferenceMap_1 = require("../../../src/tokenizers/utilities/CharReferenceMap");
suite('CharReferenceMap', () => {
    test('DefaultInterval', () => {
        let map = new CharReferenceMap_1.CharReferenceMap();
        assert.isNull(map.lookup('A'.charCodeAt(0)));
        assert.isNull(map.lookup(0x2045));
        map.addDefaultInterval(true);
        assert.isDefined(map.lookup('A'.charCodeAt(0)));
        assert.isDefined(map.lookup(0x2045));
        map.clear();
        assert.isNull(map.lookup('A'.charCodeAt(0)));
        assert.isNull(map.lookup(0x2045));
    });
    test('Interval', () => {
        let map = new CharReferenceMap_1.CharReferenceMap();
        assert.isNull(map.lookup('A'.charCodeAt(0)));
        assert.isNull(map.lookup(0x2045));
        map.addInterval('A'.charCodeAt(0), 'z'.charCodeAt(0), true);
        assert.isDefined(map.lookup('A'.charCodeAt(0)));
        assert.isNull(map.lookup(0x2045));
        map.addInterval(0x2000, 0x20ff, true);
        assert.isDefined(map.lookup('A'.charCodeAt(0)));
        assert.isDefined(map.lookup(0x2045));
        map.clear();
        assert.isNull(map.lookup('A'.charCodeAt(0)));
        assert.isNull(map.lookup(0x2045));
        map.addInterval('A'.charCodeAt(0), 0x20ff, true);
        assert.isDefined(map.lookup('A'.charCodeAt(0)));
        assert.isDefined(map.lookup(0x2045));
    });
});
//# sourceMappingURL=CharReferenceMap.test.js.map