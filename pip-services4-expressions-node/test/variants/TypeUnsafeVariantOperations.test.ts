const assert = require('chai').assert;

import { Variant } from '../../src/variants/Variant';
import { VariantType } from '../../src/variants/VariantType';
import { TypeUnsafeVariantOperations } from '../../src/variants/TypeUnsafeVariantOperations';

suite('TypeUnsafeVariantOperations', ()=> {
    test('Operations', () => {
        let a = new Variant("123");
        let manager = new TypeUnsafeVariantOperations();

        let b = manager.convert(a, VariantType.Float);
        assert.equal(VariantType.Float, b.type);
        assert.equal(123.0, b.asFloat);

        let c = new Variant(2);
        assert.equal(125.0, manager.add(b, c).asFloat);
        assert.equal(121.0, manager.sub(b, c).asFloat);
        assert.isTrue(manager.equal(a, b).asBoolean);
    });    
});