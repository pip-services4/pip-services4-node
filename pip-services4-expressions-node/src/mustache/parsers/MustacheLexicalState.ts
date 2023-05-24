/** @module mustache */
/**
 * Define states in mustache lexical analysis.
 */
export enum MustacheLexicalState {
    Value = 0,
    Operator1,
    Operator2,
    Variable,
    Comment,
    Closure
};