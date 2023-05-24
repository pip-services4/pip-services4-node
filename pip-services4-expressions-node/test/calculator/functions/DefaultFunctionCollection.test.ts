const assert = require('chai').assert;

import { StringConverter } from 'pip-services4-commons-node';
import { DefaultFunctionCollection } from '../../../src/calculator/functions/DefaultFunctionCollection';
import { Variant } from '../../../src/variants/Variant';
import { VariantType } from '../../../src/variants/VariantType';
import { TypeUnsafeVariantOperations } from '../../../src/variants/TypeUnsafeVariantOperations';

suite('DefaultFunctionCollection', ()=> {

    let testFunc = (params, operations, callback) => {
        callback(null, new Variant("ABC"));
    }

    test('CalculateFunctions', async () => {
        let collection = new DefaultFunctionCollection();
        let params = [
            new Variant(1),
            new Variant(2),
            new Variant(3)
        ];
        let operations = new TypeUnsafeVariantOperations();

        let func = collection.findByName("sum");
        assert.isNotNull(func);

        let result = await func.calculate(params, operations);
        assert.equal(VariantType.Integer, result.type);
        assert.equal(6, result.asInteger);
    });    

    test('DateFunctions', async () => {
        let collection = new DefaultFunctionCollection();
        let params = [];
        let operations = new TypeUnsafeVariantOperations();

        let func = collection.findByName("now");
        assert.isNotNull(func);

        let result = await func.calculate(params, operations);
        assert.equal(VariantType.DateTime, result.type);

        collection = new DefaultFunctionCollection();
        params = [
            new Variant(1975),
            new Variant(4),
            new Variant(8)
        ];
        
        func = collection.findByName("date");
        assert.isNotNull(func);
        
        result = await func.calculate(params, operations);
        assert.equal(VariantType.DateTime, result.type);
        assert.equal(StringConverter.toString(new Date(1975,3,8)), StringConverter.toString(result.asDateTime));
    });        
});