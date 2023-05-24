"use strict";
/** @module csv */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvSymbolState = void 0;
const Token_1 = require("../tokenizers/Token");
const TokenType_1 = require("../tokenizers/TokenType");
const GenericSymbolState_1 = require("../tokenizers/generic/GenericSymbolState");
const CsvConstant_1 = require("./CsvConstant");
/**
 * Implements a symbol state to tokenize delimiters in CSV streams.
 */
class CsvSymbolState extends GenericSymbolState_1.GenericSymbolState {
    /**
     * Constructs this object with specified parameters.
     */
    constructor() {
        super();
        this.add("\n", TokenType_1.TokenType.Eol);
        this.add("\r", TokenType_1.TokenType.Eol);
        this.add("\r\n", TokenType_1.TokenType.Eol);
        this.add("\n\r", TokenType_1.TokenType.Eol);
    }
    nextToken(scanner, tokenizer) {
        // Optimization...
        let nextSymbol = scanner.read();
        let line = scanner.line();
        let column = scanner.column();
        if (nextSymbol != CsvConstant_1.CsvConstant.LF && nextSymbol != CsvConstant_1.CsvConstant.CR) {
            return new Token_1.Token(TokenType_1.TokenType.Symbol, String.fromCharCode(nextSymbol), line, column);
        }
        else {
            scanner.unread();
            return super.nextToken(scanner, tokenizer);
        }
    }
}
exports.CsvSymbolState = CsvSymbolState;
//# sourceMappingURL=CsvSymbolState.js.map