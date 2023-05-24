"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const StringScanner_1 = require("../../../src/io/StringScanner");
const GenericNumberState_1 = require("../../../src/tokenizers/generic/GenericNumberState");
const TokenType_1 = require("../../../src/tokenizers/TokenType");
suite('GenericNumberState', () => {
    test('NextToken', () => {
        let state = new GenericNumberState_1.GenericNumberState();
        let scanner = new StringScanner_1.StringScanner("ABC");
        let failed = false;
        try {
            state.nextToken(scanner, null);
        }
        catch (_a) {
            failed = true;
        }
        assert.isTrue(failed);
        scanner = new StringScanner_1.StringScanner("123#");
        let token = state.nextToken(scanner, null);
        assert.equal("123", token.value);
        assert.equal(TokenType_1.TokenType.Integer, token.type);
        scanner = new StringScanner_1.StringScanner("-123#");
        token = state.nextToken(scanner, null);
        assert.equal("-123", token.value);
        assert.equal(TokenType_1.TokenType.Integer, token.type);
        scanner = new StringScanner_1.StringScanner("123.#");
        token = state.nextToken(scanner, null);
        assert.equal("123.", token.value);
        assert.equal(TokenType_1.TokenType.Float, token.type);
        scanner = new StringScanner_1.StringScanner("123.456#");
        token = state.nextToken(scanner, null);
        assert.equal("123.456", token.value);
        assert.equal(TokenType_1.TokenType.Float, token.type);
        scanner = new StringScanner_1.StringScanner("-123.456#");
        token = state.nextToken(scanner, null);
        assert.equal("-123.456", token.value);
        assert.equal(TokenType_1.TokenType.Float, token.type);
    });
});
//# sourceMappingURL=GenericNumberState.test.js.map