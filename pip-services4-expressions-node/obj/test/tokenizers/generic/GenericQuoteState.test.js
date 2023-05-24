"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const StringScanner_1 = require("../../../src/io/StringScanner");
const GenericQuoteState_1 = require("../../../src/tokenizers/generic/GenericQuoteState");
const TokenType_1 = require("../../../src/tokenizers/TokenType");
suite('GenericQuoteState', () => {
    test('NextToken', () => {
        let state = new GenericQuoteState_1.GenericQuoteState();
        let scanner = new StringScanner_1.StringScanner("'ABC#DEF'#");
        let token = state.nextToken(scanner, null);
        assert.equal("'ABC#DEF'", token.value);
        assert.equal(TokenType_1.TokenType.Quoted, token.type);
        scanner = new StringScanner_1.StringScanner("'ABC#DEF''");
        token = state.nextToken(scanner, null);
        assert.equal("'ABC#DEF'", token.value);
        assert.equal(TokenType_1.TokenType.Quoted, token.type);
    });
    test('Encode and Decode String', () => {
        let state = new GenericQuoteState_1.GenericQuoteState();
        let value = state.encodeString("ABC", "'".charCodeAt(0));
        assert.equal("'ABC'", value);
        value = state.decodeString(value, "'".charCodeAt(0));
        assert.equal("ABC", value);
        value = state.decodeString("'ABC'DEF'", "'".charCodeAt(0));
        assert.equal("ABC'DEF", value);
    });
});
//# sourceMappingURL=GenericQuoteState.test.js.map