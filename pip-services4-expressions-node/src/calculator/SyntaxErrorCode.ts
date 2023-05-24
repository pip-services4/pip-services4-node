/** @module calculator */
/**
 * General syntax errors.
 */
export class SyntaxErrorCode {
    /**
     * The unknown
     */
    public static readonly Unknown: string = "UNKNOWN";

    /**
     * The internal error
     */
    public static readonly Internal: string = "INTERNAL";

    /**
     * The unexpected end.
     */
    public static readonly UnexpectedEnd: string = "UNEXPECTED_END";

    /**
     * The error near
     */
    public static readonly ErrorNear: string = "ERROR_NEAR";

    /**
     * The error at
     */
    public static readonly ErrorAt: string = "ERROR_AT";

    /**
     * The unknown symbol
     */
    public static readonly UnknownSymbol: string = "UNKNOWN_SYMBOL";

    /**
     * The missed close parenthesis
     */
    public static readonly MissedCloseParenthesis: string = "MISSED_CLOSE_PARENTHESIS";

    /**
     * The missed close square bracket
     */
    public static readonly MissedCloseSquareBracket: string = "MISSED_CLOSE_SQUARE_BRACKET";
}