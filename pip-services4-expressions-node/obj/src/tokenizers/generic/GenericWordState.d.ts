/** @module tokenizers */
import { IWordState } from '../IWordState';
import { Token } from '../Token';
import { ITokenizer } from '../ITokenizer';
import { IScanner } from '../../io/IScanner';
/**
  * A wordState returns a word from a scanner. Like other states, a tokenizer transfers the job
  * of reading to this state, depending on an initial character. Thus, the tokenizer decides
  * which characters may begin a word, and this state determines which characters may appear
  * as a second or later character in a word. These are typically different sets of characters;
  * in particular, it is typical for digits to appear as parts of a word, but not
  * as the initial character of a word.
  * <p/>
  * By default, the following characters may appear in a word.
  * The method <code>setWordChars()</code> allows customizing this.
  * <blockquote><pre>
  * From    To
  *   'a', 'z'
  *   'A', 'Z'
  *   '0', '9'
  *
  *    as well as: minus sign, underscore, and apostrophe.
  * </pre></blockquote>
  */
export declare class GenericWordState implements IWordState {
    private _map;
    /**
     * Constructs a word state with a default idea of what characters
     * are admissible inside a word (as described in the class comment).
     */
    constructor();
    /**
     * Ignore word (such as blanks and tabs), and return the tokenizer's next token.
     * @param scanner A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    nextToken(scanner: IScanner, tokenizer: ITokenizer): Token;
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
