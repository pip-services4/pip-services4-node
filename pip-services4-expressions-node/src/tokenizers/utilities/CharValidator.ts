/** @module tokenizers */

/**
 * Validates characters that are processed by Tokenizers.
 */
export class CharValidator {
    public static readonly Eof: number = 0xffff;
    public static readonly Zero: number = '0'.charCodeAt(0);
    public static readonly Nine: number = '9'.charCodeAt(0);

    /**
     * Default contructor to prevent creation of a class instance.
     */
    private constructor() {
    }

    public static isEof(value: number): boolean {
        return value == CharValidator.Eof || value == -1;
    }

    public static isEol(value: number): boolean {
        return value == 10 || value == 13;
    }

    public static isDigit(value: number): boolean  {
        return value >= CharValidator.Zero && value <= CharValidator.Nine;
    }
}