/** @module tokenizers */
import { IScanner } from "../io/IScanner";
import { Token } from './Token';
import { ICommentState } from './ICommentState';
import { INumberState } from './INumberState';
import { IQuoteState } from './IQuoteState';
import { ISymbolState } from './ISymbolState';
import { IWhitespaceState } from './IWhitespaceState';
import { IWordState } from './IWordState';
/**
 * A tokenizer divides a string into tokens. This class is highly customizable with regard
 * to exactly how this division occurs, but it also has defaults that are suitable for many
 * languages. This class assumes that the character values read from the string lie in
 * the range 0-255. For example, the Unicode value of a capital A is 65,
 * so <code> System.out.println((char)65); </code> prints out a capital A.
 * <p>
 * The behavior of a tokenizer depends on its character state table. This table is an array
 * of 256 <code>TokenizerState</code> states. The state table decides which state to enter
 * upon reading a character from the input string.
 * <p>
 * For example, by default, upon reading an 'A', a tokenizer will enter a "word" state.
 * This means the tokenizer will ask a <code>WordState</code> object to consume the 'A',
 * along with the characters after the 'A' that form a word. The state's responsibility
 * is to consume characters and return a complete token.
 * <p>
 * The default table sets a SymbolState for every character from 0 to 255,
 * and then overrides this with:<blockquote><pre>
 * From    To     State
 * 0     ' '    whitespaceState
 * 'a'    'z'    wordState
 * 'A'    'Z'    wordState
 * 160     255    wordState
 * '0'    '9'    numberState
 * '-'    '-'    numberState
 * '.'    '.'    numberState
 * '"'    '"'    quoteState
 * '\''   '\''    quoteState
 * '/'    '/'    slashState
 * </pre></blockquote>
 * In addition to allowing modification of the state table, this class makes each of the states
 * above available. Some of these states are customizable. For example, wordState allows customization
 * of what characters can be part of a word, after the first character.
 */
export interface ITokenizer {
    /**
     * Skip unknown characters
     */
    skipUnknown: boolean;
    /**
     * Skips whitespaces.
     */
    skipWhitespaces: boolean;
    /**
     * Skips comments.
     */
    skipComments: boolean;
    /**
     * Skips End-Of-File token at the end of stream.
     */
    skipEof: boolean;
    /**
     * Merges whitespaces.
     */
    mergeWhitespaces: boolean;
    /**
     * Unifies numbers: "Integers" and "Floats" makes just "Numbers"
     */
    unifyNumbers: boolean;
    /**
     * Decodes quoted strings.
     */
    decodeStrings: boolean;
    /**
     * A token state to process comments.
     */
    commentState: ICommentState;
    /**
     * A token state to process numbers.
     */
    numberState: INumberState;
    /**
     * A token state to process quoted strings.
     */
    quoteState: IQuoteState;
    /**
     * A token state to process symbols (single like "=" or muti-character like "<>")
     */
    symbolState: ISymbolState;
    /**
     * A token state to process white space delimiters.
     */
    whitespaceState: IWhitespaceState;
    /**
     * A token state to process words or indentificators.
     */
    wordState: IWordState;
    /**
     * The stream scanner to tokenize.
     */
    scanner: IScanner;
    /**
     * Checks if there is the next token exist.
     * @returns <code>true</code> if scanner has the next token.
     */
    hasNextToken(): boolean;
    /**
     * Gets the next token from the scanner.
     * @returns Next token of <code>null</code> if there are no more tokens left.
     */
    nextToken(): Token;
    /**
     * Tokenizes a textual stream into a list of token structures.
     * @param scanner A textual stream to be tokenized.
     * @returns A list of token structures.
     */
    tokenizeStream(scanner: IScanner): Token[];
    /**
     * Tokenizes a string buffer into a list of tokens structures.
     * @param buffer A string buffer to be tokenized.
     * @returns A list of token structures.
     */
    tokenizeBuffer(buffer: string): Token[];
    /**
     * Tokenizes a textual stream into a list of strings.
     * @param scanner A textual stream to be tokenized.
     * @returns A list of token strings.
     */
    tokenizeStreamToStrings(scanner: IScanner): string[];
    /**
     * Tokenizes a string buffer into a list of strings.
     * @param buffer A string buffer to be tokenized.
     * @returns A list of token strings.
     */
    tokenizeBufferToStrings(buffer: string): string[];
}
