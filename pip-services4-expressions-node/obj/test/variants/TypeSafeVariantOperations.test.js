"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const Variant_1 = require("../../src/variants/Variant");
const VariantType_1 = require("../../src/variants/VariantType");
const TypeSafeVariantOperations_1 = require("../../src/variants/TypeSafeVariantOperations");
suite('TypeSafeVariantOperations', () => {
    test('Operations', () => {
        let a = new Variant_1.Variant(123);
        let manager = new TypeSafeVariantOperations_1.TypeSafeVariantOperations();
        let b = manager.convert(a, VariantType_1.VariantType.Float);
        assert.equal(VariantType_1.VariantType.Float, b.type);
        assert.equal(123.0, b.asFloat);
        let c = new Variant_1.Variant(2);
        assert.equal(125, manager.add(a, c).asInteger);
        assert.equal(121, manager.sub(a, c).asInteger);
        assert.isFalse(manager.equal(a, c).asBoolean);
        let array = [new Variant_1.Variant("aaa"), new Variant_1.Variant("bbb"), new Variant_1.Variant("ccc"), new Variant_1.Variant("ddd")];
        let d = new Variant_1.Variant(array);
        assert.isTrue(manager.in(d, new Variant_1.Variant("ccc")).asBoolean);
        assert.isFalse(manager.in(d, new Variant_1.Variant("eee")).asBoolean);
        assert.equal("bbb", manager.getElement(d, new Variant_1.Variant(1)).asString);
    });
});
//# sourceMappingURL=TypeSafeVariantOperations.test.js.map