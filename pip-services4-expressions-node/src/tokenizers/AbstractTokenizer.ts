/** @module tokenizers */

import { ITokenizer } from './ITokenizer';
import { ITokenizerState } from './ITokenizerState';
import { ICommentState } from './ICommentState';
import { INumberState } from './INumberState';
import { IQuoteState } from './IQuoteState';
import { ISymbolState } from './ISymbolState';
import { IWhitespaceState } from './IWhitespaceState';
import { IWordState } from './IWordState';
import { Token } from './Token';
import { TokenType } from './TokenType';
import { CharReferenceMap } from './utilities/CharReferenceMap';
import { CharValidator } from './utilities/CharValidator';
import { IScanner } from '../io/IScanner';
import { StringScanner } from '../io/StringScanner';

/**
 * Implements an abstract tokenizer class.
 */
export abstract class AbstractTokenizer implements ITokenizer {
    private _map: CharReferenceMap<ITokenizerState> = new CharReferenceMap<ITokenizerState>();

    public skipUnknown: boolean;
    public skipWhitespaces: boolean;
    public skipComments: boolean;
    public skipEof: boolean;
    public mergeWhitespaces: boolean;
    public unifyNumbers: boolean;
    public decodeStrings: boolean;

    public commentState: ICommentState;
    public numberState: INumberState;
    public quoteState: IQuoteState;
    public symbolState: ISymbolState;
    public whitespaceState: IWhitespaceState;
    public wordState: IWordState;

    protected _scanner: IScanner;
    protected _nextToken: Token;
    protected _lastTokenType: TokenType = TokenType.Unknown;

    protected constructor() {}

    public getCharacterState(symbol: number): ITokenizerState {
        return this._map.lookup(symbol);
    }

    public setCharacterState(fromSymbol: number, toSymbol: number, state: ITokenizerState): void {
        this._map.addInterval(fromSymbol, toSymbol, state);
    }

    public clearCharacterStates(): void {
        this._map.clear();
    }

    public get scanner(): IScanner {
        return this._scanner;
    }

    public set scanner(value: IScanner) {
        this._scanner = value;
        this._nextToken = null;
        this._lastTokenType = TokenType.Unknown;
    }

    public hasNextToken(): boolean {
        this._nextToken = this._nextToken == null ? this.readNextToken() : this._nextToken;
        return this._nextToken != null;
    }

    public nextToken(): Token {
        let token = this._nextToken == null ? this.readNextToken() : this._nextToken;
        this._nextToken = null;
        return token;
    }

    protected readNextToken(): Token {
        if (this._scanner == null) {
            return null;
        }

        let line = this._scanner.peekLine();
        let column = this._scanner.peekColumn();
        let token: Token = null;

        while (true) {
            // Read character
            let nextChar = this._scanner.peek();

            // If reached Eof then exit
            if (CharValidator.isEof(nextChar)) {
                token = null;
                break;
            }

            // Get state for character
            let state = this.getCharacterState(nextChar);
            if (state != null) {
                token = state.nextToken(this._scanner, this);
            }

            // Check for unknown characters and endless loops...
            if (token == null || token.value == '') {
                token = new Token(TokenType.Unknown, String.fromCharCode(this._scanner.read()), line, column);
            }

            // Skip unknown characters if option set.
            if (token.type == TokenType.Unknown && this.skipUnknown) {
                this._lastTokenType = token.type;
                continue;
            }

            // Decode strings is option set.
            if (state != null && (<any>state).decodeString != null && this.decodeStrings) {
                token = new Token(token.type, this.quoteState.decodeString(token.value, nextChar), line, column);
            }

            // Skips comments if option set.
            if (token.type == TokenType.Comment && this.skipComments) {
                this._lastTokenType = token.type;
                continue;
            }

            // Skips whitespaces if option set.
            if (token.type == TokenType.Whitespace
                && this._lastTokenType == TokenType.Whitespace
                && this.skipWhitespaces) {
                this._lastTokenType = token.type;
                continue;
            }

            // Unifies whitespaces if option set.
            if (token.type == TokenType.Whitespace && this.mergeWhitespaces) {
                token = new Token(TokenType.Whitespace, " ", line, column);
            }

            // Unifies numbers if option set.
            if (this.unifyNumbers
                && (token.type == TokenType.Integer
                || token.type == TokenType.Float
                || token.type == TokenType.HexDecimal)) {
                token = new Token(TokenType.Number, token.value, line, column);
            }

            break;
        }

        // Adds an Eof if option is not set.
        if (token == null && this._lastTokenType != TokenType.Eof && !this.skipEof) {
            token = new Token(TokenType.Eof, null, line, column);
        }

        // Assigns the last token type
        this._lastTokenType = token != null ? token.type : TokenType.Eof;

        return token;
    }

    public tokenizeStream(scanner: IScanner): Token[] {
        this.scanner = scanner;
        let tokenList: Token[] = [];
        for (let token = this.nextToken(); token != null; token = this.nextToken()) {
            tokenList.push(token);
        }
        return tokenList;
    }

    public tokenizeBuffer(buffer: string): Token[] {
        let scanner = new StringScanner(buffer);
        return this.tokenizeStream(scanner);
    }

    public tokenizeStreamToStrings(scanner: IScanner): string[] {
        this.scanner = scanner;
        let stringList: string[] = [];
        for (let token = this.nextToken(); token != null; token = this.nextToken()) {
            stringList.push(token.value);
        }
        return stringList;
    }

    public tokenizeBufferToStrings(buffer: string): string[]  {
        let scanner = new StringScanner(buffer);
        return this.tokenizeStreamToStrings(scanner);
    }
}