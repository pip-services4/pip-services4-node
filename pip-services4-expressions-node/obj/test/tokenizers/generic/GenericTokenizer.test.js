"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const GenericTokenizer_1 = require("../../../src/tokenizers/generic/GenericTokenizer");
const TokenType_1 = require("../../../src/tokenizers/TokenType");
const Token_1 = require("../../../src/tokenizers/Token");
const TokenizerFixture_1 = require("../TokenizerFixture");
suite('GenericTokenizer', () => {
    test('Expression', () => {
        let tokenString = "A+B/123 - \t 'xyz'\n <>-10.11# This is a comment";
        let expectedTokens = [
            new Token_1.Token(TokenType_1.TokenType.Word, "A", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Symbol, "+", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Word, "B", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Symbol, "/", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Integer, "123", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Symbol, "-", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Whitespace, " \t ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Quoted, "'xyz'", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Whitespace, "\n ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Symbol, "<>", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Float, "-10.11", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Comment, "# This is a comment", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Eof, null, 0, 0)
        ];
        let tokenizer = new GenericTokenizer_1.GenericTokenizer();
        let tokenList = tokenizer.tokenizeBuffer(tokenString);
        TokenizerFixture_1.TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });
    test('WordToken', () => {
        let tokenString = "A'xyz'Ebf_2\n2x_2";
        let expectedTokens = [
            new Token_1.Token(TokenType_1.TokenType.Word, "A", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Quoted, "xyz", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Word, "Ebf_2", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Whitespace, "\n", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Integer, "2", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Word, "x_2", 0, 0)
        ];
        let tokenizer = new GenericTokenizer_1.GenericTokenizer();
        tokenizer.skipEof = true;
        tokenizer.decodeStrings = true;
        let tokenList = tokenizer.tokenizeBuffer(tokenString);
        TokenizerFixture_1.TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });
    test('NumberToken', () => {
        let tokenString = "123-321 .543-.76-. -123.456";
        let expectedTokens = [
            new Token_1.Token(TokenType_1.TokenType.Integer, "123", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Integer, "-321", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Float, ".543", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Float, "-.76", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Symbol, "-", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Symbol, ".", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Float, "-123.456", 0, 0)
        ];
        let tokenizer = new GenericTokenizer_1.GenericTokenizer();
        tokenizer.skipEof = true;
        tokenizer.decodeStrings = true;
        let tokenList = tokenizer.tokenizeBuffer(tokenString);
        TokenizerFixture_1.TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });
    test('ExpressionToken', () => {
        let tokenString = "A + b / (3 - Max(-123, 1)*2)";
        let tokenizer = new GenericTokenizer_1.GenericTokenizer();
        let tokenList = tokenizer.tokenizeBuffer(tokenString);
        assert.equal(24, tokenList.length);
    });
    test('ExpressionToken2', () => {
        let tokenString = "1>2";
        let expectedTokens = [
            new Token_1.Token(TokenType_1.TokenType.Integer, "1", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Symbol, ">", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Integer, "2", 0, 0),
        ];
        let tokenizer = new GenericTokenizer_1.GenericTokenizer();
        tokenizer.skipEof = true;
        let tokenList = tokenizer.tokenizeBuffer(tokenString);
        TokenizerFixture_1.TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });
});
//# sourceMappingURL=GenericTokenizer.test.js.map