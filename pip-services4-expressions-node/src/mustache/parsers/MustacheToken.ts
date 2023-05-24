/** @module mustache */

import { MustacheTokenType } from "./MustacheTokenType";

/**
 * Defines a mustache token holder.
 */
export class MustacheToken {
    private _type: MustacheTokenType;
    private _value: string;
    private _tokens: MustacheToken[] = [];
    private _line: number;
    private _column: number;

    /**
     * Creates an instance of a mustache token.
     * @param type a token type.
     * @param value a token value.
     * @param line a line number where the token is.
     * @param column a column numer where the token is.
     */
    public constructor(type: MustacheTokenType, value: string, line: number, column: number) {
        this._type = type;
        this._value = value;
        this._line = line;
        this._column = column;
    }

    /**
     * Gets the token type.
     */
    public get type(): MustacheTokenType {
        return this._type;
    }

    /**
     * Gets the token value or variable name.
     */
    public get value(): string {
        return this._value;
    }

    /**
     * Gets a list of subtokens is this token a section.
     */
    public get tokens(): MustacheToken[] {
        return this._tokens;
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
}