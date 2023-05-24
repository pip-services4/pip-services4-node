const assert = require('chai').assert;

import { StringScanner } from '../../../src/io/StringScanner';
import { GenericQuoteState } from '../../../src/tokenizers/generic/GenericQuoteState';
import { TokenType } from '../../../src/tokenizers/TokenType';

suite('GenericQuoteState', ()=> {
    test('NextToken', () => {
        let state = new GenericQuoteState();

        let scanner = new StringScanner("'ABC#DEF'#");
        let token = state.nextToken(scanner, null);
        assert.equal("'ABC#DEF'", token.value);
        assert.equal(TokenType.Quoted, token.type);

        scanner = new StringScanner("'ABC#DEF''");
        token = state.nextToken(scanner, null);
        assert.equal("'ABC#DEF'", token.value);
        assert.equal(TokenType.Quoted, token.type);
    });    

    test('Encode and Decode String', () => {
        let state = new GenericQuoteState();

        let value = state.encodeString("ABC", "'".charCodeAt(0));
        assert.equal("'ABC'", value);

        value = state.decodeString(value, "'".charCodeAt(0));
        assert.equal("ABC", value);

        value = state.decodeString("'ABC'DEF'", "'".charCodeAt(0));
        assert.equal("ABC'DEF", value);
    });    
});