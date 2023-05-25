"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SortField_1 = require("../../src/query/SortField");
const SortParams_1 = require("../../src/query/SortParams");
const assert = require('chai').assert;
suite('SortParams', () => {
    test('Create and Push', () => {
        let sort = new SortParams_1.SortParams(new SortField_1.SortField("f1"), new SortField_1.SortField("f2"));
        sort.push(new SortField_1.SortField("f3", false));
        assert.equal(3, sort.length);
    });
});
//# sourceMappingURL=SortParams.test.js.map