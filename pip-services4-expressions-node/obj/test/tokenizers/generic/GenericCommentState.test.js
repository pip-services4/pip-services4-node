"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const StringScanner_1 = require("../../../src/io/StringScanner");
const GenericCommentState_1 = require("../../../src/tokenizers/generic/GenericCommentState");
const TokenType_1 = require("../../../src/tokenizers/TokenType");
suite('GenericCommentState', () => {
    test('NextToken', () => {
        let state = new GenericCommentState_1.GenericCommentState();
        let scanner = new StringScanner_1.StringScanner("# Comment \r# Comment ");
        let token = state.nextToken(scanner, null);
        assert.equal("# Comment ", token.value);
        assert.equal(TokenType_1.TokenType.Comment, token.type);
        scanner = new StringScanner_1.StringScanner("# Comment \n# Comment ");
        token = state.nextToken(scanner, null);
        assert.equal("# Comment ", token.value);
        assert.equal(TokenType_1.TokenType.Comment, token.type);
    });
});
//# sourceMappingURL=GenericCommentState.test.js.map