/** @module tokenizers */

import { Token } from '../Token';
import { TokenType } from '../TokenType';
import { ITokenizer } from '../ITokenizer';
import { IScanner } from '../../io/IScanner';
import { CharValidator } from '../utilities/CharValidator';
import { GenericCommentState } from './GenericCommentState';

/**
 * This state will either delegate to a comment-handling state, or return a token with just a slash in it.
 */
export class CppCommentState extends GenericCommentState {
    protected readonly STAR: number = '*'.charCodeAt(0);
    protected readonly SLASH: number = '/'.charCodeAt(0);

    /**
     * Ignore everything up to a closing star and slash, and then return the tokenizer's next token.
     * @param IScanner 
     * @param scanner 
     */
    protected getMultiLineComment(scanner: IScanner): string {
        let result = "";
        let lastSymbol = 0;
        for (let nextSymbol = scanner.read(); !CharValidator.isEof(nextSymbol); nextSymbol = scanner.read()) {
            result = result + String.fromCharCode(nextSymbol);
            if (lastSymbol == this.STAR && nextSymbol == this.SLASH) {
                break;
            }
            lastSymbol = nextSymbol;
        }
        return result;
    }

    /**
     * Ignore everything up to an end-of-line and return the tokenizer's next token.
     * @param scanner 
     */
    protected getSingleLineComment(scanner: IScanner): string {
        let result = "";
        let nextSymbol: number;
        for (nextSymbol = scanner.read();
            !CharValidator.isEof(nextSymbol) && !CharValidator.isEol(nextSymbol);
            nextSymbol = scanner.read()) {
            result = result + String.fromCharCode(nextSymbol);
        }
        if (CharValidator.isEol(nextSymbol)) {
            scanner.unread();
        }
        return result;
    }

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
            throw new Error("Incorrect usage of CppCommentState.");
        }

        let secondSymbol = scanner.read();
        if (secondSymbol == this.STAR) {
            return new Token(TokenType.Comment, "/*" + this.getMultiLineComment(scanner), line, column);
        } else if (secondSymbol == this.SLASH) {
            return new Token(TokenType.Comment, "//" + this.getSingleLineComment(scanner), line, column);
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