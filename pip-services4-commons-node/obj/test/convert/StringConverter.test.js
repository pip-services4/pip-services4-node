"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const StringConverter_1 = require("../../src/convert/StringConverter");
suite('StringConverter', () => {
    test('To String', () => {
        assert.equal(null, StringConverter_1.StringConverter.toNullableString(null));
        assert.equal('xyz', StringConverter_1.StringConverter.toString('xyz'));
        assert.equal('123', StringConverter_1.StringConverter.toString(123));
        assert.equal('true', StringConverter_1.StringConverter.toString(true));
        assert.equal('[object Object]', StringConverter_1.StringConverter.toStringWithDefault({ prop: 'xyz' }, 'xyz'));
        assert.equal('xyz', StringConverter_1.StringConverter.toStringWithDefault(null, 'xyz'));
    });
});
//# sourceMappingURL=StringConverter.test.js.map