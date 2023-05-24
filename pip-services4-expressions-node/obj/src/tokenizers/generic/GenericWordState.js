"use strict";
/** @module tokenizers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericWordState = void 0;
const Token_1 = require("../Token");
const TokenType_1 = require("../TokenType");
const CharValidator_1 = require("../utilities/CharValidator");
const CharReferenceMap_1 = require("../utilities/CharReferenceMap");
/**
  * A wordState returns a word from a scanner. Like other states, a tokenizer transfers the job
  * of reading to this state, depending on an initial character. Thus, the tokenizer decides
  * which characters may begin a word, and this state determines which characters may appear
  * as a second or later character in a word. These are typically different sets of characters;
  * in particular, it is typical for digits to appear as parts of a word, but not
  * as the initial character of a word.
  * <p/>
  * By default, the following characters may appear in a word.
  * The method <code>setWordChars()</code> allows customizing this.
  * <blockquote><pre>
  * From    To
  *   'a', 'z'
  *   'A', 'Z'
  *   '0', '9'
  *
  *    as well as: minus sign, underscore, and apostrophe.
  * </pre></blockquote>
  */
class GenericWordState {
    /**
     * Constructs a word state with a default idea of what characters
     * are admissible inside a word (as described in the class comment).
     */
    constructor() {
        this._map = new CharReferenceMap_1.CharReferenceMap();
        this.setWordChars('a'.charCodeAt(0), 'z'.charCodeAt(0), true);
        this.setWordChars('A'.charCodeAt(0), 'Z'.charCodeAt(0), true);
        this.setWordChars('0'.charCodeAt(0), '9'.charCodeAt(0), true);
        this.setWordChars('-'.charCodeAt(0), '-'.charCodeAt(0), true);
        this.setWordChars('_'.charCodeAt(0), '_'.charCodeAt(0), true);
        //this.setWordChars(39, 39, true);
        this.setWordChars(0x00c0, 0x00ff, true);
        this.setWordChars(0x0100, 0xfffe, true);
    }
    /**
     * Ignore word (such as blanks and tabs), and return the tokenizer's next token.
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
        return new Token_1.Token(TokenType_1.TokenType.Word, tokenValue, line, column);
    }
    /**
     * Establish characters in the given range as valid characters for part of a word after
     * the first character. Note that the tokenizer must determine which characters are valid
     * as the beginning character of a word.
     * @param fromSymbol First character index of the interval.
     * @param toSymbol Last character index of the interval.
     * @param enable <code>true</code> if this state should use characters in the given range.
     */
    setWordChars(fromSymbol, toSymbol, enable) {
        this._map.addInterval(fromSymbol, toSymbol, enable);
    }
    /**
     * Clears definitions of word chars.
     */
    clearWordChars() {
        this._map.clear();
    }
}
exports.GenericWordState = GenericWordState;
//# sourceMappingURL=GenericWordState.js.map