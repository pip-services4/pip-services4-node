const assert = require('chai').assert;

import { StringScanner } from '../../../src/io/StringScanner';
import { GenericWordState } from '../../../src/tokenizers/generic/GenericWordState';
import { TokenType } from '../../../src/tokenizers/TokenType';

suite('GenericWordState', ()=> {
    test('NextToken', () => {
        let state = new GenericWordState();

        let scanner = new StringScanner("AB_CD=");
        let token = state.nextToken(scanner, null);
        assert.equal("AB_CD", token.value);
        assert.equal(TokenType.Word, token.type);
    });    
});