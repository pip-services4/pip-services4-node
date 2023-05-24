const assert = require('chai').assert;

import { DelegatedFunction } from '../../../src/calculator/functions/DelegatedFunction';
import { FunctionCollection } from '../../../src/calculator/functions/FunctionCollection';
import { Variant } from '../../../src/variants/Variant';

suite('FunctionCollection', ()=> {

    let testFunc =  async (stack, operations) => {
        return new Variant("ABC");
    }

    test('AddRemoveFunctions', () => {
        let collection = new FunctionCollection();

        let func1 = new DelegatedFunction("ABC", testFunc);
        collection.add(func1);
        assert.equal(1, collection.length);

        let func2 = new DelegatedFunction("XYZ", testFunc);
        collection.add(func2);
        assert.equal(2, collection.length);

        let index = collection.findIndexByName("abc");
        assert.equal(0, index);

        let func = collection.findByName("Xyz");
        assert.equal(func2, func);

        collection.remove(0);
        assert.equal(1, collection.length);

        collection.removeByName("XYZ");
        assert.equal(0, collection.length);
    });    

});