const assert = require('chai').assert;

import { StringScanner } from '../../../src/io/StringScanner';
import { SymbolRootNode } from '../../../src/tokenizers/generic/SymbolRootNode';
import { TokenType } from '../../../src/tokenizers/TokenType';

suite('SymbolRootNode', ()=> {
    test('NextToken', () => {
        let node = new SymbolRootNode();
        node.add("<", TokenType.Symbol);
        node.add("<<", TokenType.Symbol);
        node.add("<>", TokenType.Symbol);

        let scanner = new StringScanner("<A<<<>");

        let token = node.nextToken(scanner);
        assert.equal("<", token.value);

        token = node.nextToken(scanner);
        assert.equal("A", token.value);

        token = node.nextToken(scanner);
        assert.equal("<<", token.value);

        token = node.nextToken(scanner);
        assert.equal("<>", token.value);
    });    

    test('SingleToken', () => {
        let node = new SymbolRootNode();
        //node.add("<", TokenType.Symbol);
        //node.add("<<", TokenType.Symbol);

        let scanner = new StringScanner("<A");

        let token = node.nextToken(scanner);
        assert.equal("<", token.value);
        assert.equal(TokenType.Symbol, token.type);
    });    

});