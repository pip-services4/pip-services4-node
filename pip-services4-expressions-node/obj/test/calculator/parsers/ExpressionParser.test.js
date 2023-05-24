"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const ExpressionParser_1 = require("../../../src/calculator/parsers/ExpressionParser");
const src_1 = require("../../../src");
suite('ExpressionParser', () => {
    test('ParseString', () => {
        let parser = new ExpressionParser_1.ExpressionParser();
        parser.expression = "(2+2)*ABS(-2)";
        let expectedTokens = [
            new src_1.ExpressionToken(src_1.ExpressionTokenType.Constant, src_1.Variant.fromInteger(2), 0, 0),
            new src_1.ExpressionToken(src_1.ExpressionTokenType.Constant, src_1.Variant.fromInteger(2), 0, 0),
            new src_1.ExpressionToken(src_1.ExpressionTokenType.Plus, src_1.Variant.Empty, 0, 0),
            new src_1.ExpressionToken(src_1.ExpressionTokenType.Constant, src_1.Variant.fromInteger(2), 0, 0),
            new src_1.ExpressionToken(src_1.ExpressionTokenType.Unary, src_1.Variant.Empty, 0, 0),
            new src_1.ExpressionToken(src_1.ExpressionTokenType.Constant, src_1.Variant.fromInteger(1), 0, 0),
            new src_1.ExpressionToken(src_1.ExpressionTokenType.Function, src_1.Variant.fromString("ABS"), 0, 0),
            new src_1.ExpressionToken(src_1.ExpressionTokenType.Star, src_1.Variant.Empty, 0, 0),
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
        let parser = new ExpressionParser_1.ExpressionParser();
        parser.expression = "1 > 2";
        assert.equal("1 > 2", parser.expression);
    });
});
//# sourceMappingURL=ExpressionParser.test.js.map