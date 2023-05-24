"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MustacheTokenType = void 0;
/** @module mustache */
/**
 * Define types of mustache tokens.
 */
var MustacheTokenType;
(function (MustacheTokenType) {
    MustacheTokenType[MustacheTokenType["Unknown"] = 0] = "Unknown";
    MustacheTokenType[MustacheTokenType["Value"] = 1] = "Value";
    MustacheTokenType[MustacheTokenType["Variable"] = 2] = "Variable";
    MustacheTokenType[MustacheTokenType["EscapedVariable"] = 3] = "EscapedVariable";
    MustacheTokenType[MustacheTokenType["Section"] = 4] = "Section";
    MustacheTokenType[MustacheTokenType["InvertedSection"] = 5] = "InvertedSection";
    MustacheTokenType[MustacheTokenType["SectionEnd"] = 6] = "SectionEnd";
    MustacheTokenType[MustacheTokenType["Partial"] = 7] = "Partial";
    MustacheTokenType[MustacheTokenType["Comment"] = 8] = "Comment";
})(MustacheTokenType = exports.MustacheTokenType || (exports.MustacheTokenType = {}));
;
//# sourceMappingURL=MustacheTokenType.js.map