"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const StringScanner_1 = require("../../../src/io/StringScanner");
const CCommentState_1 = require("../../../src/tokenizers/generic/CCommentState");
const TokenType_1 = require("../../../src/tokenizers/TokenType");
suite('CCommentState', () => {
    test('NextToken', () => {
        let state = new CCommentState_1.CCommentState();
        let scanner = new StringScanner_1.StringScanner("// Comment \n Comment ");
        let failed = false;
        try {
            state.nextToken(scanner, null);
        }
        catch (_a) {
            failed = true;
        }
        assert.isTrue(failed);
        scanner = new StringScanner_1.StringScanner("/* Comment \n Comment */#");
        let token = state.nextToken(scanner, null);
        assert.equal("/* Comment \n Comment */", token.value);
        assert.equal(TokenType_1.TokenType.Comment, token.type);
    });
});
//# sourceMappingURL=CCommentState.test.js.map