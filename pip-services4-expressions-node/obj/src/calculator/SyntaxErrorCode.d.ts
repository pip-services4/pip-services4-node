/** @module calculator */
/**
 * General syntax errors.
 */
export declare class SyntaxErrorCode {
    /**
     * The unknown
     */
    static readonly Unknown: string;
    /**
     * The internal error
     */
    static readonly Internal: string;
    /**
     * The unexpected end.
     */
    static readonly UnexpectedEnd: string;
    /**
     * The error near
     */
    static readonly ErrorNear: string;
    /**
     * The error at
     */
    static readonly ErrorAt: string;
    /**
     * The unknown symbol
     */
    static readonly UnknownSymbol: string;
    /**
     * The missed close parenthesis
     */
    static readonly MissedCloseParenthesis: string;
    /**
     * The missed close square bracket
     */
    static readonly MissedCloseSquareBracket: string;
}
