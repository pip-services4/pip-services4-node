/** @module mustache */
/**
 * General syntax errors.
 */
export declare class MustacheErrorCode {
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
     * The unexpected symbol
     */
    static readonly UnexpectedSymbol: string;
    /**
     * The mismatched brackets
     */
    static readonly MismatchedBrackets: string;
    /**
     * The missing variable
     */
    static readonly MissingVariable: string;
    /**
     * Not closed section
     */
    static readonly NotClosedSection: string;
    /**
     * Unexpected section end
     */
    static readonly UnexpectedSectionEnd: string;
}
