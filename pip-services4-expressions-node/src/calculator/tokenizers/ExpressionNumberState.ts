/** @module calculator */

import { GenericNumberState } from "../../tokenizers/generic/GenericNumberState";
import { IScanner } from "../../io/IScanner";
import { ITokenizer } from "../../tokenizers/ITokenizer";
import { Token } from "../../tokenizers/Token";
import { TokenType } from "../../tokenizers/TokenType";
import { CharValidator } from "../../tokenizers/utilities/CharValidator";

/**
 * Implements an Expression-specific number state object.
 */
export class ExpressionNumberState extends GenericNumberState {
    protected readonly PLUS: number = '+'.charCodeAt(0);
    protected readonly EXP1: number = 'e'.charCodeAt(0);
    protected readonly EXP2: number = 'E'.charCodeAt(0);

    /**
      * Gets the next token from the stream started from the character linked to this state.
      * @param scanner A textual string to be tokenized.
      * @param tokenizer A tokenizer class that controls the process.
      * @returns The next token from the top of the stream.
      */
     public nextToken(scanner: IScanner, tokenizer: ITokenizer): Token {
        let line = scanner.peekLine();
        let column = scanner.peekColumn();

        // Process leading minus.
        if (scanner.peek() == this.MINUS) {
            return tokenizer.symbolState.nextToken(scanner, tokenizer);
        }

        // Process numbers using base class algorithm.
        let token = super.nextToken(scanner, tokenizer);

        // Exit if number was not detected.
        if (token.type != TokenType.Integer && token.type != TokenType.Float) {
            return token;
        }

        // Exit if number is not in scientific format.
        let nextChar = scanner.peek();
        if (nextChar != this.EXP1 && nextChar != this.EXP2) {
            return token;
        }

        let tokenValue = String.fromCharCode(scanner.read());

        // Process '-' or '+' in mantissa
        nextChar = scanner.peek();
        if (nextChar == this.MINUS || nextChar == this.PLUS) {
            tokenValue = tokenValue + String.fromCharCode(scanner.read());
            nextChar = scanner.peek();
        }

        // Exit if mantissa has no digits.
        if (!CharValidator.isDigit(nextChar)) {
            scanner.unreadMany(tokenValue.length);
            return token;
        }

        // Process matissa digits
        for (; CharValidator.isDigit(nextChar); nextChar = scanner.peek()) {
            tokenValue = tokenValue + String.fromCharCode(scanner.read());
        }

        return new Token(TokenType.Float, token.value + tokenValue, line, column);
    }
}