const assert = require('chai').assert;

import { ExpressionParser } from '../../../src/calculator/parsers/ExpressionParser';
import { ExpressionToken, ExpressionTokenType, Variant } from '../../../src';

suite('ExpressionParser', ()=> {

    test('ParseString', () => {
        let parser = new ExpressionParser();
        parser.expression = "(2+2)*ABS(-2)";
        let expectedTokens = [
            new ExpressionToken(ExpressionTokenType.Constant, Variant.fromInteger(2), 0, 0),
            new ExpressionToken(ExpressionTokenType.Constant, Variant.fromInteger(2), 0, 0),
            new ExpressionToken(ExpressionTokenType.Plus, Variant.Empty, 0, 0),
            new ExpressionToken(ExpressionTokenType.Constant, Variant.fromInteger(2), 0, 0),
            new ExpressionToken(ExpressionTokenType.Unary, Variant.Empty, 0, 0),
            new ExpressionToken(ExpressionTokenType.Constant, Variant.fromInteger(1), 0, 0),
            new ExpressionToken(ExpressionTokenType.Function, Variant.fromString("ABS"), 0, 0),
            new ExpressionToken(ExpressionTokenType.Star, Variant.Empty, 0, 0),
        ];

        let tokens = parser.resultTokens;
        assert.equal(expectedTokens.length, tokens.length);

        for (let i = 0; i < tokens.length; i++) {
            assert.equal(expectedTokens[i].type, tokens[i].type);
            assert.equal(expectedTokens[i].value.type, tokens[i].value.type);
            assert.equal(expectedTokens[i].value.asObject, tokens[i].value.asObject);
        }
    });    

    test('WrongExpression', () => {
        let parser = new ExpressionParser();
        parser.expression = "1 > 2";
        assert.equal("1 > 2", parser.expression);
    });    
});