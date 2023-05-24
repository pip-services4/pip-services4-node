"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const Variant_1 = require("../../src/variants/Variant");
const VariantType_1 = require("../../src/variants/VariantType");
const TypeUnsafeVariantOperations_1 = require("../../src/variants/TypeUnsafeVariantOperations");
suite('TypeUnsafeVariantOperations', () => {
    test('Operations', () => {
        let a = new Variant_1.Variant("123");
        let manager = new TypeUnsafeVariantOperations_1.TypeUnsafeVariantOperations();
        let b = manager.convert(a, VariantType_1.VariantType.Float);
        assert.equal(VariantType_1.VariantType.Float, b.type);
        assert.equal(123.0, b.asFloat);
        let c = new Variant_1.Variant(2);
        assert.equal(125.0, manager.add(b, c).asFloat);
        assert.equal(121.0, manager.sub(b, c).asFloat);
        assert.isTrue(manager.equal(a, b).asBoolean);
    });
});
//# sourceMappingURL=TypeUnsafeVariantOperations.test.js.map