"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const IntegerConverter_1 = require("../../src/convert/IntegerConverter");
suite('IntegerConverter', () => {
    test('To Integer', () => {
        assert.equal(123, IntegerConverter_1.IntegerConverter.toInteger(123));
        assert.equal(123, IntegerConverter_1.IntegerConverter.toInteger(123.456));
        assert.equal(123, IntegerConverter_1.IntegerConverter.toInteger('123'));
        assert.equal(123, IntegerConverter_1.IntegerConverter.toInteger(new Date(123)));
        assert.equal(123, IntegerConverter_1.IntegerConverter.toIntegerWithDefault(null, 123));
        assert.equal(0, IntegerConverter_1.IntegerConverter.toIntegerWithDefault(false, 123));
        assert.equal(123, IntegerConverter_1.IntegerConverter.toIntegerWithDefault('ABC', 123));
    });
});
//# sourceMappingURL=IntegerConverter.test.js.map