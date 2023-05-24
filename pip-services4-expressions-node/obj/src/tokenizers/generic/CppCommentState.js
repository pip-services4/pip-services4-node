"use strict";
/** @module tokenizers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CppCommentState = void 0;
const Token_1 = require("../Token");
const TokenType_1 = require("../TokenType");
const CharValidator_1 = require("../utilities/CharValidator");
const GenericCommentState_1 = require("./GenericCommentState");
/**
 * This state will either delegate to a comment-handling state, or return a token with just a slash in it.
 */
class CppCommentState extends GenericCommentState_1.GenericCommentState {
    constructor() {
        super(...arguments);
        this.STAR = '*'.charCodeAt(0);
        this.SLASH = '/'.charCodeAt(0);
    }
    /**
     * Ignore everything up to a closing star and slash, and then return the tokenizer's next token.
     * @param IScanner
     * @param scanner
     */
    getMultiLineComment(scanner) {
        let result = "";
        let lastSymbol = 0;
        for (let nextSymbol = scanner.read(); !CharValidator_1.CharValidator.isEof(nextSymbol); nextSymbol = scanner.read()) {
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
    getSingleLineComment(scanner) {
        let result = "";
        let nextSymbol;
        for (nextSymbol = scanner.read(); !CharValidator_1.CharValidator.isEof(nextSymbol) && !CharValidator_1.CharValidator.isEol(nextSymbol); nextSymbol = scanner.read()) {
            result = result + String.fromCharCode(nextSymbol);
        }
        if (CharValidator_1.CharValidator.isEol(nextSymbol)) {
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
    nextToken(scanner, tokenizer) {
        let firstSymbol = scanner.read();
        let line = scanner.line();
        let column = scanner.column();
        if (firstSymbol != this.SLASH) {
            scanner.unread();
            throw new Error("Incorrect usage of CppCommentState.");
        }
        let secondSymbol = scanner.read();
        if (secondSymbol == this.STAR) {
            return new Token_1.Token(TokenType_1.TokenType.Comment, "/*" + this.getMultiLineComment(scanner), line, column);
        }
        else if (secondSymbol == this.SLASH) {
            return new Token_1.Token(TokenType_1.TokenType.Comment, "//" + this.getSingleLineComment(scanner), line, column);
        }
        else {
            if (!CharValidator_1.CharValidator.isEof(secondSymbol)) {
                scanner.unread();
            }
            if (!CharValidator_1.CharValidator.isEof(firstSymbol)) {
                scanner.unread();
            }
            return tokenizer.symbolState.nextToken(scanner, tokenizer);
        }
    }
}
exports.CppCommentState = CppCommentState;
//# sourceMappingURL=CppCommentState.js.map