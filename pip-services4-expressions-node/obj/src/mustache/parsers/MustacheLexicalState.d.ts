/** @module mustache */
/**
 * Define states in mustache lexical analysis.
 */
export declare enum MustacheLexicalState {
    Value = 0,
    Operator1 = 1,
    Operator2 = 2,
    Variable = 3,
    Comment = 4,
    Closure = 5
}
