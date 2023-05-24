/** @module mustache */
/**
 * General syntax errors.
 */
export class MustacheErrorCode {
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
     * The unexpected symbol
     */
    public static readonly UnexpectedSymbol: string = "UNEXPECTED_SYMBOL";

    /**
     * The mismatched brackets
     */
    public static readonly MismatchedBrackets: string = "MISTMATCHED_BRACKETS";

    /**
     * The missing variable
     */
    public static readonly MissingVariable: string = "MISSING_VARIABLE";

    /**
     * Not closed section
     */
    public static readonly NotClosedSection: string = "NOT_CLOSED_SECTION";

    /**
     * Unexpected section end
     */
    public static readonly UnexpectedSectionEnd: string = "UNEXPECTED_SECTION_END";
}