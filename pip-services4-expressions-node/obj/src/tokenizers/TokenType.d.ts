/** @module tokenizers */
/**
 * Types (categories) of tokens such as "number", "symbol" or "word".
 */
export declare enum TokenType {
    Unknown = 0,
    Eof = 1,
    Eol = 2,
    Float = 3,
    Integer = 4,
    HexDecimal = 5,
    Number = 6,
    Symbol = 7,
    Quoted = 8,
    Word = 9,
    Keyword = 10,
    Whitespace = 11,
    Comment = 12,
    Special = 13
}
