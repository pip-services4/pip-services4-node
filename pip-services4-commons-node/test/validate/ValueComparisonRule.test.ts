const assert = require('chai').assert;

import { TestObject } from './TestObject';
import { Schema } from '../../src/validate/Schema';
import { ValueComparisonRule } from '../../src/validate/ValueComparisonRule';

suite('ValueComparisonRule', ()=> {

    test('Number Equal Comparison', () => {
        let schema = new Schema().withRule(new ValueComparisonRule("EQ", 123));
        let results = schema.validate(123);
        assert.equal(results.length, 0);

        results = schema.validate(432);
        assert.equal(results.length, 1);
    });    

    test('String Equal Comparison', () => {
        let schema = new Schema().withRule(new ValueComparisonRule("EQ", "ABC"));
        let results = schema.validate("ABC");
        assert.equal(results.length, 0);

        results = schema.validate("XYZ");
        assert.equal(results.length, 1);
    });    

    test('Number Not Equal Comparison', () => {
        let schema = new Schema().withRule(new ValueComparisonRule("NE", 123));
        let results = schema.validate(123);
        assert.equal(results.length, 1);

        results = schema.validate(432);
        assert.equal(results.length, 0);
    });    

    test('String Not Equal Comparison', () => {
        let schema = new Schema().withRule(new ValueComparisonRule("NE", "ABC"));
        let results = schema.validate("ABC");
        assert.equal(results.length, 1);

        results = schema.validate("XYZ");
        assert.equal(results.length, 0);
    });    

    test('Less Than or Equal Comparison', () => {
        let schema = new Schema().withRule(new ValueComparisonRule("LE", 123));
        let results = schema.validate(123);
        assert.equal(results.length, 0);

        results = schema.validate(432);
        assert.equal(results.length, 1);
    });    

    test('Less Than Comparison', () => {
        let schema = new Schema().withRule(new ValueComparisonRule("LT", 123));
        let results = schema.validate(123);
        assert.equal(results.length, 1);

        results = schema.validate(0);
        assert.equal(results.length, 0);
    });    

    test('More Than or Equal Comparison', () => {
        let schema = new Schema().withRule(new ValueComparisonRule("GE", 123));
        let results = schema.validate(123);
        assert.equal(results.length, 0);

        results = schema.validate(432);
        assert.equal(results.length, 0);

        results = schema.validate(0);
        assert.equal(results.length, 1);
    });    

    test('More Than Comparison', () => {
        let schema = new Schema().withRule(new ValueComparisonRule("GT", 123));
        let results = schema.validate(123);
        assert.equal(results.length, 1);

        results = schema.validate(432);
        assert.equal(results.length, 0);

        results = schema.validate(0);
        assert.equal(results.length, 1);
    });    

    test('Match Comparison', () => {
        let schema = new Schema().withRule(new ValueComparisonRule("LIKE", "A.*"));
        let results = schema.validate("ABC");
        assert.equal(results.length, 0);

        results = schema.validate("XYZ");
        assert.equal(results.length, 1);
    });    

});
