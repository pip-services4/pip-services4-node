"use strict";
/** @module tokenizers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTokenizer = void 0;
const Token_1 = require("./Token");
const TokenType_1 = require("./TokenType");
const CharReferenceMap_1 = require("./utilities/CharReferenceMap");
const CharValidator_1 = require("./utilities/CharValidator");
const StringScanner_1 = require("../io/StringScanner");
/**
 * Implements an abstract tokenizer class.
 */
class AbstractTokenizer {
    constructor() {
        this._map = new CharReferenceMap_1.CharReferenceMap();
        this._lastTokenType = TokenType_1.TokenType.Unknown;
    }
    getCharacterState(symbol) {
        return this._map.lookup(symbol);
    }
    setCharacterState(fromSymbol, toSymbol, state) {
        this._map.addInterval(fromSymbol, toSymbol, state);
    }
    clearCharacterStates() {
        this._map.clear();
    }
    get scanner() {
        return this._scanner;
    }
    set scanner(value) {
        this._scanner = value;
        this._nextToken = null;
        this._lastTokenType = TokenType_1.TokenType.Unknown;
    }
    hasNextToken() {
        this._nextToken = this._nextToken == null ? this.readNextToken() : this._nextToken;
        return this._nextToken != null;
    }
    nextToken() {
        let token = this._nextToken == null ? this.readNextToken() : this._nextToken;
        this._nextToken = null;
        return token;
    }
    readNextToken() {
        if (this._scanner == null) {
            return null;
        }
        let line = this._scanner.peekLine();
        let column = this._scanner.peekColumn();
        let token = null;
        while (true) {
            // Read character
            let nextChar = this._scanner.peek();
            // If reached Eof then exit
            if (CharValidator_1.CharValidator.isEof(nextChar)) {
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
                token = new Token_1.Token(TokenType_1.TokenType.Unknown, String.fromCharCode(this._scanner.read()), line, column);
            }
            // Skip unknown characters if option set.
            if (token.type == TokenType_1.TokenType.Unknown && this.skipUnknown) {
                this._lastTokenType = token.type;
                continue;
            }
            // Decode strings is option set.
            if (state != null && state.decodeString != null && this.decodeStrings) {
                token = new Token_1.Token(token.type, this.quoteState.decodeString(token.value, nextChar), line, column);
            }
            // Skips comments if option set.
            if (token.type == TokenType_1.TokenType.Comment && this.skipComments) {
                this._lastTokenType = token.type;
                continue;
            }
            // Skips whitespaces if option set.
            if (token.type == TokenType_1.TokenType.Whitespace
                && this._lastTokenType == TokenType_1.TokenType.Whitespace
                && this.skipWhitespaces) {
                this._lastTokenType = token.type;
                continue;
            }
            // Unifies whitespaces if option set.
            if (token.type == TokenType_1.TokenType.Whitespace && this.mergeWhitespaces) {
                token = new Token_1.Token(TokenType_1.TokenType.Whitespace, " ", line, column);
            }
            // Unifies numbers if option set.
            if (this.unifyNumbers
                && (token.type == TokenType_1.TokenType.Integer
                    || token.type == TokenType_1.TokenType.Float
                    || token.type == TokenType_1.TokenType.HexDecimal)) {
                token = new Token_1.Token(TokenType_1.TokenType.Number, token.value, line, column);
            }
            break;
        }
        // Adds an Eof if option is not set.
        if (token == null && this._lastTokenType != TokenType_1.TokenType.Eof && !this.skipEof) {
            token = new Token_1.Token(TokenType_1.TokenType.Eof, null, line, column);
        }
        // Assigns the last token type
        this._lastTokenType = token != null ? token.type : TokenType_1.TokenType.Eof;
        return token;
    }
    tokenizeStream(scanner) {
        this.scanner = scanner;
        let tokenList = [];
        for (let token = this.nextToken(); token != null; token = this.nextToken()) {
            tokenList.push(token);
        }
        return tokenList;
    }
    tokenizeBuffer(buffer) {
        let scanner = new StringScanner_1.StringScanner(buffer);
        return this.tokenizeStream(scanner);
    }
    tokenizeStreamToStrings(scanner) {
        this.scanner = scanner;
        let stringList = [];
        for (let token = this.nextToken(); token != null; token = this.nextToken()) {
            stringList.push(token.value);
        }
        return stringList;
    }
    tokenizeBufferToStrings(buffer) {
        let scanner = new StringScanner_1.StringScanner(buffer);
        return this.tokenizeStreamToStrings(scanner);
    }
}
exports.AbstractTokenizer = AbstractTokenizer;
//# sourceMappingURL=AbstractTokenizer.js.map