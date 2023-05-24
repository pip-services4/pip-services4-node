/** @module tokenizers */

import { AbstractTokenizer } from "../AbstractTokenizer";
import { TokenType } from "../TokenType";
import { GenericSymbolState } from "./GenericSymbolState";
import { GenericNumberState } from "./GenericNumberState";
import { GenericQuoteState } from "./GenericQuoteState";
import { GenericWhitespaceState } from "./GenericWhitespaceState";
import { GenericWordState } from "./GenericWordState";
import { GenericCommentState } from "./GenericCommentState";

/**
 * Implements a default tokenizer class.
 */
export class GenericTokenizer extends AbstractTokenizer {
    public constructor() {
        super();

        this.symbolState = new GenericSymbolState();
        this.symbolState.add("<>", TokenType.Symbol);
        this.symbolState.add("<=", TokenType.Symbol);
        this.symbolState.add(">=", TokenType.Symbol);

        this.numberState = new GenericNumberState();
        this.quoteState = new GenericQuoteState();
        this.whitespaceState = new GenericWhitespaceState();
        this.wordState = new GenericWordState();
        this.commentState = new GenericCommentState();

        this.clearCharacterStates();
        this.setCharacterState(0x0000, 0x00ff, this.symbolState);
        this.setCharacterState(0x0000, ' '.charCodeAt(0), this.whitespaceState);

        this.setCharacterState('a'.charCodeAt(0), 'z'.charCodeAt(0), this.wordState);
        this.setCharacterState('A'.charCodeAt(0), 'Z'.charCodeAt(0), this.wordState);
        this.setCharacterState(0x00c0, 0x00ff, this.wordState);
        this.setCharacterState(0x0100, 0xfffe, this.wordState);

        this.setCharacterState('-'.charCodeAt(0), '-'.charCodeAt(0), this.numberState);
        this.setCharacterState('0'.charCodeAt(0), '9'.charCodeAt(0), this.numberState);
        this.setCharacterState('.'.charCodeAt(0), '.'.charCodeAt(0), this.numberState);

        this.setCharacterState('\"'.charCodeAt(0), '\"'.charCodeAt(0), this.quoteState);
        this.setCharacterState('\''.charCodeAt(0), '\''.charCodeAt(0), this.quoteState);

        this.setCharacterState('#'.charCodeAt(0), '#'.charCodeAt(0), this.commentState);
    }
}