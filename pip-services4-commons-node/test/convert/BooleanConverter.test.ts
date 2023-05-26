import chai = require('chai');
const assert = chai.assert;

import { BooleanConverter } from '../../src/convert/BooleanConverter';

suite('BooleanConverter', ()=> {

    test('To Boolean', () => {
        assert.isTrue(BooleanConverter.toBoolean(true));
        assert.isTrue(BooleanConverter.toBoolean(1));
        assert.isTrue(BooleanConverter.toBoolean(123));
        assert.isTrue(BooleanConverter.toBoolean('True'));
        assert.isTrue(BooleanConverter.toBoolean('yes'));
        assert.isTrue(BooleanConverter.toBoolean('1'));
        assert.isTrue(BooleanConverter.toBoolean('Y'));

        assert.isFalse(BooleanConverter.toBoolean(false));
        assert.isFalse(BooleanConverter.toBoolean(0));
        assert.isFalse(BooleanConverter.toBoolean('False'));
        assert.isFalse(BooleanConverter.toBoolean('no'));
        assert.isFalse(BooleanConverter.toBoolean('0'));
        assert.isFalse(BooleanConverter.toBoolean('N'));
        
        assert.isTrue(BooleanConverter.toBooleanWithDefault('XYZ', true));
    });

});
