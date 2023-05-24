const assert = require('chai').assert;

import { ExpressionCalculator } from '../../src/calculator/ExpressionCalculator';
import { VariantType } from '../../src/variants/VariantType';
import { Variant } from '../../src/variants/Variant';

suite('ExpressionCalculator', ()=> {

    test('SimpleExpression', async () => {
        let calculator = new ExpressionCalculator();

        calculator.expression = "2 + 2";
        let result = await calculator.evaluate();
        assert.equal(VariantType.Integer, result.type);
        assert.equal(4, result.asInteger);    
    });    

    test('FunctionExpression', async () => {
        let calculator = new ExpressionCalculator();

        calculator.expression = "A + b / (3 - Max(-123, 1)*2)";
        // calculator.expression = "Abs(1)";
        assert.equal("A", calculator.defaultVariables.findByName("a").name);
        assert.equal("b", calculator.defaultVariables.findByName("b").name);
        calculator.defaultVariables.findByName("a").value = new Variant("xyz");
        calculator.defaultVariables.findByName("b").value = new Variant(123);
    
        let result = await calculator.evaluate();
        assert.equal(VariantType.String, result.type);
        assert.equal("xyz123", result.asString);
    });    

    test('ArrayExpression', async () => {
        let calculator = new ExpressionCalculator();

        calculator.expression = "'abc'[1]";
        let result = await calculator.evaluate();
        assert.equal(VariantType.String, result.type);
        assert.equal("b", result.asString);
    });    

    test('BooleanExpression', async () => {
        let calculator = new ExpressionCalculator();

        calculator.expression = "1 > 2";
        let result = await calculator.evaluate();
        assert.equal(VariantType.Boolean, result.type);
        assert.isFalse(result.asBoolean);
    });    

    test('UnknownFunction', async () => {
        let calculator = new ExpressionCalculator();

        calculator.expression = "XXX(1)";
        try {
            await calculator.evaluate();
            assert.fail("Expected exception on unknown function");
        } catch {
            // Expected exception
        }
    });    

    test('InExpression', async () => {
        let calculator = new ExpressionCalculator();

        calculator.expression = "2 IN ARRAY(1,2,3)";
        let result = await calculator.evaluate();
        assert.equal(VariantType.Boolean, result.type);
        assert.isTrue(result.asBoolean);

        calculator = new ExpressionCalculator();
        
        calculator.expression = "5 NOT IN ARRAY(1,2,3)";
        result = await calculator.evaluate();
        assert.equal(VariantType.Boolean, result.type);
        assert.isTrue(result.asBoolean);
    });    

});