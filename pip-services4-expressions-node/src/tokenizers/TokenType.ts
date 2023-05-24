/** @module tokenizers */

/**
 * Types (categories) of tokens such as "number", "symbol" or "word".
 */
export enum TokenType {
    Unknown = 0,
    Eof,
    Eol,
    Float,
    Integer,
    HexDecimal,
    Number,
    Symbol,
    Quoted,
    Word,
    Keyword,
    Whitespace,
    Comment,
    Special
};