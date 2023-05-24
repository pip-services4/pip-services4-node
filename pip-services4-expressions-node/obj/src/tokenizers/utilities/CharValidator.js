"use strict";
/** @module tokenizers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharValidator = void 0;
/**
 * Validates characters that are processed by Tokenizers.
 */
class CharValidator {
    /**
     * Default contructor to prevent creation of a class instance.
     */
    constructor() {
    }
    static isEof(value) {
        return value == CharValidator.Eof || value == -1;
    }
    static isEol(value) {
        return value == 10 || value == 13;
    }
    static isDigit(value) {
        return value >= CharValidator.Zero && value <= CharValidator.Nine;
    }
}
exports.CharValidator = CharValidator;
CharValidator.Eof = 0xffff;
CharValidator.Zero = '0'.charCodeAt(0);
CharValidator.Nine = '9'.charCodeAt(0);
//# sourceMappingURL=CharValidator.js.map