"use strict";
/** @module tokenizers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericNumberState = void 0;
const Token_1 = require("../Token");
const TokenType_1 = require("../TokenType");
const CharValidator_1 = require("../utilities/CharValidator");
/**
 * A NumberState object returns a number from a scanner. This state's idea of a number allows
 * an optional, initial minus sign, followed by one or more digits. A decimal point and another string
 * of digits may follow these digits.
 */
class GenericNumberState {
    constructor() {
        this.MINUS = '-'.charCodeAt(0);
        this.DOT = '.'.charCodeAt(0);
    }
    /**
     * Gets the next token from the stream started from the character linked to this state.
     * @param scanner A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    nextToken(scanner, tokenizer) {
        let absorbedDot = false;
        let gotADigit = false;
        let tokenValue = "";
        let nextSymbol = scanner.read();
        let line = scanner.line();
        let column = scanner.column();
        // Parses leading minus.
        if (nextSymbol == this.MINUS) {
            tokenValue = tokenValue + '-';
            nextSymbol = scanner.read();
        }
        // Parses digits before decimal separator.
        for (; CharValidator_1.CharValidator.isDigit(nextSymbol)
            && !CharValidator_1.CharValidator.isEof(nextSymbol); nextSymbol = scanner.read()) {
            gotADigit = true;
            tokenValue = tokenValue + String.fromCharCode(nextSymbol);
        }
        // Parses part after the decimal separator.
        if (nextSymbol == this.DOT) {
            absorbedDot = true;
            tokenValue = tokenValue + '.';
            nextSymbol = scanner.read();
            // Absorb all digits.
            for (; CharValidator_1.CharValidator.isDigit(nextSymbol)
                && !CharValidator_1.CharValidator.isEof(nextSymbol); nextSymbol = scanner.read()) {
                gotADigit = true;
                tokenValue = tokenValue + String.fromCharCode(nextSymbol);
            }
        }
        // Pushback last unprocessed symbol.
        if (!CharValidator_1.CharValidator.isEof(nextSymbol)) {
            scanner.unread();
        }
        // Process the result.
        if (!gotADigit) {
            scanner.unreadMany(tokenValue.length);
            if (tokenizer.symbolState != null) {
                return tokenizer.symbolState.nextToken(scanner, tokenizer);
            }
            else {
                throw new Error("Tokenizer must have an assigned symbol state.");
            }
        }
        return new Token_1.Token(absorbedDot ? TokenType_1.TokenType.Float : TokenType_1.TokenType.Integer, tokenValue, line, column);
    }
}
exports.GenericNumberState = GenericNumberState;
//# sourceMappingURL=GenericNumberState.js.map