/** @module tokenizers */
import { IWhitespaceState } from '../IWhitespaceState';
import { Token } from '../Token';
import { ITokenizer } from '../ITokenizer';
import { IScanner } from '../../io/IScanner';
/**
 * A whitespace state ignores whitespace (such as blanks and tabs), and returns the tokenizer's
 * next token. By default, all characters from 0 to 32 are whitespace.
 */
export declare class GenericWhitespaceState implements IWhitespaceState {
    private _map;
    /**
     * Constructs a whitespace state with a default idea of what characters are, in fact, whitespace.
     */
    constructor();
    /**
     * Ignore whitespace (such as blanks and tabs), and return the tokenizer's next token.
     * @param scanner A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    nextToken(scanner: IScanner, tokenizer: ITokenizer): Token;
    /**
     * Establish the given characters as whitespace to ignore.
     * @param fromSymbol First character index of the interval.
     * @param toSymbol Last character index of the interval.
     * @param enable <code>true</code> if this state should ignore characters in the given range.
     */
    setWhitespaceChars(fromSymbol: number, toSymbol: number, enable: boolean): void;
    clearWhitespaceChars(): void;
}
