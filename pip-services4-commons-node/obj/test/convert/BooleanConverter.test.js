"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const BooleanConverter_1 = require("../../src/convert/BooleanConverter");
suite('BooleanConverter', () => {
    test('To Boolean', () => {
        assert.isTrue(BooleanConverter_1.BooleanConverter.toBoolean(true));
        assert.isTrue(BooleanConverter_1.BooleanConverter.toBoolean(1));
        assert.isTrue(BooleanConverter_1.BooleanConverter.toBoolean(123));
        assert.isTrue(BooleanConverter_1.BooleanConverter.toBoolean('True'));
        assert.isTrue(BooleanConverter_1.BooleanConverter.toBoolean('yes'));
        assert.isTrue(BooleanConverter_1.BooleanConverter.toBoolean('1'));
        assert.isTrue(BooleanConverter_1.BooleanConverter.toBoolean('Y'));
        assert.isFalse(BooleanConverter_1.BooleanConverter.toBoolean(false));
        assert.isFalse(BooleanConverter_1.BooleanConverter.toBoolean(0));
        assert.isFalse(BooleanConverter_1.BooleanConverter.toBoolean('False'));
        assert.isFalse(BooleanConverter_1.BooleanConverter.toBoolean('no'));
        assert.isFalse(BooleanConverter_1.BooleanConverter.toBoolean('0'));
        assert.isFalse(BooleanConverter_1.BooleanConverter.toBoolean('N'));
        assert.isTrue(BooleanConverter_1.BooleanConverter.toBooleanWithDefault('XYZ', true));
    });
});
//# sourceMappingURL=BooleanConverter.test.js.map