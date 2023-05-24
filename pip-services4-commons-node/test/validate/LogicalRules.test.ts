const assert = require('chai').assert;

import { Schema } from '../../src/validate/Schema';
import { OrRule } from '../../src/validate/OrRule';
import { AndRule } from '../../src/validate/AndRule';
import { ValueComparisonRule } from '../../src/validate/ValueComparisonRule';

suite('Logical Rules', ()=> {

    test('OrRule', () => {
        let schema = new Schema().withRule(new OrRule(new ValueComparisonRule("=", 1), new ValueComparisonRule("=", 2)));

        let results = schema.validate(-100);
        assert.equal(results.length, 2);

        results = schema.validate(1);
        assert.equal(results.length, 0);

        results = schema.validate(200);
        assert.equal(results.length, 2);
    });    

    test('AndRule', () => {
        let schema = new Schema().withRule(new AndRule(new ValueComparisonRule(">", 0), new ValueComparisonRule("<", 200)));

        let results1 = schema.validate(-100);
        assert.equal(results1.length, 1);

        let results2 = schema.validate(100);
        assert.equal(results2.length, 0);

        let results3 = schema.validate(200);
        assert.equal(results3.length, 1);
    });    

});
