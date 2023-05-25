"use strict";
/** @module mustache */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MustacheSpecialState = void 0;
const Token_1 = require("../../tokenizers/Token");
const TokenType_1 = require("../../tokenizers/TokenType");
const CharValidator_1 = require("../../tokenizers/utilities/CharValidator");
/**
 * Implements a quote string state object for Mustache templates.
 */
class MustacheSpecialState {
    /**
     * Gets the next token from the stream started from the character linked to this state.
     * @param scanner A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    nextToken(scanner, tokenizer) {
        let line = scanner.peekLine();
        let column = scanner.peekColumn();
        let tokenValue = "";
        for (let nextSymbol = scanner.read(); !CharValidator_1.CharValidator.isEof(nextSymbol); nextSymbol = scanner.read()) {
            if (nextSymbol == MustacheSpecialState.Bracket) {
                if (scanner.peek() == MustacheSpecialState.Bracket) {
                    scanner.unread();
                    break;
                }
            }
            tokenValue = tokenValue + String.fromCharCode(nextSymbol);
        }
        return new Token_1.Token(TokenType_1.TokenType.Special, tokenValue, line, column);
    }
}
exports.MustacheSpecialState = MustacheSpecialState;
MustacheSpecialState.Bracket = "{".charCodeAt(0);
//# sourceMappingURL=MustacheSpecialState.js.map