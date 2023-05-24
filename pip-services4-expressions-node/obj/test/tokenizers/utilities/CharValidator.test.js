"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const CharValidator_1 = require("../../../src/tokenizers/utilities/CharValidator");
suite('CharValidator', () => {
    test('IsEof', () => {
        assert.isTrue(CharValidator_1.CharValidator.isEof(0xffff));
        assert.isFalse(CharValidator_1.CharValidator.isEof('A'.charCodeAt(0)));
    });
    test('IsEol', () => {
        assert.isTrue(CharValidator_1.CharValidator.isEol(10));
        assert.isTrue(CharValidator_1.CharValidator.isEol(13));
        assert.isFalse(CharValidator_1.CharValidator.isEof('A'.charCodeAt(0)));
    });
    test('IsDigit', () => {
        assert.isTrue(CharValidator_1.CharValidator.isDigit('0'.charCodeAt(0)));
        assert.isTrue(CharValidator_1.CharValidator.isDigit('7'.charCodeAt(0)));
        assert.isTrue(CharValidator_1.CharValidator.isDigit('9'.charCodeAt(0)));
        assert.isFalse(CharValidator_1.CharValidator.isDigit('A'.charCodeAt(0)));
    });
});
//# sourceMappingURL=CharValidator.test.js.map