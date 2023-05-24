"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const AnyValueArray_1 = require("../../src/data/AnyValueArray");
suite('AnyValueArray', () => {
    test('Create', () => {
        let array = new AnyValueArray_1.AnyValueArray();
        assert.equal(0, array.length);
        array = new AnyValueArray_1.AnyValueArray([1, 2, 3]);
        assert.equal(3, array.length);
        assert.equal("1,2,3", array.toString());
        array = AnyValueArray_1.AnyValueArray.fromString("Fatal,Error,Info,", ",");
        assert.equal(4, array.length);
        array = new AnyValueArray_1.AnyValueArray([1, 2, 3]);
        assert.equal(3, array.length);
        assert.isTrue(array.contains(1));
    });
});
//# sourceMappingURL=AnyValueArray.test.js.map