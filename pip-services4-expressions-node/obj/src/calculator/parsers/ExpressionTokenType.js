"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionTokenType = void 0;
/** @module calculator */
/**
 * Define types of expression tokens.
 */
var ExpressionTokenType;
(function (ExpressionTokenType) {
    ExpressionTokenType[ExpressionTokenType["Unknown"] = 0] = "Unknown";
    ExpressionTokenType[ExpressionTokenType["LeftBrace"] = 1] = "LeftBrace";
    ExpressionTokenType[ExpressionTokenType["RightBrace"] = 2] = "RightBrace";
    ExpressionTokenType[ExpressionTokenType["LeftSquareBrace"] = 3] = "LeftSquareBrace";
    ExpressionTokenType[ExpressionTokenType["RightSquareBrace"] = 4] = "RightSquareBrace";
    ExpressionTokenType[ExpressionTokenType["Plus"] = 5] = "Plus";
    ExpressionTokenType[ExpressionTokenType["Minus"] = 6] = "Minus";
    ExpressionTokenType[ExpressionTokenType["Star"] = 7] = "Star";
    ExpressionTokenType[ExpressionTokenType["Slash"] = 8] = "Slash";
    ExpressionTokenType[ExpressionTokenType["Procent"] = 9] = "Procent";
    ExpressionTokenType[ExpressionTokenType["Power"] = 10] = "Power";
    ExpressionTokenType[ExpressionTokenType["Equal"] = 11] = "Equal";
    ExpressionTokenType[ExpressionTokenType["NotEqual"] = 12] = "NotEqual";
    ExpressionTokenType[ExpressionTokenType["More"] = 13] = "More";
    ExpressionTokenType[ExpressionTokenType["Less"] = 14] = "Less";
    ExpressionTokenType[ExpressionTokenType["EqualMore"] = 15] = "EqualMore";
    ExpressionTokenType[ExpressionTokenType["EqualLess"] = 16] = "EqualLess";
    ExpressionTokenType[ExpressionTokenType["ShiftLeft"] = 17] = "ShiftLeft";
    ExpressionTokenType[ExpressionTokenType["ShiftRight"] = 18] = "ShiftRight";
    ExpressionTokenType[ExpressionTokenType["And"] = 19] = "And";
    ExpressionTokenType[ExpressionTokenType["Or"] = 20] = "Or";
    ExpressionTokenType[ExpressionTokenType["Xor"] = 21] = "Xor";
    ExpressionTokenType[ExpressionTokenType["Is"] = 22] = "Is";
    ExpressionTokenType[ExpressionTokenType["In"] = 23] = "In";
    ExpressionTokenType[ExpressionTokenType["NotIn"] = 24] = "NotIn";
    ExpressionTokenType[ExpressionTokenType["Element"] = 25] = "Element";
    ExpressionTokenType[ExpressionTokenType["Null"] = 26] = "Null";
    ExpressionTokenType[ExpressionTokenType["Not"] = 27] = "Not";
    ExpressionTokenType[ExpressionTokenType["Like"] = 28] = "Like";
    ExpressionTokenType[ExpressionTokenType["NotLike"] = 29] = "NotLike";
    ExpressionTokenType[ExpressionTokenType["IsNull"] = 30] = "IsNull";
    ExpressionTokenType[ExpressionTokenType["IsNotNull"] = 31] = "IsNotNull";
    ExpressionTokenType[ExpressionTokenType["Comma"] = 32] = "Comma";
    ExpressionTokenType[ExpressionTokenType["Unary"] = 33] = "Unary";
    ExpressionTokenType[ExpressionTokenType["Function"] = 34] = "Function";
    ExpressionTokenType[ExpressionTokenType["Variable"] = 35] = "Variable";
    ExpressionTokenType[ExpressionTokenType["Constant"] = 36] = "Constant";
})(ExpressionTokenType = exports.ExpressionTokenType || (exports.ExpressionTokenType = {}));
;
//# sourceMappingURL=ExpressionTokenType.js.map