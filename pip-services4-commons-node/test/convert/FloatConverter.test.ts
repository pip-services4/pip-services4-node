import chai = require('chai');
const assert = chai.assert;

import { FloatConverter } from '../../src/convert/FloatConverter';

suite('FloatConverter', ()=> {

    test('To Float', () => {
        assert.equal(123, FloatConverter.toFloat(123));
        assert.equal(123.456, FloatConverter.toFloat(123.456));
        assert.equal(123.456, FloatConverter.toFloat('123.456'));
        assert.equal(123, FloatConverter.toFloat(new Date(123)));
        
        assert.equal(123, FloatConverter.toFloatWithDefault(null, 123));
        assert.equal(0, FloatConverter.toFloatWithDefault(false, 123));
        assert.equal(123, FloatConverter.toFloatWithDefault('ABC', 123));
    });  

});
