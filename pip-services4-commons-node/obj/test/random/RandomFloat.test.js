"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const RandomFloat_1 = require("../../src/random/RandomFloat");
suite('RandomFloat', () => {
    test('Next Float', () => {
        let value = RandomFloat_1.RandomFloat.nextFloat(5);
        assert.isTrue(value <= 5);
        value = RandomFloat_1.RandomFloat.nextFloat(2, 5);
        assert.isTrue(value <= 5 && value >= 2);
    });
    test('Update Float', () => {
        let value = RandomFloat_1.RandomFloat.updateFloat(0, 5);
        assert.isTrue(value <= 5 && value >= -5);
        value = RandomFloat_1.RandomFloat.updateFloat(5, 0);
        assert.isTrue(value >= 4.5 && value <= 5.5);
        value = RandomFloat_1.RandomFloat.updateFloat(0);
        assert.isTrue(value == 0);
    });
});
//# sourceMappingURL=RandomFloat.test.js.map