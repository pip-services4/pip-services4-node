"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const LongConverter_1 = require("../../src/convert/LongConverter");
suite('LongConverter', () => {
    test('To Long', () => {
        assert.equal(123, LongConverter_1.LongConverter.toLong(123));
        assert.equal(123, LongConverter_1.LongConverter.toLong(123.456));
        assert.equal(123, LongConverter_1.LongConverter.toLong('123'));
        assert.equal(123, LongConverter_1.LongConverter.toLong(new Date(123)));
        assert.equal(123, LongConverter_1.LongConverter.toLongWithDefault(null, 123));
        assert.equal(0, LongConverter_1.LongConverter.toLongWithDefault(false, 123));
        assert.equal(123, LongConverter_1.LongConverter.toLongWithDefault('ABC', 123));
    });
});
//# sourceMappingURL=LongConverter.test.js.map