/** @module calculator */
import { ExpressionTokenType } from "./ExpressionTokenType";
import { Variant } from "../../variants/Variant";

/**
 * Defines an expression token holder.
 */
export class ExpressionToken {
    private _type: ExpressionTokenType;
    private _value: Variant;
    private _line: number;
    private _column: number;

    /**
     * Creates an instance of this token and initializes it with specified values.
     * @param type The type of this token.
     * @param value The value of this token.
     * @param line the line number where the token is.
     * @param column the column number where the token is.
     */
    public constructor(type: ExpressionTokenType, value: Variant, line: number, column: number) {
        this._type = type;
        this._value = value;
        this._line = line;
        this._column = column;
    }

    /**
     * The type of this token.
     */
    public get type(): ExpressionTokenType {
        return this._type;
    }

    /**
     * The value of this token.
     */
    public get value(): Variant {
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
}