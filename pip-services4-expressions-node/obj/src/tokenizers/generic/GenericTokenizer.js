"use strict";
/** @module tokenizers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericTokenizer = void 0;
const AbstractTokenizer_1 = require("../AbstractTokenizer");
const TokenType_1 = require("../TokenType");
const GenericSymbolState_1 = require("./GenericSymbolState");
const GenericNumberState_1 = require("./GenericNumberState");
const GenericQuoteState_1 = require("./GenericQuoteState");
const GenericWhitespaceState_1 = require("./GenericWhitespaceState");
const GenericWordState_1 = require("./GenericWordState");
const GenericCommentState_1 = require("./GenericCommentState");
/**
 * Implements a default tokenizer class.
 */
class GenericTokenizer extends AbstractTokenizer_1.AbstractTokenizer {
    constructor() {
        super();
        this.symbolState = new GenericSymbolState_1.GenericSymbolState();
        this.symbolState.add("<>", TokenType_1.TokenType.Symbol);
        this.symbolState.add("<=", TokenType_1.TokenType.Symbol);
        this.symbolState.add(">=", TokenType_1.TokenType.Symbol);
        this.numberState = new GenericNumberState_1.GenericNumberState();
        this.quoteState = new GenericQuoteState_1.GenericQuoteState();
        this.whitespaceState = new GenericWhitespaceState_1.GenericWhitespaceState();
        this.wordState = new GenericWordState_1.GenericWordState();
        this.commentState = new GenericCommentState_1.GenericCommentState();
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
exports.GenericTokenizer = GenericTokenizer;
//# sourceMappingURL=GenericTokenizer.js.map