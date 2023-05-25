"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PagingParams_1 = require("../../src/query/PagingParams");
const assert = require('chai').assert;
suite('PagingParams', () => {
    test('Create empty PagingParams (regular)', () => {
        let paging = new PagingParams_1.PagingParams();
        assert.equal(null, paging.skip);
        assert.equal(null, paging.take);
        assert.equal(false, paging.total);
    });
    test('Create empty PagingParams (gRPC)', () => {
        let paging = new PagingParams_1.PagingParams(0, 0, false);
        assert.equal(0, paging.skip);
        assert.equal(null, paging.take);
        assert.equal(false, paging.total);
    });
    test('Create PagingParams with set skip/take values', () => {
        let paging = new PagingParams_1.PagingParams(25, 50, false);
        assert.equal(25, paging.skip);
        assert.equal(50, paging.take);
        assert.equal(false, paging.total);
    });
    test('getSkip & getTake', () => {
        let paging = new PagingParams_1.PagingParams(25, 50, false);
        assert.equal(50, paging.getSkip(50));
        assert.equal(25, paging.getSkip(10));
        assert.equal(50, paging.getTake(100));
        assert.equal(25, paging.getTake(25));
        paging = new PagingParams_1.PagingParams();
        assert.equal(10, paging.getSkip(10));
        assert.equal(10, paging.getTake(10));
    });
});
//# sourceMappingURL=PagingParams.test.js.map