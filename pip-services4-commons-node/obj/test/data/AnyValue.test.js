"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const TypeCode_1 = require("../../src/convert/TypeCode");
const AnyValue_1 = require("../../src/data/AnyValue");
suite('AnyValue', () => {
    test('Get and Set', () => {
        let value = new AnyValue_1.AnyValue();
        assert.isNull(value.getAsObject());
        value.setAsObject(1);
        assert.equal(1, value.getAsInteger());
        assert.isTrue(1.0 - value.getAsFloat() < 0.001);
        assert.equal("1", value.getAsString());
    });
    test('Equal', () => {
        let value = new AnyValue_1.AnyValue(1);
        assert.isTrue(value.equals(1));
        assert.isTrue(value.equals(1.0));
        assert.isTrue(value.equals("1"));
        assert.isTrue(value.equalsAsType(TypeCode_1.TypeCode.Float, "1"));
    });
});
//# sourceMappingURL=AnyValue.test.js.map