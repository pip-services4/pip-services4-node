/** @module csv */

import { IQuoteState } from "../tokenizers/IQuoteState";
import { IScanner } from "../io/IScanner";
import { ITokenizer } from "../tokenizers/ITokenizer";
import { Token } from "../tokenizers/Token";
import { TokenType } from "../tokenizers/TokenType";
import { CharValidator } from "../tokenizers/utilities/CharValidator";

/**
 * Implements a quote string state object for CSV streams.
 */
export class CsvQuoteState implements IQuoteState {
    /**
     * Gets the next token from the stream started from the character linked to this state.
     * @param scanner A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    public nextToken(scanner: IScanner, tokenizer: ITokenizer): Token {
        let firstSymbol = scanner.read();
        let line = scanner.line();
        let column = scanner.column();
        let tokenValue = "";
        tokenValue = tokenValue + String.fromCharCode(firstSymbol);

        for (let nextSymbol = scanner.read(); !CharValidator.isEof(nextSymbol); nextSymbol = scanner.read()) {
            tokenValue = tokenValue + String.fromCharCode(nextSymbol);
            if (nextSymbol == firstSymbol) {
                if (scanner.peek() == firstSymbol) {
                    nextSymbol = scanner.read();
                    tokenValue = tokenValue + String.fromCharCode(nextSymbol);
                } else {
                    break;
                }
            }
        }

        return new Token(TokenType.Quoted, tokenValue, line, column);
    }

    /**
     * Encodes a string value.
     * @param value A string value to be encoded.
     * @param quoteSymbol A string quote character.
     * @returns An encoded string.
     */
    public encodeString(value: string, quoteSymbol: number): string {
        if (value != null) {
            let quoteString = String.fromCharCode(quoteSymbol);
            let result = quoteString
                + value.replace(quoteString, quoteString + quoteString)
                + quoteString;
            return result;
        } else {
            return null;
        }
    }

    /**
     * Decodes a string value.
     * @param value A string value to be decoded.
     * @param quoteSymbol A string quote character.
     * @returns An decoded string.
     */
    public decodeString(value: string, quoteSymbol: number): string {
        if (value == null) return null;

        if (value.length >= 2 && value.charCodeAt(0) == quoteSymbol
            && value.charCodeAt(value.length - 1) == quoteSymbol) {
            let quoteString = String.fromCharCode(quoteSymbol);
            return value.substring(1, value.length - 1).replace(quoteString + quoteString, quoteString);
        }
        return value;
    }
}