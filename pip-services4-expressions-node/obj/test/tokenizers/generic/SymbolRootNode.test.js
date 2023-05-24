"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const StringScanner_1 = require("../../../src/io/StringScanner");
const SymbolRootNode_1 = require("../../../src/tokenizers/generic/SymbolRootNode");
const TokenType_1 = require("../../../src/tokenizers/TokenType");
suite('SymbolRootNode', () => {
    test('NextToken', () => {
        let node = new SymbolRootNode_1.SymbolRootNode();
        node.add("<", TokenType_1.TokenType.Symbol);
        node.add("<<", TokenType_1.TokenType.Symbol);
        node.add("<>", TokenType_1.TokenType.Symbol);
        let scanner = new StringScanner_1.StringScanner("<A<<<>");
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
        let node = new SymbolRootNode_1.SymbolRootNode();
        //node.add("<", TokenType.Symbol);
        //node.add("<<", TokenType.Symbol);
        let scanner = new StringScanner_1.StringScanner("<A");
        let token = node.nextToken(scanner);
        assert.equal("<", token.value);
        assert.equal(TokenType_1.TokenType.Symbol, token.type);
    });
});
//# sourceMappingURL=SymbolRootNode.test.js.map