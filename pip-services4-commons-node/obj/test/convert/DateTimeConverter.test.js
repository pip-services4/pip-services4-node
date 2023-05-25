"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const DateTimeConverter_1 = require("../../src/convert/DateTimeConverter");
suite('DateTimeConverter', () => {
    // Todo: Add more tests with time and conversion of ISO datetime
    test('To DateTime', () => {
        assert.equal(null, DateTimeConverter_1.DateTimeConverter.toNullableDateTime(null));
        assert.equal(new Date(1975, 3, 8).toString(), DateTimeConverter_1.DateTimeConverter.toDateTimeWithDefault(null, new Date(1975, 3, 8)).toString());
        assert.equal(new Date(1975, 3, 8).toString(), DateTimeConverter_1.DateTimeConverter.toDateTime(new Date(1975, 3, 8)).toString());
        assert.equal(new Date(123456).toString(), DateTimeConverter_1.DateTimeConverter.toDateTime(123456).toString());
        assert.equal(new Date(1975, 3, 8).toString(), DateTimeConverter_1.DateTimeConverter.toDateTime('1975/04/08').toString());
        assert.equal(null, DateTimeConverter_1.DateTimeConverter.toNullableDateTime('XYZ'));
    });
});
//# sourceMappingURL=DateTimeConverter.test.js.map