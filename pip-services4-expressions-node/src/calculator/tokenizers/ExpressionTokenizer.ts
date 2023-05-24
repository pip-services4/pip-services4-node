/** @module calculator */
import { AbstractTokenizer } from "../../tokenizers/AbstractTokenizer";
import { GenericWhitespaceState } from "../../tokenizers/generic/GenericWhitespaceState";
import { ExpressionSymbolState } from "./ExpressionSymbolState";
import { ExpressionNumberState } from "./ExpressionNumberState";
import { ExpressionQuoteState } from "./ExpressionQuoteState";
import { ExpressionWordState } from "./ExpressionWordState";
import { CppCommentState } from "../../tokenizers/generic/CppCommentState";

/**
 * Implement tokenizer to perform lexical analysis for expressions.
 */
export class ExpressionTokenizer extends AbstractTokenizer {
    /**
     * Constructs an instance of this class.
     */
    public constructor() {
        super();

        this.decodeStrings = false;

        this.whitespaceState = new GenericWhitespaceState();

        this.symbolState = new ExpressionSymbolState();
        this.numberState = new ExpressionNumberState();
        this.quoteState = new ExpressionQuoteState();
        this.wordState = new ExpressionWordState();
        this.commentState = new CppCommentState();

        this.clearCharacterStates();
        this.setCharacterState(0x0000, 0xfffe, this.symbolState);
        this.setCharacterState(0, ' '.charCodeAt(0), this.whitespaceState);

        this.setCharacterState('a'.charCodeAt(0), 'z'.charCodeAt(0), this.wordState);
        this.setCharacterState('A'.charCodeAt(0), 'Z'.charCodeAt(0), this.wordState);
        this.setCharacterState(0x00c0, 0x00ff, this.wordState);
        this.setCharacterState('_'.charCodeAt(0), '_'.charCodeAt(0), this.wordState);

        this.setCharacterState('0'.charCodeAt(0), '9'.charCodeAt(0), this.numberState);
        this.setCharacterState('-'.charCodeAt(0), '-'.charCodeAt(0), this.numberState);
        this.setCharacterState('.'.charCodeAt(0), '.'.charCodeAt(0), this.numberState);

        this.setCharacterState('"'.charCodeAt(0), '"'.charCodeAt(0), this.quoteState);
        this.setCharacterState('\''.charCodeAt(0), '\''.charCodeAt(0), this.quoteState);

        this.setCharacterState('/'.charCodeAt(0), '/'.charCodeAt(0), this.commentState);
    }
}