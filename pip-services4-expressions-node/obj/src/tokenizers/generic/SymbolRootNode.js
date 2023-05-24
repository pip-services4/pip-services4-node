"use strict";
/** @module tokenizers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolRootNode = void 0;
const SymbolNode_1 = require("./SymbolNode");
const Token_1 = require("../Token");
const TokenType_1 = require("../TokenType");
/**
 * This class is a special case of a <code>SymbolNode</code>. A <code>SymbolRootNode</code>
 * object has no symbol of its own, but has children that represent all possible symbols.
 */
class SymbolRootNode extends SymbolNode_1.SymbolNode {
    /**
     * Creates and initializes a root node.
     */
    constructor() {
        super(null, 0);
    }
    /**
     * Add the given string as a symbol.
     * @param value The character sequence to add.
     * @param tokenType
     */
    add(value, tokenType) {
        if (value == '') {
            throw new Error("Value must have at least 1 character");
        }
        let childNode = this.ensureChildWithChar(value.charCodeAt(0));
        if (childNode.tokenType == TokenType_1.TokenType.Unknown) {
            childNode.valid = true;
            childNode.tokenType = TokenType_1.TokenType.Symbol;
        }
        childNode.addDescendantLine(value.substring(1), tokenType);
    }
    /**
     * Return a symbol string from a scanner.
     * @param scanner A scanner to read from
     * @returns A symbol string from a scanner
     */
    nextToken(scanner) {
        let nextSymbol = scanner.read();
        let line = scanner.line();
        let column = scanner.column();
        let childNode = this.findChildWithChar(nextSymbol);
        if (childNode != null) {
            childNode = childNode.deepestRead(scanner);
            childNode = childNode.unreadToValid(scanner);
            return new Token_1.Token(childNode.tokenType, childNode.ancestry(), line, column);
        }
        else {
            return new Token_1.Token(TokenType_1.TokenType.Symbol, String.fromCharCode(nextSymbol), line, column);
        }
    }
}
exports.SymbolRootNode = SymbolRootNode;
//# sourceMappingURL=SymbolRootNode.js.map