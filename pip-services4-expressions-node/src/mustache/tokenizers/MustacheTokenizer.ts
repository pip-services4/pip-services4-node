/** @module mustache */

import { Token } from "../../tokenizers/Token";
import { TokenType } from "../../tokenizers/TokenType";
import { ITokenizerState } from "../../tokenizers/ITokenizerState";
import { AbstractTokenizer } from "../../tokenizers/AbstractTokenizer";
import { GenericWordState } from "../../tokenizers/generic/GenericWordState";
import { GenericQuoteState } from "../../tokenizers/generic/GenericQuoteState";
import { GenericSymbolState } from "../../tokenizers/generic/GenericSymbolState";
import { GenericWhitespaceState } from "../../tokenizers/generic/GenericWhitespaceState";

import { MustacheSpecialState } from "./MustacheSpecialState";

export class MustacheTokenizer extends AbstractTokenizer {
    private _special: boolean = true;
    private _specialState: ITokenizerState;

    /**
     * Constructs this object with default parameters.
     */
    public constructor() {
        super();

        this.symbolState = new GenericSymbolState();
        this.symbolState.add("{{", TokenType.Symbol);
        this.symbolState.add("}}", TokenType.Symbol);
        this.symbolState.add("{{{", TokenType.Symbol);
        this.symbolState.add("}}}", TokenType.Symbol);

        this.numberState = null;
        this.quoteState = new GenericQuoteState();
        this.whitespaceState = new GenericWhitespaceState();
        this.wordState = new GenericWordState();
        this.commentState = null;
        this._specialState = new MustacheSpecialState();

        this.clearCharacterStates();
        this.setCharacterState(0x0000, 0x00ff, this.symbolState);
        this.setCharacterState(0x0000, ' '.charCodeAt(0), this.whitespaceState);

        this.setCharacterState('a'.charCodeAt(0), 'z'.charCodeAt(0), this.wordState);
        this.setCharacterState('A'.charCodeAt(0), 'Z'.charCodeAt(0), this.wordState);
        this.setCharacterState('0'.charCodeAt(0), '9'.charCodeAt(0), this.wordState);
        this.setCharacterState('_'.charCodeAt(0), '_'.charCodeAt(0), this.wordState);
        this.setCharacterState(0x00c0, 0x00ff, this.wordState);
        this.setCharacterState(0x0100, 0xfffe, this.wordState);

        this.setCharacterState('\"'.charCodeAt(0), '\"'.charCodeAt(0), this.quoteState);
        this.setCharacterState('\''.charCodeAt(0), '\''.charCodeAt(0), this.quoteState);

        this.skipWhitespaces = true;
        this.skipComments = true;
        this.skipEof = true;
    }    

    protected readNextToken(): Token {
        if (this._scanner == null) {
            return null;
        }

        // Check for initial state
        if (this._nextToken == null && this._lastTokenType == TokenType.Unknown) {
            this._special = true;
        }

        // Process quotes
        if (this._special) {
            let token = this._specialState.nextToken(this._scanner, this);
            if (token != null && token.value != "") {
                return token;
            }
        }

        // Proces other tokens
        this._special = false;
        let token = super.readNextToken();
        // Switch to quote when '{{' or '{{{' symbols found
        if (token != null && (token.value == "}}" || token.value == "}}}")) {
            this._special = true;
        }
        return token;
    }

}