"use strict";
/** @module tokenizers */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
/**
 * A token represents a logical chunk of a string. For example, a typical tokenizer would break
 * the string "1.23 &lt;= 12.3" into three tokens: the number 1.23, a less-than-or-equal symbol,
 * and the number 12.3. A token is a receptacle, and relies on a tokenizer to decide precisely how
 * to divide a string into tokens.
 */
class Token {
    /**
     * Constructs this token with type and value.
     * @param type The type of this token.
     * @param value The token string value.
     * @param line The line number where the token is.
     * @param column The column number where the token is.
     */
    constructor(type, value, line, column) {
        this._type = type;
        this._value = value;
        this._line = line;
        this._column = column;
    }
    /**
     * The token type.
     */
    get type() {
        return this._type;
    }
    /**
     * The token value.
     */
    get value() {
        return this._value;
    }
    /**
     * The line number where the token is.
     */
    get line() {
        return this._line;
    }
    /**
     * The column number where the token is.
     */
    get column() {
        return this._column;
    }
    equals(obj) {
        if (obj instanceof Token) {
            let token = obj;
            return token._type == this._type && token._value == this._value;
        }
        return false;
    }
}
exports.Token = Token;
//# sourceMappingURL=Token.js.map