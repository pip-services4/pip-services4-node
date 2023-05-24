const assert = require('chai').assert;

import { CsvTokenizer } from '../../src/csv/CsvTokenizer';
import { TokenType } from '../../src/tokenizers/TokenType';
import { Token } from '../../src/tokenizers/Token';
import { TokenizerFixture } from '../tokenizers/TokenizerFixture';

suite('CsvTokenizer', ()=> {
    test('TokenizerWithDefaultParameters', () => {
        let tokenString = "\n\r\"John \"\"Da Man\"\"\",Repici,120 Jefferson St.,Riverside, NJ,08075\r\n"
            + "Stephen,Tyler,\"7452 Terrace \"\"At the Plaza\"\" road\",SomeTown,SD, 91234\r"
            + ",Blankman,,SomeTown, SD, 00298\n";
        let expectedTokens: Token[] = [
            new Token(TokenType.Eol, "\n\r", 0, 0),
            new Token(TokenType.Quoted, "\"John \"\"Da Man\"\"\"", 0, 0), new Token(TokenType.Symbol, ",", 0, 0),
            new Token(TokenType.Word, "Repici", 0, 0), new Token(TokenType.Symbol, ",", 0, 0),
            new Token(TokenType.Word, "120 Jefferson St.", 0, 0), new Token(TokenType.Symbol, ",", 0, 0),
            new Token(TokenType.Word, "Riverside", 0, 0), new Token(TokenType.Symbol, ",", 0, 0),
            new Token(TokenType.Word, " NJ", 0, 0), new Token(TokenType.Symbol, ",", 0, 0),
            new Token(TokenType.Word, "08075", 0, 0), new Token(TokenType.Eol, "\r\n", 0, 0),
            new Token(TokenType.Word, "Stephen", 0, 0), new Token(TokenType.Symbol, ",", 0, 0),
            new Token(TokenType.Word, "Tyler", 0, 0), new Token(TokenType.Symbol, ",", 0, 0),
            new Token(TokenType.Quoted, "\"7452 Terrace \"\"At the Plaza\"\" road\"", 0, 0), new Token(TokenType.Symbol, ",", 0, 0),
            new Token(TokenType.Word, "SomeTown", 0, 0), new Token(TokenType.Symbol, ",", 0, 0),
            new Token(TokenType.Word, "SD", 0, 0), new Token(TokenType.Symbol, ",", 0, 0),
            new Token(TokenType.Word, " 91234", 0, 0), new Token(TokenType.Eol, "\r", 0, 0),
            new Token(TokenType.Symbol, ",", 0, 0),
            new Token(TokenType.Word, "Blankman", 0, 0), new Token(TokenType.Symbol, ",", 0, 0),
            new Token(TokenType.Symbol, ",", 0, 0),
            new Token(TokenType.Word, "SomeTown", 0, 0), new Token(TokenType.Symbol, ",", 0, 0),
            new Token(TokenType.Word, " SD", 0, 0), new Token(TokenType.Symbol, ",", 0, 0),
            new Token(TokenType.Word, " 00298", 0, 0), new Token(TokenType.Eol, "\n", 0, 0)
        ];

        let tokenizer = new CsvTokenizer();
        tokenizer.skipEof = true;
        let tokenList = tokenizer.tokenizeBuffer(tokenString);

        TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });    

    test('TokenizerWithOverridenParameters', () => {
        let tokenString = "\n\r\'John, \'\'Da Man\'\'\'\tRepici\t120 Jefferson St.\tRiverside\t NJ\t08075\r\n"
            + "Stephen\t\"Tyler\"\t\'7452 \t\nTerrace \'\'At the Plaza\'\' road\'\tSomeTown\tSD\t 91234\r"
            + "\tBlankman\t\tSomeTown \'xxx\t\'\t SD\t 00298\n";
        let expectedTokens: Token[] = [
            new Token(TokenType.Eol, "\n\r", 0, 0),
            new Token(TokenType.Quoted, "\'John, \'\'Da Man\'\'\'", 0, 0), new Token(TokenType.Symbol, "\t", 0, 0),
            new Token(TokenType.Word, "Repici", 0, 0), new Token(TokenType.Symbol, "\t", 0, 0),
            new Token(TokenType.Word, "120 Jefferson St.", 0, 0), new Token(TokenType.Symbol, "\t", 0, 0),
            new Token(TokenType.Word, "Riverside", 0, 0), new Token(TokenType.Symbol, "\t", 0, 0),
            new Token(TokenType.Word, " NJ", 0, 0), new Token(TokenType.Symbol, "\t", 0, 0),
            new Token(TokenType.Word, "08075", 0, 0), new Token(TokenType.Eol, "\r\n", 0, 0),
            new Token(TokenType.Word, "Stephen", 0, 0), new Token(TokenType.Symbol, "\t", 0, 0),
            new Token(TokenType.Quoted, "\"Tyler\"", 0, 0), new Token(TokenType.Symbol, "\t", 0, 0),
            new Token(TokenType.Quoted, "\'7452 \t\nTerrace \'\'At the Plaza\'\' road\'", 0, 0), new Token(TokenType.Symbol, "\t", 0, 0),
            new Token(TokenType.Word, "SomeTown", 0, 0), new Token(TokenType.Symbol, "\t", 0, 0),
            new Token(TokenType.Word, "SD", 0, 0), new Token(TokenType.Symbol, "\t", 0, 0),
            new Token(TokenType.Word, " 91234", 0, 0), new Token(TokenType.Eol, "\r", 0, 0),
            new Token(TokenType.Symbol, "\t", 0, 0),
            new Token(TokenType.Word, "Blankman", 0, 0), new Token(TokenType.Symbol, "\t", 0, 0),
            new Token(TokenType.Symbol, "\t", 0, 0),
            new Token(TokenType.Word, "SomeTown ", 0, 0), new Token(TokenType.Quoted, "\'xxx\t\'", 0, 0), new Token(TokenType.Symbol, "\t", 0, 0),
            new Token(TokenType.Word, " SD", 0, 0), new Token(TokenType.Symbol, "\t", 0, 0),
            new Token(TokenType.Word, " 00298", 0, 0), new Token(TokenType.Eol, "\n", 0, 0)
        ];

        let tokenizer = new CsvTokenizer();
        tokenizer.fieldSeparators = [ '\t'.charCodeAt(0) ];
        tokenizer.quoteSymbols = [ '\''.charCodeAt(0), '\"'.charCodeAt(0) ];
        tokenizer.endOfLine = "\n";
        tokenizer.skipEof = true;
        let tokenList = tokenizer.tokenizeBuffer(tokenString);

        TokenizerFixture.assertAreEqualsTokenLists(expectedTokens, tokenList);
    });

});