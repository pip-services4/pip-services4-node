const assert = require('chai').assert;

import { NullCache } from '../../src/cache/NullCache';

suite('NullCache', ()=> {
    let cache: NullCache = null;

    setup(() => {
        cache = new NullCache();
    });

    test('Retrieve Returns Null', async () => {
        let val = await cache.retrieve(null, "key1");
        assert.isNull(val);
    });    

    test('Store Returns Same Value', async () => {
        let key = "key1";
        let initVal = "value1";

        let val = await cache.store(null, key, initVal, 0);
        assert.equal(initVal, val);
    });    

});