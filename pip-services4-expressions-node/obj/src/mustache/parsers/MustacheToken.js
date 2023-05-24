"use strict";
/** @module mustache */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MustacheToken = void 0;
/**
 * Defines a mustache token holder.
 */
class MustacheToken {
    /**
     * Creates an instance of a mustache token.
     * @param type a token type.
     * @param value a token value.
     * @param line a line number where the token is.
     * @param column a column numer where the token is.
     */
    constructor(type, value, line, column) {
        this._tokens = [];
        this._type = type;
        this._value = value;
        this._line = line;
        this._column = column;
    }
    /**
     * Gets the token type.
     */
    get type() {
        return this._type;
    }
    /**
     * Gets the token value or variable name.
     */
    get value() {
        return this._value;
    }
    /**
     * Gets a list of subtokens is this token a section.
     */
    get tokens() {
        return this._tokens;
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
}
exports.MustacheToken = MustacheToken;
//# sourceMappingURL=MustacheToken.js.map