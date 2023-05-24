const assert = require('chai').assert;

import { StringScanner } from '../../../src/io/StringScanner';
import { GenericWhitespaceState } from '../../../src/tokenizers/generic/GenericWhitespaceState';
import { TokenType } from '../../../src/tokenizers/TokenType';

suite('GenericWhitespaceState', ()=> {
    test('NextToken', () => {
        let state = new GenericWhitespaceState();

        let scanner = new StringScanner(" \t\n\r #");
        let token = state.nextToken(scanner, null);
        assert.equal(" \t\n\r ", token.value);
        assert.equal(TokenType.Whitespace, token.type);
    });    
});