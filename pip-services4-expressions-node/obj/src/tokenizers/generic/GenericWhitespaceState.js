"use strict";
/** @module tokenizers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericWhitespaceState = void 0;
const Token_1 = require("../Token");
const TokenType_1 = require("../TokenType");
const CharReferenceMap_1 = require("../utilities/CharReferenceMap");
const CharValidator_1 = require("../utilities/CharValidator");
/**
 * A whitespace state ignores whitespace (such as blanks and tabs), and returns the tokenizer's
 * next token. By default, all characters from 0 to 32 are whitespace.
 */
class GenericWhitespaceState {
    /**
     * Constructs a whitespace state with a default idea of what characters are, in fact, whitespace.
     */
    constructor() {
        this._map = new CharReferenceMap_1.CharReferenceMap();
        this.setWhitespaceChars(0, ' '.charCodeAt(0), true);
    }
    /**
     * Ignore whitespace (such as blanks and tabs), and return the tokenizer's next token.
     * @param scanner A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    nextToken(scanner, tokenizer) {
        let line = scanner.peekLine();
        let column = scanner.peekColumn();
        let nextSymbol;
        let tokenValue = "";
        for (nextSymbol = scanner.read(); this._map.lookup(nextSymbol); nextSymbol = scanner.read()) {
            tokenValue = tokenValue + String.fromCharCode(nextSymbol);
        }
        if (!CharValidator_1.CharValidator.isEof(nextSymbol)) {
            scanner.unread();
        }
        return new Token_1.Token(TokenType_1.TokenType.Whitespace, tokenValue, line, column);
    }
    /**
     * Establish the given characters as whitespace to ignore.
     * @param fromSymbol First character index of the interval.
     * @param toSymbol Last character index of the interval.
     * @param enable <code>true</code> if this state should ignore characters in the given range.
     */
    setWhitespaceChars(fromSymbol, toSymbol, enable) {
        this._map.addInterval(fromSymbol, toSymbol, enable);
    }
    /// <summary>
    /// Clears definitions of whitespace characters.
    /// </summary>
    clearWhitespaceChars() {
        this._map.clear();
    }
}
exports.GenericWhitespaceState = GenericWhitespaceState;
//# sourceMappingURL=GenericWhitespaceState.js.map