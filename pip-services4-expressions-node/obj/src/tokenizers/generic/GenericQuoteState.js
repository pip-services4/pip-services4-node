"use strict";
/** @module tokenizers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericQuoteState = void 0;
const Token_1 = require("../Token");
const TokenType_1 = require("../TokenType");
const CharValidator_1 = require("../utilities/CharValidator");
/**
  * A quoteState returns a quoted string token from a scanner. This state will collect characters
  * until it sees a match to the character that the tokenizer used to switch to this state.
  * For example, if a tokenizer uses a double-quote character to enter this state,
  * then <code>nextToken()</code> will search for another double-quote until it finds one
  * or finds the end of the scanner.
  */
class GenericQuoteState {
    /**
     * Return a quoted string token from a scanner. This method will collect
     * characters until it sees a match to the character that the tokenizer used
     * to switch to this state.
     * @param scanner A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    nextToken(scanner, tokenizer) {
        let firstSymbol = scanner.read();
        let line = scanner.line();
        let column = scanner.column();
        let tokenValue = String.fromCharCode(firstSymbol);
        for (let nextSymbol = scanner.read(); !CharValidator_1.CharValidator.isEof(nextSymbol); nextSymbol = scanner.read()) {
            tokenValue = tokenValue + String.fromCharCode(nextSymbol);
            if (nextSymbol == firstSymbol) {
                break;
            }
        }
        return new Token_1.Token(TokenType_1.TokenType.Quoted, tokenValue, line, column);
    }
    /**
     * Encodes a string value.
     * @param value A string value to be encoded.
     * @param quoteSymbol A string quote character.
     * @returns An encoded string.
     */
    encodeString(value, quoteSymbol) {
        if (value == null)
            return null;
        let result = String.fromCharCode(quoteSymbol) + value + String.fromCharCode(quoteSymbol);
        return result;
    }
    /**
     * Decodes a string value.
     * @param value A string value to be decoded.
     * @param quoteSymbol A string quote character.
     * @returns An decoded string.
     */
    decodeString(value, quoteSymbol) {
        if (value == null)
            return null;
        if (value.length >= 2 && value.charCodeAt(0) == quoteSymbol
            && value.charCodeAt(value.length - 1) == quoteSymbol) {
            return value.substring(1, value.length - 1);
        }
        return value;
    }
}
exports.GenericQuoteState = GenericQuoteState;
//# sourceMappingURL=GenericQuoteState.js.map