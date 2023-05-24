/** @module tokenizers */

import { INumberState } from '../INumberState';
import { Token } from '../Token';
import { TokenType } from '../TokenType';
import { ITokenizer } from '../ITokenizer';
import { IScanner } from '../../io/IScanner';
import { CharValidator } from '../utilities/CharValidator';

/**
 * A NumberState object returns a number from a scanner. This state's idea of a number allows
 * an optional, initial minus sign, followed by one or more digits. A decimal point and another string
 * of digits may follow these digits.
 */
export class GenericNumberState implements INumberState {
    protected readonly MINUS: number = '-'.charCodeAt(0);
    protected readonly DOT: number = '.'.charCodeAt(0);

    /**
     * Gets the next token from the stream started from the character linked to this state.
     * @param scanner A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    public nextToken(scanner: IScanner, tokenizer: ITokenizer): Token {
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
        for (; CharValidator.isDigit(nextSymbol)
            && !CharValidator.isEof(nextSymbol); nextSymbol = scanner.read()) {
            gotADigit = true;
            tokenValue = tokenValue + String.fromCharCode(nextSymbol);
        }

        // Parses part after the decimal separator.
        if (nextSymbol == this.DOT) {
            absorbedDot = true;
            tokenValue = tokenValue + '.';
            nextSymbol = scanner.read();

            // Absorb all digits.
            for (; CharValidator.isDigit(nextSymbol)
                && !CharValidator.isEof(nextSymbol); nextSymbol = scanner.read()) {
                gotADigit = true;
                tokenValue = tokenValue + String.fromCharCode(nextSymbol);
            }
        }

        // Pushback last unprocessed symbol.
        if (!CharValidator.isEof(nextSymbol)) {
            scanner.unread();
        }

        // Process the result.
        if (!gotADigit) {
            scanner.unreadMany(tokenValue.length);
            if (tokenizer.symbolState != null) {
                return tokenizer.symbolState.nextToken(scanner, tokenizer);
            } else {
                throw new Error("Tokenizer must have an assigned symbol state.");
            }
        }

        return new Token(absorbedDot ? TokenType.Float : TokenType.Integer, tokenValue, line, column);
    }
}