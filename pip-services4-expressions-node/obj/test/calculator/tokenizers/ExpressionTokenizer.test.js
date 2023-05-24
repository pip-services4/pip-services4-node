"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const ExpressionTokenizer_1 = require("../../../src/calculator/tokenizers/ExpressionTokenizer");
const TokenType_1 = require("../../../src/tokenizers/TokenType");
const Token_1 = require("../../../src/tokenizers/Token");
const TokenizerFixture_1 = require("../../tokenizers/TokenizerFixture");
suite('ExpressionTokenizer', () => {
    test('QuoteToken', () => {
        let tokenString = "A'xyz'\"abc\ndeg\" 'jkl\"def'\"ab\"\"de\"'df''er'";
        let expectedTokens = [
            new Token_1.Token(TokenType_1.TokenType.Word, "A", 0, 0), new Token_1.Token(TokenType_1.TokenType.Quoted, "xyz", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Word, "abc\ndeg", 0, 0), new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Quoted, "jkl\"def", 0, 0), new Token_1.Token(TokenType_1.TokenType.Word, "ab\"de", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Quoted, "df'er", 0, 0)
        ];
        let tokenizer = new ExpressionTokenizer_1.ExpressionTokenizer();
        tokenizer.skipEof = true;
        tokenizer.decodeStrings = true;
        let tokenList = tokenizer.tokenizeBuffer(tokenString);
        TokenizerFixture_1.TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });
    test('WordToken', () => {
        let tokenString = "A'xyz'Ebf_2\n2_2";
        let expectedTokens = [
            new Token_1.Token(TokenType_1.TokenType.Word, "A", 0, 0), new Token_1.Token(TokenType_1.TokenType.Quoted, "xyz", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Word, "Ebf_2", 0, 0), new Token_1.Token(TokenType_1.TokenType.Whitespace, "\n", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Integer, "2", 0, 0), new Token_1.Token(TokenType_1.TokenType.Word, "_2", 0, 0)
        ];
        let tokenizer = new ExpressionTokenizer_1.ExpressionTokenizer();
        tokenizer.skipEof = true;
        tokenizer.decodeStrings = true;
        let tokenList = tokenizer.tokenizeBuffer(tokenString);
        TokenizerFixture_1.TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });
    test('NumberToken', () => {
        let tokenString = "123-321 .543-.76-. 123.456 123e45 543.11E+43 1e 3E-";
        let expectedTokens = [
            new Token_1.Token(TokenType_1.TokenType.Integer, "123", 0, 0), new Token_1.Token(TokenType_1.TokenType.Symbol, "-", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Integer, "321", 0, 0), new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Float, ".543", 0, 0), new Token_1.Token(TokenType_1.TokenType.Symbol, "-", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Float, ".76", 0, 0), new Token_1.Token(TokenType_1.TokenType.Symbol, "-", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Symbol, ".", 0, 0), new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Float, "123.456", 0, 0), new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Float, "123e45", 0, 0), new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Float, "543.11E+43", 0, 0), new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Integer, "1", 0, 0), new Token_1.Token(TokenType_1.TokenType.Word, "e", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0), new Token_1.Token(TokenType_1.TokenType.Integer, "3", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Word, "E", 0, 0), new Token_1.Token(TokenType_1.TokenType.Symbol, "-", 0, 0)
        ];
        let tokenizer = new ExpressionTokenizer_1.ExpressionTokenizer();
        tokenizer.skipEof = true;
        tokenizer.decodeStrings = true;
        let tokenList = tokenizer.tokenizeBuffer(tokenString);
        TokenizerFixture_1.TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });
    test('ExpressionToken', () => {
        let tokenString = "A + b / (3 - Max(-123, 1)*2)";
        let tokenizer = new ExpressionTokenizer_1.ExpressionTokenizer();
        let tokenList = tokenizer.tokenizeBuffer(tokenString);
        assert.equal(25, tokenList.length);
    });
});
//# sourceMappingURL=ExpressionTokenizer.test.js.map