/** @module mustache */

import { ITokenizerState } from "../../tokenizers/ITokenizerState";
import { IScanner } from "../../io/IScanner";
import { ITokenizer } from "../../tokenizers/ITokenizer";
import { Token } from "../../tokenizers/Token";
import { TokenType } from "../../tokenizers/TokenType";
import { CharValidator } from "../../tokenizers/utilities/CharValidator";

/**
 * Implements a quote string state object for Mustache templates.
 */
export class MustacheSpecialState implements ITokenizerState {
    private static readonly Bracket = "{".charCodeAt(0);

    /**
     * Gets the next token from the stream started from the character linked to this state.
     * @param scanner A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    public nextToken(scanner: IScanner, tokenizer: ITokenizer): Token {
        let line = scanner.peekLine();
        let column = scanner.peekColumn();
        let tokenValue = "";

        for (let nextSymbol = scanner.read(); !CharValidator.isEof(nextSymbol); nextSymbol = scanner.read()) {
            if (nextSymbol == MustacheSpecialState.Bracket) {
                if (scanner.peek() == MustacheSpecialState.Bracket) {
                    scanner.unread();
                    break;
                }
            }

            tokenValue = tokenValue + String.fromCharCode(nextSymbol);
        }

        return new Token(TokenType.Special, tokenValue, line, column);
    }

}