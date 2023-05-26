import chai = require('chai');
const assert = chai.assert;

import { StringConverter } from '../../src/convert/StringConverter';

suite('StringConverter', ()=> {

    test('To String', () => {
        assert.equal(null, StringConverter.toNullableString(null));
        assert.equal('xyz', StringConverter.toString('xyz'));
        assert.equal('123', StringConverter.toString(123));
        assert.equal('true', StringConverter.toString(true));
        assert.equal('[object Object]', StringConverter.toStringWithDefault({ prop: 'xyz' }, 'xyz'));

        assert.equal('xyz', StringConverter.toStringWithDefault(null, 'xyz'));
    });

});