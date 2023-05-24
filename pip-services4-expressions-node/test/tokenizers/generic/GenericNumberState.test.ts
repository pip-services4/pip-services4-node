const assert = require('chai').assert;

import { StringScanner } from '../../../src/io/StringScanner';
import { GenericNumberState } from '../../../src/tokenizers/generic/GenericNumberState';
import { TokenType } from '../../../src/tokenizers/TokenType';

suite('GenericNumberState', ()=> {
    test('NextToken', () => {
        let state = new GenericNumberState();

        let scanner = new StringScanner("ABC");
        let failed = false;
        try
        {
            state.nextToken(scanner, null);
        }
        catch
        {
            failed = true;
        }
        assert.isTrue(failed);

        scanner = new StringScanner("123#");
        let token = state.nextToken(scanner, null);
        assert.equal("123", token.value);
        assert.equal(TokenType.Integer, token.type);

        scanner = new StringScanner("-123#");
        token = state.nextToken(scanner, null);
        assert.equal("-123", token.value);
        assert.equal(TokenType.Integer, token.type);
        
        scanner = new StringScanner("123.#");
        token = state.nextToken(scanner, null);
        assert.equal("123.", token.value);
        assert.equal(TokenType.Float, token.type);

        scanner = new StringScanner("123.456#");
        token = state.nextToken(scanner, null);
        assert.equal("123.456", token.value);
        assert.equal(TokenType.Float, token.type);

        scanner = new StringScanner("-123.456#");
        token = state.nextToken(scanner, null);
        assert.equal("-123.456", token.value);
        assert.equal(TokenType.Float, token.type);
    });    
});