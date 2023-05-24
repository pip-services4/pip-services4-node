/** @module mustache */
/**
 * Define types of mustache tokens.
 */
export declare enum MustacheTokenType {
    Unknown = 0,
    Value = 1,
    Variable = 2,
    EscapedVariable = 3,
    Section = 4,
    InvertedSection = 5,
    SectionEnd = 6,
    Partial = 7,
    Comment = 8
}
