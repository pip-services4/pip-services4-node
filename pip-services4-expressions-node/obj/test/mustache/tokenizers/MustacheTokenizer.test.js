"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const MustacheTokenizer_1 = require("../../../src/mustache/tokenizers/MustacheTokenizer");
const TokenType_1 = require("../../../src/tokenizers/TokenType");
const Token_1 = require("../../../src/tokenizers/Token");
const TokenizerFixture_1 = require("../../tokenizers/TokenizerFixture");
suite('MustacheTokenizer', () => {
    test('Template1', () => {
        let tokenString = "Hello, {{ Name }}!";
        let expectedTokens = [
            new Token_1.Token(TokenType_1.TokenType.Special, "Hello, ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Symbol, "{{", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Word, "Name", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Symbol, "}}", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Special, "!", 0, 0),
        ];
        let tokenizer = new MustacheTokenizer_1.MustacheTokenizer();
        tokenizer.skipEof = true;
        let tokenList = tokenizer.tokenizeBuffer(tokenString);
        TokenizerFixture_1.TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });
    test('Template2', () => {
        let tokenString = "Hello, {{{ Name }}}!";
        let expectedTokens = [
            new Token_1.Token(TokenType_1.TokenType.Special, "Hello, ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Symbol, "{{{", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Word, "Name", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Symbol, "}}}", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Special, "!", 0, 0),
        ];
        let tokenizer = new MustacheTokenizer_1.MustacheTokenizer();
        tokenizer.skipEof = true;
        let tokenList = tokenizer.tokenizeBuffer(tokenString);
        TokenizerFixture_1.TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });
    test('Template3', () => {
        let tokenString = "{{ Name }}}";
        let expectedTokens = [
            new Token_1.Token(TokenType_1.TokenType.Symbol, "{{", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Word, "Name", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", 0, 0),
            new Token_1.Token(TokenType_1.TokenType.Symbol, "}}}", 0, 0)
        ];
        let tokenizer = new MustacheTokenizer_1.MustacheTokenizer();
        tokenizer.skipEof = true;
        let tokenList = tokenizer.tokenizeBuffer(tokenString);
        TokenizerFixture_1.TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });
    test('Template4', () => {
        let tokenString = "Hello, World!";
        let expectedTokens = [
            new Token_1.Token(TokenType_1.TokenType.Special, "Hello, World!", 0, 0)
        ];
        let tokenizer = new MustacheTokenizer_1.MustacheTokenizer();
        tokenizer.skipEof = true;
        let tokenList = tokenizer.tokenizeBuffer(tokenString);
        TokenizerFixture_1.TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });
});
//# sourceMappingURL=MustacheTokenizer.test.js.map