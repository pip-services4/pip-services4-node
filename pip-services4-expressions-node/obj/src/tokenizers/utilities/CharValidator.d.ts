/** @module tokenizers */
/**
 * Validates characters that are processed by Tokenizers.
 */
export declare class CharValidator {
    static readonly Eof: number;
    static readonly Zero: number;
    static readonly Nine: number;
    /**
     * Default contructor to prevent creation of a class instance.
     */
    private constructor();
    static isEof(value: number): boolean;
    static isEol(value: number): boolean;
    static isDigit(value: number): boolean;
}
