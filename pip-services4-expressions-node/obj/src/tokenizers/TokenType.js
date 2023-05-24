"use strict";
/** @module tokenizers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = void 0;
/**
 * Types (categories) of tokens such as "number", "symbol" or "word".
 */
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Unknown"] = 0] = "Unknown";
    TokenType[TokenType["Eof"] = 1] = "Eof";
    TokenType[TokenType["Eol"] = 2] = "Eol";
    TokenType[TokenType["Float"] = 3] = "Float";
    TokenType[TokenType["Integer"] = 4] = "Integer";
    TokenType[TokenType["HexDecimal"] = 5] = "HexDecimal";
    TokenType[TokenType["Number"] = 6] = "Number";
    TokenType[TokenType["Symbol"] = 7] = "Symbol";
    TokenType[TokenType["Quoted"] = 8] = "Quoted";
    TokenType[TokenType["Word"] = 9] = "Word";
    TokenType[TokenType["Keyword"] = 10] = "Keyword";
    TokenType[TokenType["Whitespace"] = 11] = "Whitespace";
    TokenType[TokenType["Comment"] = 12] = "Comment";
    TokenType[TokenType["Special"] = 13] = "Special";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
;
//# sourceMappingURL=TokenType.js.map