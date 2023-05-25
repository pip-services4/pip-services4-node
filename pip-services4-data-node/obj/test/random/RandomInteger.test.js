"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const RandomInteger_1 = require("../../src/random/RandomInteger");
suite('RandomInteger', () => {
    test('Next Integer', () => {
        let value = RandomInteger_1.RandomInteger.nextInteger(5);
        assert.isTrue(value <= 5);
        value = RandomInteger_1.RandomInteger.nextInteger(2, 5);
        assert.isTrue(value <= 5 && value >= 2);
    });
    test('Update Integer', () => {
        let value = RandomInteger_1.RandomInteger.updateInteger(0, 5);
        assert.isTrue(value <= 5 && value >= -5);
        value = RandomInteger_1.RandomInteger.updateInteger(5, 0);
        assert.isTrue(value == 5);
        value = RandomInteger_1.RandomInteger.updateInteger(0);
        assert.isTrue(value == 0);
    });
    test('Sequence', () => {
        let list = RandomInteger_1.RandomInteger.sequence(1, 5);
        assert.isTrue(list.length <= 5 && list.length >= 1);
        list = RandomInteger_1.RandomInteger.sequence(-1, 0);
        assert.isTrue(list.length == 0);
        list = RandomInteger_1.RandomInteger.sequence(-1, -4);
        assert.isTrue(list.length == 0);
        list = RandomInteger_1.RandomInteger.sequence(4, 4);
        assert.isTrue(list.length == 4);
        list = RandomInteger_1.RandomInteger.sequence(5);
        assert.isTrue(list.length == 5);
    });
});
//# sourceMappingURL=RandomInteger.test.js.map