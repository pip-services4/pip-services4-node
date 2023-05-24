"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const StringScanner_1 = require("../../../src/io/StringScanner");
const GenericWordState_1 = require("../../../src/tokenizers/generic/GenericWordState");
const TokenType_1 = require("../../../src/tokenizers/TokenType");
suite('GenericWordState', () => {
    test('NextToken', () => {
        let state = new GenericWordState_1.GenericWordState();
        let scanner = new StringScanner_1.StringScanner("AB_CD=");
        let token = state.nextToken(scanner, null);
        assert.equal("AB_CD", token.value);
        assert.equal(TokenType_1.TokenType.Word, token.type);
    });
});
//# sourceMappingURL=GenericWordState.test.js.map