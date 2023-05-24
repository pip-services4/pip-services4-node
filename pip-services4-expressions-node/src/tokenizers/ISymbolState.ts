/** @module tokenizers */

import { ITokenizerState } from './ITokenizerState';
import { TokenType } from './TokenType';

/**
 * Defines an interface for tokenizer state that processes delimiters.
 */
export interface ISymbolState extends ITokenizerState {
    /**
     * Add a multi-character symbol.
     * @param value The symbol to add, such as "=:="
     * @param tokenType The token type
     */
    add(value: string, tokenType: TokenType): void;
}
