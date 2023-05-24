"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const MustacheParser_1 = require("../../../src/mustache/parsers/MustacheParser");
const MustacheToken_1 = require("../../../src/mustache/parsers/MustacheToken");
const MustacheTokenType_1 = require("../../../src/mustache/parsers/MustacheTokenType");
suite('MustacheParser', () => {
    test('LexicalAnalysis', () => {
        let parser = new MustacheParser_1.MustacheParser();
        parser.template = "Hello, {{{NAME}}}{{ #if ESCLAMATION }}!{{/if}}{{{^ESCLAMATION}}}.{{{/ESCLAMATION}}}";
        let expectedTokens = [
            new MustacheToken_1.MustacheToken(MustacheTokenType_1.MustacheTokenType.Value, "Hello, ", 0, 0),
            new MustacheToken_1.MustacheToken(MustacheTokenType_1.MustacheTokenType.EscapedVariable, "NAME", 0, 0),
            new MustacheToken_1.MustacheToken(MustacheTokenType_1.MustacheTokenType.Section, "ESCLAMATION", 0, 0),
            new MustacheToken_1.MustacheToken(MustacheTokenType_1.MustacheTokenType.Value, "!", 0, 0),
            new MustacheToken_1.MustacheToken(MustacheTokenType_1.MustacheTokenType.SectionEnd, null, 0, 0),
            new MustacheToken_1.MustacheToken(MustacheTokenType_1.MustacheTokenType.InvertedSection, "ESCLAMATION", 0, 0),
            new MustacheToken_1.MustacheToken(MustacheTokenType_1.MustacheTokenType.Value, ".", 0, 0),
            new MustacheToken_1.MustacheToken(MustacheTokenType_1.MustacheTokenType.SectionEnd, "ESCLAMATION", 0, 0),
        ];
        let tokens = parser.initialTokens;
        assert.equal(expectedTokens.length, tokens.length);
        for (let i = 0; i < tokens.length; i++) {
            assert.equal(expectedTokens[i].type, tokens[i].type);
            assert.equal(expectedTokens[i].value, tokens[i].value);
        }
    });
    test('SyntaxAnalysis', () => {
        let parser = new MustacheParser_1.MustacheParser();
        parser.template = "Hello, {{{NAME}}}{{ #if ESCLAMATION }}!{{/if}}{{{^ESCLAMATION}}}.{{{/ESCLAMATION}}}";
        let expectedTokens = [
            new MustacheToken_1.MustacheToken(MustacheTokenType_1.MustacheTokenType.Value, "Hello, ", 0, 0),
            new MustacheToken_1.MustacheToken(MustacheTokenType_1.MustacheTokenType.EscapedVariable, "NAME", 0, 0),
            new MustacheToken_1.MustacheToken(MustacheTokenType_1.MustacheTokenType.Section, "ESCLAMATION", 0, 0),
            new MustacheToken_1.MustacheToken(MustacheTokenType_1.MustacheTokenType.InvertedSection, "ESCLAMATION", 0, 0),
        ];
        let tokens = parser.resultTokens;
        assert.equal(expectedTokens.length, tokens.length);
        for (let i = 0; i < tokens.length; i++) {
            assert.equal(expectedTokens[i].type, tokens[i].type);
            assert.equal(expectedTokens[i].value, tokens[i].value);
        }
    });
    test('VariableNames', () => {
        let parser = new MustacheParser_1.MustacheParser();
        parser.template = "Hello, {{{NAME}}}{{ #if ESCLAMATION }}!{{/if}}{{{^ESCLAMATION}}}.{{{/ESCLAMATION}}}";
        assert.equal(2, parser.variableNames.length);
        assert.equal("NAME", parser.variableNames[0]);
        assert.equal("ESCLAMATION", parser.variableNames[1]);
    });
});
//# sourceMappingURL=MustacheParser.test.js.map