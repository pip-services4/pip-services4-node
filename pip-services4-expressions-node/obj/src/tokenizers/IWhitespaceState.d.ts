/** @module tokenizers */
import { ITokenizerState } from './ITokenizerState';
/**
 * Defines an interface for tokenizer state that processes whitespaces (' ', '\t')
 */
export interface IWhitespaceState extends ITokenizerState {
    /**
     * Establish the given characters as whitespace to ignore.
     * @param fromSymbol First character index of the interval.
     * @param toSymbol Last character index of the interval.
     * @param enable <code>true</code> if this state should ignore characters in the given range.
     */
    setWhitespaceChars(fromSymbol: number, toSymbol: number, enable: boolean): void;
    /**
     * Clears definitions of whitespace characters.
     */
    clearWhitespaceChars(): void;
}
