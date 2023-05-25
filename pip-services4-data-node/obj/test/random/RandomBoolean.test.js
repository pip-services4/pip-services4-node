"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const RandomBoolean_1 = require("../../src/random/RandomBoolean");
suite('RandomBoolean', () => {
    test('Chance', () => {
        let value = RandomBoolean_1.RandomBoolean.chance(5, 10);
        assert.isTrue(value || !value);
        value = RandomBoolean_1.RandomBoolean.chance(5, 5);
        assert.isTrue(value || !value);
        value = RandomBoolean_1.RandomBoolean.chance(0, 0);
        assert.isTrue(!value);
        value = RandomBoolean_1.RandomBoolean.chance(-1, 0);
        assert.isTrue(!value);
        value = RandomBoolean_1.RandomBoolean.chance(-1, -1);
        assert.isTrue(!value);
    });
});
//# sourceMappingURL=RandomBoolean.test.js.map