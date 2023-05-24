const assert = require('chai').assert;

import { StringScanner } from '../../../src/io/StringScanner';
import { GenericSymbolState } from '../../../src/tokenizers/generic/GenericSymbolState';
import { TokenType } from '../../../src/tokenizers/TokenType';

suite('GenericSymbolState', ()=> {
    test('NextToken', () => {
        let state = new GenericSymbolState();
        state.add("<", TokenType.Symbol);
        state.add("<<", TokenType.Symbol);
        state.add("<>", TokenType.Symbol);

        let scanner = new StringScanner("<A<<<>");

        let token = state.nextToken(scanner, null);
        assert.equal("<", token.value);
        assert.equal(TokenType.Symbol, token.type);

        token = state.nextToken(scanner, null);
        assert.equal("A", token.value);
        assert.equal(TokenType.Symbol, token.type);

        token = state.nextToken(scanner, null);
        assert.equal("<<", token.value);
        assert.equal(TokenType.Symbol, token.type);

        token = state.nextToken(scanner, null);
        assert.equal("<>", token.value);
        assert.equal(TokenType.Symbol, token.type);
    });    
});