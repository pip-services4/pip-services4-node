"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const RandomArray_1 = require("../../src/random/RandomArray");
suite('RandomArray', () => {
    test('Pick', () => {
        let listEmpty = [];
        let value = RandomArray_1.RandomArray.pick(listEmpty);
        assert.isTrue(value == null);
        let array = [1, 2];
        value = RandomArray_1.RandomArray.pick(array);
        assert.isTrue(value == 1 || value == 2);
        let list = [];
        assert.isNull(RandomArray_1.RandomArray.pick(list));
        list = [1, 2];
        value = RandomArray_1.RandomArray.pick(array);
        assert.isTrue(value == 1 || value == 2);
    });
});
//# sourceMappingURL=RandomArray.test.js.map