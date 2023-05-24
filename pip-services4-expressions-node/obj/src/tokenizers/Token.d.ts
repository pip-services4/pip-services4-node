/** @module tokenizers */
import { TokenType } from './TokenType';
/**
 * A token represents a logical chunk of a string. For example, a typical tokenizer would break
 * the string "1.23 &lt;= 12.3" into three tokens: the number 1.23, a less-than-or-equal symbol,
 * and the number 12.3. A token is a receptacle, and relies on a tokenizer to decide precisely how
 * to divide a string into tokens.
 */
export declare class Token {
    private _type;
    private _value;
    private _line;
    private _column;
    /**
     * Constructs this token with type and value.
     * @param type The type of this token.
     * @param value The token string value.
     * @param line The line number where the token is.
     * @param column The column number where the token is.
     */
    constructor(type: TokenType, value: string, line: number, column: number);
    /**
     * The token type.
     */
    get type(): TokenType;
    /**
     * The token value.
     */
    get value(): string;
    /**
     * The line number where the token is.
     */
    get line(): number;
    /**
     * The column number where the token is.
     */
    get column(): number;
    equals(obj: any): boolean;
}
