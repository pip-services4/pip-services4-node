const assert = require('chai').assert;

import { Variant } from '../../src/variants/Variant';
import { VariantType } from '../../src/variants/VariantType';

suite('Variant', ()=> {
    test('Variants', () => {
        let a = new Variant(123);
        assert.equal(VariantType.Integer, a.type);
        assert.equal(123, a.asInteger);
        assert.equal(123, a.asObject);

        let b = new Variant("xyz");
        assert.equal(VariantType.String, b.type);
        assert.equal("xyz", b.asString);
        assert.equal("xyz", b.asObject);
    });    
});