/** @module tokenizers */

import { Token } from '../Token';
import { TokenType } from '../TokenType';
import { ITokenizer } from '../ITokenizer';
import { IScanner } from '../../io/IScanner';
import { CppCommentState } from './CppCommentState';
import { CharValidator } from '../utilities';

/**
 * This state will either delegate to a comment-handling state, or return a token with just a slash in it.
 */
export class CCommentState extends CppCommentState {
    /**
     * Either delegate to a comment-handling state, or return a token with just a slash in it.
     * @param scanner A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    public nextToken(scanner: IScanner, tokenizer: ITokenizer): Token {
        let firstSymbol = scanner.read();
        let line = scanner.line();
        let column = scanner.column();

        if (firstSymbol != this.SLASH) {
            scanner.unread();
            throw new Error("Incorrect usage of CCommentState.");
        }

        let secondSymbol = scanner.read();
        if (secondSymbol == this.STAR) {
            return new Token(TokenType.Comment, "/*" + this.getMultiLineComment(scanner), line, column);
        } else {
            if (!CharValidator.isEof(secondSymbol)) {
                scanner.unread();
            }
            if (!CharValidator.isEof(firstSymbol)) {
                scanner.unread();
            }
            return tokenizer.symbolState.nextToken(scanner, tokenizer);
        }
    }
}