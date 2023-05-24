const assert = require('chai').assert;

import { CharValidator } from '../../../src/tokenizers/utilities/CharValidator';

suite('CharValidator', ()=> {
    test('IsEof', () => {
        assert.isTrue(CharValidator.isEof(0xffff));
        assert.isFalse(CharValidator.isEof('A'.charCodeAt(0)));
    });    

    test('IsEol', () => {
        assert.isTrue(CharValidator.isEol(10));
        assert.isTrue(CharValidator.isEol(13));
        assert.isFalse(CharValidator.isEof('A'.charCodeAt(0)));
    });    

    test('IsDigit', () => {
        assert.isTrue(CharValidator.isDigit('0'.charCodeAt(0)));
        assert.isTrue(CharValidator.isDigit('7'.charCodeAt(0)));
        assert.isTrue(CharValidator.isDigit('9'.charCodeAt(0)));
        assert.isFalse(CharValidator.isDigit('A'.charCodeAt(0)));
    });    
});