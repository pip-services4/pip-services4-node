/** @module tokenizers */
import { SymbolNode } from './SymbolNode';
import { Token } from '../Token';
import { TokenType } from '../TokenType';
import { IScanner } from '../../io/IScanner';
/**
 * This class is a special case of a <code>SymbolNode</code>. A <code>SymbolRootNode</code>
 * object has no symbol of its own, but has children that represent all possible symbols.
 */
export declare class SymbolRootNode extends SymbolNode {
    /**
     * Creates and initializes a root node.
     */
    constructor();
    /**
     * Add the given string as a symbol.
     * @param value The character sequence to add.
     * @param tokenType
     */
    add(value: string, tokenType: TokenType): void;
    /**
     * Return a symbol string from a scanner.
     * @param scanner A scanner to read from
     * @returns A symbol string from a scanner
     */
    nextToken(scanner: IScanner): Token;
}
