const assert = require('chai').assert;

import { Token } from '../../src/tokenizers/Token';

/**
 * Implements test utilities to Tokenzier tests
 */
export class TokenizerFixture {
    /// <summary>
    /// Checks is expected tokens matches actual tokens.
    /// </summary>
    /// <param name="expectedTokens">An array with expected tokens.</param>
    /// <param name="actualTokens">An array with actual tokens.</param>
    public static assertAreEqualsTokenLists(
        expectedTokens: Token[], actualTokens: Token[]): void {
        assert.equal(expectedTokens.length, actualTokens.length);

        for (let i = 0; i < expectedTokens.length; i++) {
            assert.equal(expectedTokens[i].type, actualTokens[i].type);
            assert.equal(expectedTokens[i].value, actualTokens[i].value);
        }
    }
}
