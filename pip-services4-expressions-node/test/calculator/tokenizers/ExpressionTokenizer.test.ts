const assert = require('chai').assert;

import { ExpressionTokenizer } from '../../../src/calculator/tokenizers/ExpressionTokenizer';
import { TokenType } from '../../../src/tokenizers/TokenType';
import { Token } from '../../../src/tokenizers/Token';
import { TokenizerFixture } from '../../tokenizers/TokenizerFixture';

suite('ExpressionTokenizer', ()=> {
    test('QuoteToken', () => {
        let tokenString = "A'xyz'\"abc\ndeg\" 'jkl\"def'\"ab\"\"de\"'df''er'";
        let expectedTokens: Token[] = [
            new Token(TokenType.Word, "A", 0, 0), new Token(TokenType.Quoted, "xyz", 0, 0),
            new Token(TokenType.Word, "abc\ndeg", 0, 0), new Token(TokenType.Whitespace, " ", 0, 0),
            new Token(TokenType.Quoted, "jkl\"def", 0, 0), new Token(TokenType.Word, "ab\"de", 0, 0),
            new Token(TokenType.Quoted, "df'er", 0, 0)
        ];

        let tokenizer = new ExpressionTokenizer();
        tokenizer.skipEof = true;
        tokenizer.decodeStrings = true;
        let tokenList = tokenizer.tokenizeBuffer(tokenString);

        TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });    

    test('WordToken', () => {
        let tokenString = "A'xyz'Ebf_2\n2_2";
        let expectedTokens: Token[] = [
            new Token(TokenType.Word, "A", 0, 0), new Token(TokenType.Quoted, "xyz", 0, 0),
            new Token(TokenType.Word, "Ebf_2", 0, 0), new Token(TokenType.Whitespace, "\n", 0, 0),
            new Token(TokenType.Integer, "2", 0, 0), new Token(TokenType.Word, "_2", 0, 0)
        ];

        let tokenizer = new ExpressionTokenizer();
        tokenizer.skipEof = true;
        tokenizer.decodeStrings = true;
        let tokenList = tokenizer.tokenizeBuffer(tokenString);

        TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });

    test('NumberToken', () => {
        let tokenString = "123-321 .543-.76-. 123.456 123e45 543.11E+43 1e 3E-";
        let expectedTokens: Token[] = [
            new Token(TokenType.Integer, "123", 0, 0), new Token(TokenType.Symbol, "-", 0, 0),
            new Token(TokenType.Integer, "321", 0, 0), new Token(TokenType.Whitespace, " ", 0, 0),
            new Token(TokenType.Float, ".543", 0, 0), new Token(TokenType.Symbol, "-", 0, 0),
            new Token(TokenType.Float, ".76", 0, 0), new Token(TokenType.Symbol, "-", 0, 0),
            new Token(TokenType.Symbol, ".", 0, 0), new Token(TokenType.Whitespace, " ", 0, 0),
            new Token(TokenType.Float, "123.456", 0, 0), new Token(TokenType.Whitespace, " ", 0, 0),
            new Token(TokenType.Float, "123e45", 0, 0), new Token(TokenType.Whitespace, " ", 0, 0),
            new Token(TokenType.Float, "543.11E+43", 0, 0), new Token(TokenType.Whitespace, " ", 0, 0),
            new Token(TokenType.Integer, "1", 0, 0), new Token(TokenType.Word, "e", 0, 0),
            new Token(TokenType.Whitespace, " ", 0, 0), new Token(TokenType.Integer, "3", 0, 0),
            new Token(TokenType.Word, "E", 0, 0), new Token(TokenType.Symbol, "-", 0, 0)
        ];

        let tokenizer = new ExpressionTokenizer();
        tokenizer.skipEof = true;
        tokenizer.decodeStrings = true;
        let tokenList = tokenizer.tokenizeBuffer(tokenString);

        TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });

    test('ExpressionToken', () => {
        let tokenString = "A + b / (3 - Max(-123, 1)*2)";
     
        let tokenizer = new ExpressionTokenizer();
        let tokenList = tokenizer.tokenizeBuffer(tokenString);

        assert.equal(25, tokenList.length);
    });    

});