"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionTokenizer = void 0;
/** @module calculator */
const AbstractTokenizer_1 = require("../../tokenizers/AbstractTokenizer");
const GenericWhitespaceState_1 = require("../../tokenizers/generic/GenericWhitespaceState");
const ExpressionSymbolState_1 = require("./ExpressionSymbolState");
const ExpressionNumberState_1 = require("./ExpressionNumberState");
const ExpressionQuoteState_1 = require("./ExpressionQuoteState");
const ExpressionWordState_1 = require("./ExpressionWordState");
const CppCommentState_1 = require("../../tokenizers/generic/CppCommentState");
/**
 * Implement tokenizer to perform lexical analysis for expressions.
 */
class ExpressionTokenizer extends AbstractTokenizer_1.AbstractTokenizer {
    /**
     * Constructs an instance of this class.
     */
    constructor() {
        super();
        this.decodeStrings = false;
        this.whitespaceState = new GenericWhitespaceState_1.GenericWhitespaceState();
        this.symbolState = new ExpressionSymbolState_1.ExpressionSymbolState();
        this.numberState = new ExpressionNumberState_1.ExpressionNumberState();
        this.quoteState = new ExpressionQuoteState_1.ExpressionQuoteState();
        this.wordState = new ExpressionWordState_1.ExpressionWordState();
        this.commentState = new CppCommentState_1.CppCommentState();
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
exports.ExpressionTokenizer = ExpressionTokenizer;
//# sourceMappingURL=ExpressionTokenizer.js.map