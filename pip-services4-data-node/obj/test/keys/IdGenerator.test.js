"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IdGenerator_1 = require("../../src/keys/IdGenerator");
const assert = require('chai').assert;
suite('IdGenerator', () => {
    test('Short Id', () => {
        let id1 = IdGenerator_1.IdGenerator.nextShort();
        assert.isNotNull(id1);
        assert.isTrue(id1.length >= 9);
        let id2 = IdGenerator_1.IdGenerator.nextShort();
        assert.isNotNull(id2);
        assert.isTrue(id2.length >= 9);
        assert.isFalse(id1 == id2);
    });
    test('Long Id', () => {
        let id1 = IdGenerator_1.IdGenerator.nextLong();
        assert.isNotNull(id1);
        assert.isTrue(id1.length >= 32);
        let id2 = IdGenerator_1.IdGenerator.nextLong();
        assert.isNotNull(id2);
        assert.isTrue(id2.length >= 32);
        assert.isFalse(id1 == id2);
    });
});
//# sourceMappingURL=IdGenerator.test.js.map