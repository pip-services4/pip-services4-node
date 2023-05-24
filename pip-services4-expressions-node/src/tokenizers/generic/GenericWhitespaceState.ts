/** @module tokenizers */

import { IWhitespaceState } from '../IWhitespaceState';
import { Token } from '../Token';
import { TokenType } from '../TokenType';
import { ITokenizer } from '../ITokenizer';
import { IScanner } from '../../io/IScanner';
import { CharReferenceMap } from '../utilities/CharReferenceMap';
import { CharValidator } from '../utilities/CharValidator';

/**
 * A whitespace state ignores whitespace (such as blanks and tabs), and returns the tokenizer's
 * next token. By default, all characters from 0 to 32 are whitespace.
 */
export class GenericWhitespaceState implements IWhitespaceState {
    private _map: CharReferenceMap<boolean> = new CharReferenceMap<boolean>();

    /**
     * Constructs a whitespace state with a default idea of what characters are, in fact, whitespace.
     */
    public constructor() {
        this.setWhitespaceChars(0, ' '.charCodeAt(0), true);
    }

    /**
     * Ignore whitespace (such as blanks and tabs), and return the tokenizer's next token.
     * @param scanner A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    public nextToken(scanner: IScanner, tokenizer: ITokenizer): Token {
        let line = scanner.peekLine();
        let column = scanner.peekColumn();
        let nextSymbol: number;
        let tokenValue = "";
        for (nextSymbol = scanner.read(); this._map.lookup(nextSymbol); nextSymbol = scanner.read()) {
            tokenValue = tokenValue + String.fromCharCode(nextSymbol);
        }

        if (!CharValidator.isEof(nextSymbol)) {
            scanner.unread();
        }

        return new Token(TokenType.Whitespace, tokenValue, line, column);
    }

    /**
     * Establish the given characters as whitespace to ignore.
     * @param fromSymbol First character index of the interval.
     * @param toSymbol Last character index of the interval.
     * @param enable <code>true</code> if this state should ignore characters in the given range.
     */
    public setWhitespaceChars(fromSymbol: number, toSymbol: number, enable: boolean): void {
        this._map.addInterval(fromSymbol, toSymbol, enable);
    }

    /// <summary>
    /// Clears definitions of whitespace characters.
    /// </summary>
    public clearWhitespaceChars(): void {
        this._map.clear();
    }

}