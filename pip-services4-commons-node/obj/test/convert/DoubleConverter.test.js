"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const DoubleConverter_1 = require("../../src/convert/DoubleConverter");
suite('DoubleConverter', () => {
    test('To Decimal', () => {
        assert.equal(123, DoubleConverter_1.DoubleConverter.toDouble(123));
        assert.equal(123.456, DoubleConverter_1.DoubleConverter.toDouble(123.456));
        assert.equal(123.456, DoubleConverter_1.DoubleConverter.toDouble('123.456'));
        assert.equal(123, DoubleConverter_1.DoubleConverter.toDouble(new Date(123)));
        assert.equal(123, DoubleConverter_1.DoubleConverter.toDoubleWithDefault(null, 123));
        assert.equal(0, DoubleConverter_1.DoubleConverter.toDoubleWithDefault(false, 123));
        assert.equal(123, DoubleConverter_1.DoubleConverter.toDoubleWithDefault('ABC', 123));
    });
});
//# sourceMappingURL=DoubleConverter.test.js.map