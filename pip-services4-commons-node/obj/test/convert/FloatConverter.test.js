"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const FloatConverter_1 = require("../../src/convert/FloatConverter");
suite('FloatConverter', () => {
    test('To Float', () => {
        assert.equal(123, FloatConverter_1.FloatConverter.toFloat(123));
        assert.equal(123.456, FloatConverter_1.FloatConverter.toFloat(123.456));
        assert.equal(123.456, FloatConverter_1.FloatConverter.toFloat('123.456'));
        assert.equal(123, FloatConverter_1.FloatConverter.toFloat(new Date(123)));
        assert.equal(123, FloatConverter_1.FloatConverter.toFloatWithDefault(null, 123));
        assert.equal(0, FloatConverter_1.FloatConverter.toFloatWithDefault(false, 123));
        assert.equal(123, FloatConverter_1.FloatConverter.toFloatWithDefault('ABC', 123));
    });
});
//# sourceMappingURL=FloatConverter.test.js.map