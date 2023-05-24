const assert = require('chai').assert;

import { StringScanner } from '../../../src/io/StringScanner';
import { GenericCommentState } from '../../../src/tokenizers/generic/GenericCommentState';
import { TokenType } from '../../../src/tokenizers/TokenType';

suite('GenericCommentState', ()=> {
    test('NextToken', () => {
        let state = new GenericCommentState();

        let scanner = new StringScanner("# Comment \r# Comment ");
        let token = state.nextToken(scanner, null);
        assert.equal("# Comment ", token.value);
        assert.equal(TokenType.Comment, token.type);

        scanner = new StringScanner("# Comment \n# Comment ");
        token = state.nextToken(scanner, null);
        assert.equal("# Comment ", token.value);
        assert.equal(TokenType.Comment, token.type);
    });    
});