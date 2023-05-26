"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const ArrayConverter_1 = require("../../src/convert/ArrayConverter");
suite('ArrayConverter', () => {
    test('To Array', () => {
        let value = ArrayConverter_1.ArrayConverter.toArray(null);
        assert.isArray(value);
        assert.lengthOf(value, 0);
        value = ArrayConverter_1.ArrayConverter.toArray(123);
        assert.isArray(value);
        assert.lengthOf(value, 1);
        assert.equal(123, value[0]);
        value = ArrayConverter_1.ArrayConverter.toArray([123]);
        assert.isArray(value);
        assert.lengthOf(value, 1);
        assert.equal(123, value[0]);
        value = ArrayConverter_1.ArrayConverter.toArray('123');
        assert.isArray(value);
        assert.lengthOf(value, 1);
        assert.equal('123', value[0]);
        value = ArrayConverter_1.ArrayConverter.listToArray('123,456');
        assert.isArray(value);
        assert.lengthOf(value, 2);
        assert.equal('123', value[0]);
        assert.equal('456', value[1]);
        value = ArrayConverter_1.ArrayConverter.toArray({ field1: "abc", field2: 123 });
        assert.isArray(value);
        assert.lengthOf(value, 2);
        assert.equal('abc', value[0]);
        assert.equal(123, value[1]);
    });
});
//# sourceMappingURL=ArrayConverter.test.js.map