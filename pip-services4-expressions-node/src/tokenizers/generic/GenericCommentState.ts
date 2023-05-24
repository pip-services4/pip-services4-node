/** @module tokenizers */

import { ICommentState } from '../ICommentState';
import { Token } from '../Token';
import { TokenType } from '../TokenType';
import { ITokenizer } from '../ITokenizer';
import { IScanner } from '../../io/IScanner';
import { CharValidator } from '../utilities/CharValidator';

/**
 * A CommentState object returns a comment from a scanner.
 */
export class GenericCommentState implements ICommentState {
    protected readonly LF: number = '\r'.charCodeAt(0);
    protected readonly CR: number = '\n'.charCodeAt(0);

    /**
     * Either delegate to a comment-handling state, or return a token with just a slash in it.
     * @param scanner A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    public nextToken(scanner: IScanner, tokenizer: ITokenizer): Token {
        let line = scanner.peekLine();
        let column = scanner.peekColumn();
        let tokenValue = "";
        let nextSymbol: number;
        for (nextSymbol = scanner.read(); !CharValidator.isEof(nextSymbol)
            && nextSymbol != this.CR && nextSymbol != this.LF; nextSymbol = scanner.read()) {
            tokenValue = tokenValue + String.fromCharCode(nextSymbol);
        }
        if (!CharValidator.isEof(nextSymbol)) {
            scanner.unread();
        }

        return new Token(TokenType.Comment, tokenValue, line, column);
    }
}