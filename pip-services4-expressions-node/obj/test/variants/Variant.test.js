"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const Variant_1 = require("../../src/variants/Variant");
const VariantType_1 = require("../../src/variants/VariantType");
suite('Variant', () => {
    test('Variants', () => {
        let a = new Variant_1.Variant(123);
        assert.equal(VariantType_1.VariantType.Integer, a.type);
        assert.equal(123, a.asInteger);
        assert.equal(123, a.asObject);
        let b = new Variant_1.Variant("xyz");
        assert.equal(VariantType_1.VariantType.String, b.type);
        assert.equal("xyz", b.asString);
        assert.equal("xyz", b.asObject);
    });
});
//# sourceMappingURL=Variant.test.js.map