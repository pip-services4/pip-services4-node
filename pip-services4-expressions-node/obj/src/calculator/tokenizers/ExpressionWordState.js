"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionWordState = void 0;
/** @module calculator */
const GenericWordState_1 = require("../../tokenizers/generic/GenericWordState");
const Token_1 = require("../../tokenizers/Token");
const TokenType_1 = require("../../tokenizers/TokenType");
/**
 * Implements a word state object.
 */
class ExpressionWordState extends GenericWordState_1.GenericWordState {
    /**
     * Constructs an instance of this class.
     */
    constructor() {
        super();
        /**
         * Supported expression keywords.
         */
        this.keywords = [
            "AND", "OR", "NOT", "XOR", "LIKE", "IS", "IN", "NULL", "TRUE", "FALSE"
        ];
        this.clearWordChars();
        this.setWordChars('a'.charCodeAt(0), 'z'.charCodeAt(0), true);
        this.setWordChars('A'.charCodeAt(0), 'Z'.charCodeAt(0), true);
        this.setWordChars('0'.charCodeAt(0), '9'.charCodeAt(0), true);
        this.setWordChars('_'.charCodeAt(0), '_'.charCodeAt(0), true);
        this.setWordChars(0x00c0, 0x00ff, true);
        this.setWordChars(0x0100, 0xfffe, true);
    }
    /**
      * Gets the next token from the stream started from the character linked to this state.
      * @param scanner A textual string to be tokenized.
      * @param tokenizer A tokenizer class that controls the process.
      * @returns The next token from the top of the stream.
      */
    nextToken(scanner, tokenizer) {
        let line = scanner.peekLine();
        let column = scanner.peekColumn();
        let token = super.nextToken(scanner, tokenizer);
        let value = token.value.toUpperCase();
        for (let keyword of this.keywords) {
            if (keyword == value) {
                return new Token_1.Token(TokenType_1.TokenType.Keyword, token.value, line, column);
            }
        }
        return token;
    }
}
exports.ExpressionWordState = ExpressionWordState;
//# sourceMappingURL=ExpressionWordState.js.map