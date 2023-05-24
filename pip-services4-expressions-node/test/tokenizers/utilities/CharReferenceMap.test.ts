const assert = require('chai').assert;

import { CharReferenceMap } from '../../../src/tokenizers/utilities/CharReferenceMap';

suite('CharReferenceMap', ()=> {
    test('DefaultInterval', () => {
        let map = new CharReferenceMap<any>();
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
        let map = new CharReferenceMap<any>();
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