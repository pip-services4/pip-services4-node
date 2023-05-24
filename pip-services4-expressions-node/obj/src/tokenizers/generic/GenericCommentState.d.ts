/** @module tokenizers */
import { ICommentState } from '../ICommentState';
import { Token } from '../Token';
import { ITokenizer } from '../ITokenizer';
import { IScanner } from '../../io/IScanner';
/**
 * A CommentState object returns a comment from a scanner.
 */
export declare class GenericCommentState implements ICommentState {
    protected readonly LF: number;
    protected readonly CR: number;
    /**
     * Either delegate to a comment-handling state, or return a token with just a slash in it.
     * @param scanner A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    nextToken(scanner: IScanner, tokenizer: ITokenizer): Token;
}
