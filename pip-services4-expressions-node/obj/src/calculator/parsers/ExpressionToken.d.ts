/** @module calculator */
import { ExpressionTokenType } from "./ExpressionTokenType";
import { Variant } from "../../variants/Variant";
/**
 * Defines an expression token holder.
 */
export declare class ExpressionToken {
    private _type;
    private _value;
    private _line;
    private _column;
    /**
     * Creates an instance of this token and initializes it with specified values.
     * @param type The type of this token.
     * @param value The value of this token.
     * @param line the line number where the token is.
     * @param column the column number where the token is.
     */
    constructor(type: ExpressionTokenType, value: Variant, line: number, column: number);
    /**
     * The type of this token.
     */
    get type(): ExpressionTokenType;
    /**
     * The value of this token.
     */
    get value(): Variant;
    /**
     * The line number where the token is.
     */
    get line(): number;
    /**
     * The column number where the token is.
     */
    get column(): number;
}
