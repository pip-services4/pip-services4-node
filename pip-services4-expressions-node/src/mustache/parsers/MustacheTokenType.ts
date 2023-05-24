/** @module mustache */
/**
 * Define types of mustache tokens.
 */
export enum MustacheTokenType {
    Unknown = 0,
    Value,
    Variable,
    EscapedVariable,
    Section,
    InvertedSection,
    SectionEnd,
    Partial,
    Comment
};