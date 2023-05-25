"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const RandomDouble_1 = require("../../src/random/RandomDouble");
suite('RandomDouble', () => {
    test('Next Double', () => {
        let value = RandomDouble_1.RandomDouble.nextDouble(5);
        assert.isTrue(value <= 5);
        value = RandomDouble_1.RandomDouble.nextDouble(2, 5);
        assert.isTrue(value <= 5 && value >= 2);
    });
    test('Update Double', () => {
        let value = RandomDouble_1.RandomDouble.updateDouble(0, 5);
        assert.isTrue(value <= 5 && value >= -5);
        value = RandomDouble_1.RandomDouble.updateDouble(5, 0);
        value = RandomDouble_1.RandomDouble.updateDouble(0);
        assert.isTrue(value == 0);
    });
});
//# sourceMappingURL=RandomDouble.test.js.map