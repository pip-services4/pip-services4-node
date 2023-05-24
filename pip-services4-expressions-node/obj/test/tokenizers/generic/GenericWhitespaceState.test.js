"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const StringScanner_1 = require("../../../src/io/StringScanner");
const GenericWhitespaceState_1 = require("../../../src/tokenizers/generic/GenericWhitespaceState");
const TokenType_1 = require("../../../src/tokenizers/TokenType");
suite('GenericWhitespaceState', () => {
    test('NextToken', () => {
        let state = new GenericWhitespaceState_1.GenericWhitespaceState();
        let scanner = new StringScanner_1.StringScanner(" \t\n\r #");
        let token = state.nextToken(scanner, null);
        assert.equal(" \t\n\r ", token.value);
        assert.equal(TokenType_1.TokenType.Whitespace, token.type);
    });
});
//# sourceMappingURL=GenericWhitespaceState.test.js.map