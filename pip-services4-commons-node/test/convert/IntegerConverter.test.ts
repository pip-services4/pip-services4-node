const assert = require('chai').assert;

import { IntegerConverter } from '../../src/convert/IntegerConverter';

suite('IntegerConverter', ()=> {

    test('To Integer', () => {
        assert.equal(123, IntegerConverter.toInteger(123));
        assert.equal(123, IntegerConverter.toInteger(123.456));
        assert.equal(123, IntegerConverter.toInteger('123'));
        assert.equal(123, IntegerConverter.toInteger(new Date(123)));
        
        assert.equal(123, IntegerConverter.toIntegerWithDefault(null, 123));
        assert.equal(0, IntegerConverter.toIntegerWithDefault(false, 123));
        assert.equal(123, IntegerConverter.toIntegerWithDefault('ABC', 123));
    });  

});
