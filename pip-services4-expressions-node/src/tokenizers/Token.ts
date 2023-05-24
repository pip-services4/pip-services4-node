/** @module tokenizers */

import { TokenType } from './TokenType';

/**
 * A token represents a logical chunk of a string. For example, a typical tokenizer would break
 * the string "1.23 &lt;= 12.3" into three tokens: the number 1.23, a less-than-or-equal symbol,
 * and the number 12.3. A token is a receptacle, and relies on a tokenizer to decide precisely how
 * to divide a string into tokens.
 */
export class Token {
    private _type: TokenType;
    private _value: string;
    private _line: number;
    private _column: number;

    /**
     * Constructs this token with type and value.
     * @param type The type of this token.
     * @param value The token string value.
     * @param line The line number where the token is.
     * @param column The column number where the token is.
     */
    public constructor(type: TokenType, value: string, line: number, column: number) {
        this._type = type;
        this._value = value;
        this._line = line;
        this._column = column;
    }

    /**
     * The token type.
     */
    public get type(): TokenType {
        return this._type;
    }

    /**
     * The token value.
     */
    public get value(): string {
        return this._value;
    }

    /**
     * The line number where the token is.
     */
    public get line(): number {
        return this._line;
    }

    /**
     * The column number where the token is.
     */
    public get column(): number {
        return this._column;
    }

    public equals(obj: any): boolean {
        if (obj instanceof Token) {
            let token = <Token>obj;
            return token._type == this._type && token._value == this._value;
        }
        return false;
    }

    // public getHashCode(): number {
    //     return super.getHashCode();
    // }
}