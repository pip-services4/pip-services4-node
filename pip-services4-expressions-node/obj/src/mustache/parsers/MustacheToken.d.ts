/** @module mustache */
import { MustacheTokenType } from "./MustacheTokenType";
/**
 * Defines a mustache token holder.
 */
export declare class MustacheToken {
    private _type;
    private _value;
    private _tokens;
    private _line;
    private _column;
    /**
     * Creates an instance of a mustache token.
     * @param type a token type.
     * @param value a token value.
     * @param line a line number where the token is.
     * @param column a column numer where the token is.
     */
    constructor(type: MustacheTokenType, value: string, line: number, column: number);
    /**
     * Gets the token type.
     */
    get type(): MustacheTokenType;
    /**
     * Gets the token value or variable name.
     */
    get value(): string;
    /**
     * Gets a list of subtokens is this token a section.
     */
    get tokens(): MustacheToken[];
    /**
     * The line number where the token is.
     */
    get line(): number;
    /**
     * The column number where the token is.
     */
    get column(): number;
}
