import chai = require('chai');
const assert = chai.assert;

import { DoubleConverter } from '../../src/convert/DoubleConverter';

suite('DoubleConverter', ()=> {

    test('To Decimal', () => {
        assert.equal(123, DoubleConverter.toDouble(123));
        assert.equal(123.456, DoubleConverter.toDouble(123.456));
        assert.equal(123.456, DoubleConverter.toDouble('123.456'));
        assert.equal(123, DoubleConverter.toDouble(new Date(123)));
        
        assert.equal(123, DoubleConverter.toDoubleWithDefault(null, 123));
        assert.equal(0, DoubleConverter.toDoubleWithDefault(false, 123));
        assert.equal(123, DoubleConverter.toDoubleWithDefault('ABC', 123));
    });  

});
