const assert = require('chai').assert;

import { Variant } from '../../src/variants/Variant';
import { VariantType } from '../../src/variants/VariantType';
import { TypeSafeVariantOperations } from '../../src/variants/TypeSafeVariantOperations';

suite('TypeSafeVariantOperations', ()=> {
    test('Operations', () => {
        let a = new Variant(123);
        let manager = new TypeSafeVariantOperations();

        let b = manager.convert(a, VariantType.Float);
        assert.equal(VariantType.Float, b.type);
        assert.equal(123.0, b.asFloat);

        let c = new Variant(2);
        assert.equal(125, manager.add(a, c).asInteger);
        assert.equal(121, manager.sub(a, c).asInteger);
        assert.isFalse(manager.equal(a, c).asBoolean);

        let array = [ new Variant("aaa"), new Variant("bbb"), new Variant("ccc"), new Variant("ddd") ];
        let d = new Variant(array);
        assert.isTrue(manager.in(d, new Variant("ccc")).asBoolean);
        assert.isFalse(manager.in(d, new Variant("eee")).asBoolean);
        assert.equal("bbb", manager.getElement(d, new Variant(1)).asString);
    });    
});