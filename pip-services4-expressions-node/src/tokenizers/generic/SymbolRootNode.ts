/** @module tokenizers */

import { SymbolNode } from './SymbolNode';
import { Token } from '../Token';
import { TokenType } from '../TokenType';
import { IScanner } from '../../io/IScanner';

/**
 * This class is a special case of a <code>SymbolNode</code>. A <code>SymbolRootNode</code>
 * object has no symbol of its own, but has children that represent all possible symbols.
 */
export class SymbolRootNode extends SymbolNode {
    /**
     * Creates and initializes a root node.
     */
    public constructor() {
        super(null, 0);
    }

    /**
     * Add the given string as a symbol.
     * @param value The character sequence to add.
     * @param tokenType 
     */
    public add(value: string, tokenType: TokenType): void {
        if (value == '') {
            throw new Error("Value must have at least 1 character");
        }
        let childNode = this.ensureChildWithChar(value.charCodeAt(0));
        if (childNode.tokenType == TokenType.Unknown) {
            childNode.valid = true;
            childNode.tokenType = TokenType.Symbol;
        }
        childNode.addDescendantLine(value.substring(1), tokenType);
    }

    /**
     * Return a symbol string from a scanner.
     * @param scanner A scanner to read from
     * @returns A symbol string from a scanner
     */
    public nextToken(scanner: IScanner): Token {
        let nextSymbol = scanner.read();
        let line = scanner.line();
        let column = scanner.column();

        let childNode = this.findChildWithChar(nextSymbol);
        if (childNode != null) {
            childNode = childNode.deepestRead(scanner);
            childNode = childNode.unreadToValid(scanner);
            return new Token(childNode.tokenType, childNode.ancestry(), line, column);
        } else {
            return new Token(TokenType.Symbol, String.fromCharCode(nextSymbol), line, column);
        }
    }
}