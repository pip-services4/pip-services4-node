"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const StringScanner_1 = require("../../../src/io/StringScanner");
const GenericSymbolState_1 = require("../../../src/tokenizers/generic/GenericSymbolState");
const TokenType_1 = require("../../../src/tokenizers/TokenType");
suite('GenericSymbolState', () => {
    test('NextToken', () => {
        let state = new GenericSymbolState_1.GenericSymbolState();
        state.add("<", TokenType_1.TokenType.Symbol);
        state.add("<<", TokenType_1.TokenType.Symbol);
        state.add("<>", TokenType_1.TokenType.Symbol);
        let scanner = new StringScanner_1.StringScanner("<A<<<>");
        let token = state.nextToken(scanner, null);
        assert.equal("<", token.value);
        assert.equal(TokenType_1.TokenType.Symbol, token.type);
        token = state.nextToken(scanner, null);
        assert.equal("A", token.value);
        assert.equal(TokenType_1.TokenType.Symbol, token.type);
        token = state.nextToken(scanner, null);
        assert.equal("<<", token.value);
        assert.equal(TokenType_1.TokenType.Symbol, token.type);
        token = state.nextToken(scanner, null);
        assert.equal("<>", token.value);
        assert.equal(TokenType_1.TokenType.Symbol, token.type);
    });
});
//# sourceMappingURL=GenericSymbolState.test.js.map