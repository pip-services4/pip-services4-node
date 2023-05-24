const assert = require('chai').assert;

import { LongConverter } from '../../src/convert/LongConverter';

suite('LongConverter', ()=> {

    test('To Long', () => {
        assert.equal(123, LongConverter.toLong(123));
        assert.equal(123, LongConverter.toLong(123.456));
        assert.equal(123, LongConverter.toLong('123'));
        assert.equal(123, LongConverter.toLong(new Date(123)));
        
        assert.equal(123, LongConverter.toLongWithDefault(null, 123));
        assert.equal(0, LongConverter.toLongWithDefault(false, 123));
        assert.equal(123, LongConverter.toLongWithDefault('ABC', 123));
    });  

});
