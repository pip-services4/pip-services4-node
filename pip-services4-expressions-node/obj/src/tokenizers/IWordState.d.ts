/** @module tokenizers */
import { ITokenizerState } from './ITokenizerState';
/**
 * Defines an interface for tokenizer state that processes words, identificators or keywords
 */
export interface IWordState extends ITokenizerState {
    /**
     * Establish characters in the given range as valid characters for part of a word after
     * the first character. Note that the tokenizer must determine which characters are valid
     * as the beginning character of a word.
     * @param fromSymbol First character index of the interval.
     * @param toSymbol Last character index of the interval.
     * @param enable <code>true</code> if this state should use characters in the given range.
     */
    setWordChars(fromSymbol: number, toSymbol: number, enable: boolean): void;
    /**
     * Clears definitions of word chars.
     */
    clearWordChars(): void;
}
