"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionToken = void 0;
/**
 * Defines an expression token holder.
 */
class ExpressionToken {
    /**
     * Creates an instance of this token and initializes it with specified values.
     * @param type The type of this token.
     * @param value The value of this token.
     * @param line the line number where the token is.
     * @param column the column number where the token is.
     */
    constructor(type, value, line, column) {
        this._type = type;
        this._value = value;
        this._line = line;
        this._column = column;
    }
    /**
     * The type of this token.
     */
    get type() {
        return this._type;
    }
    /**
     * The value of this token.
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
}
exports.ExpressionToken = ExpressionToken;
//# sourceMappingURL=ExpressionToken.js.map