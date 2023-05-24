const assert = require('chai').assert;

import { StringScanner } from '../../../src/io/StringScanner';
import { CppCommentState } from '../../../src/tokenizers/generic/CppCommentState';
import { TokenType } from '../../../src/tokenizers/TokenType';

suite('CppCommentState', ()=> {
    test('NextToken', () => {
        let state = new CppCommentState();

        let scanner = new StringScanner("-- Comment \n Comment ");
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

        scanner = new StringScanner("// Comment \n Comment ");
        let token = state.nextToken(scanner, null);
        assert.equal("// Comment ", token.value);
        assert.equal(TokenType.Comment, token.type);

        scanner = new StringScanner("/* Comment \n Comment */#");
        token = state.nextToken(scanner, null);
        assert.equal("/* Comment \n Comment */", token.value);
        assert.equal(TokenType.Comment, token.type);
    });    
});