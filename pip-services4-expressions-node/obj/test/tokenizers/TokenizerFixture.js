"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenizerFixture = void 0;
const assert = require('chai').assert;
/**
 * Implements test utilities to Tokenzier tests
 */
class TokenizerFixture {
    /// <summary>
    /// Checks is expected tokens matches actual tokens.
    /// </summary>
    /// <param name="expectedTokens">An array with expected tokens.</param>
    /// <param name="actualTokens">An array with actual tokens.</param>
    static assertAreEqualsTokenLists(expectedTokens, actualTokens) {
        assert.equal(expectedTokens.length, actualTokens.length);
        for (let i = 0; i < expectedTokens.length; i++) {
            assert.equal(expectedTokens[i].type, actualTokens[i].type);
            assert.equal(expectedTokens[i].value, actualTokens[i].value);
        }
    }
}
exports.TokenizerFixture = TokenizerFixture;
//# sourceMappingURL=TokenizerFixture.js.map