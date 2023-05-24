/** @module tokenizers */
import { Token } from '../Token';
import { ITokenizer } from '../ITokenizer';
import { IScanner } from '../../io/IScanner';
import { GenericCommentState } from './GenericCommentState';
/**
 * This state will either delegate to a comment-handling state, or return a token with just a slash in it.
 */
export declare class CppCommentState extends GenericCommentState {
    protected readonly STAR: number;
    protected readonly SLASH: number;
    /**
     * Ignore everything up to a closing star and slash, and then return the tokenizer's next token.
     * @param IScanner
     * @param scanner
     */
    protected getMultiLineComment(scanner: IScanner): string;
    /**
     * Ignore everything up to an end-of-line and return the tokenizer's next token.
     * @param scanner
     */
    protected getSingleLineComment(scanner: IScanner): string;
    /**
     * Either delegate to a comment-handling state, or return a token with just a slash in it.
     * @param scanner A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    nextToken(scanner: IScanner, tokenizer: ITokenizer): Token;
}
