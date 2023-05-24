"use strict";
/** @module mustache */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MustacheTokenizer = void 0;
const TokenType_1 = require("../../tokenizers/TokenType");
const AbstractTokenizer_1 = require("../../tokenizers/AbstractTokenizer");
const GenericWordState_1 = require("../../tokenizers/generic/GenericWordState");
const GenericQuoteState_1 = require("../../tokenizers/generic/GenericQuoteState");
const GenericSymbolState_1 = require("../../tokenizers/generic/GenericSymbolState");
const GenericWhitespaceState_1 = require("../../tokenizers/generic/GenericWhitespaceState");
const MustacheSpecialState_1 = require("./MustacheSpecialState");
class MustacheTokenizer extends AbstractTokenizer_1.AbstractTokenizer {
    /**
     * Constructs this object with default parameters.
     */
    constructor() {
        super();
        this._special = true;
        this.symbolState = new GenericSymbolState_1.GenericSymbolState();
        this.symbolState.add("{{", TokenType_1.TokenType.Symbol);
        this.symbolState.add("}}", TokenType_1.TokenType.Symbol);
        this.symbolState.add("{{{", TokenType_1.TokenType.Symbol);
        this.symbolState.add("}}}", TokenType_1.TokenType.Symbol);
        this.numberState = null;
        this.quoteState = new GenericQuoteState_1.GenericQuoteState();
        this.whitespaceState = new GenericWhitespaceState_1.GenericWhitespaceState();
        this.wordState = new GenericWordState_1.GenericWordState();
        this.commentState = null;
        this._specialState = new MustacheSpecialState_1.MustacheSpecialState();
        this.clearCharacterStates();
        this.setCharacterState(0x0000, 0x00ff, this.symbolState);
        this.setCharacterState(0x0000, ' '.charCodeAt(0), this.whitespaceState);
        this.setCharacterState('a'.charCodeAt(0), 'z'.charCodeAt(0), this.wordState);
        this.setCharacterState('A'.charCodeAt(0), 'Z'.charCodeAt(0), this.wordState);
        this.setCharacterState('0'.charCodeAt(0), '9'.charCodeAt(0), this.wordState);
        this.setCharacterState('_'.charCodeAt(0), '_'.charCodeAt(0), this.wordState);
        this.setCharacterState(0x00c0, 0x00ff, this.wordState);
        this.setCharacterState(0x0100, 0xfffe, this.wordState);
        this.setCharacterState('\"'.charCodeAt(0), '\"'.charCodeAt(0), this.quoteState);
        this.setCharacterState('\''.charCodeAt(0), '\''.charCodeAt(0), this.quoteState);
        this.skipWhitespaces = true;
        this.skipComments = true;
        this.skipEof = true;
    }
    readNextToken() {
        if (this._scanner == null) {
            return null;
        }
        // Check for initial state
        if (this._nextToken == null && this._lastTokenType == TokenType_1.TokenType.Unknown) {
            this._special = true;
        }
        // Process quotes
        if (this._special) {
            let token = this._specialState.nextToken(this._scanner, this);
            if (token != null && token.value != "") {
                return token;
            }
        }
        // Proces other tokens
        this._special = false;
        let token = super.readNextToken();
        // Switch to quote when '{{' or '{{{' symbols found
        if (token != null && (token.value == "}}" || token.value == "}}}")) {
            this._special = true;
        }
        return token;
    }
}
exports.MustacheTokenizer = MustacheTokenizer;
//# sourceMappingURL=MustacheTokenizer.js.map