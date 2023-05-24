"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MustacheLexicalState = void 0;
/** @module mustache */
/**
 * Define states in mustache lexical analysis.
 */
var MustacheLexicalState;
(function (MustacheLexicalState) {
    MustacheLexicalState[MustacheLexicalState["Value"] = 0] = "Value";
    MustacheLexicalState[MustacheLexicalState["Operator1"] = 1] = "Operator1";
    MustacheLexicalState[MustacheLexicalState["Operator2"] = 2] = "Operator2";
    MustacheLexicalState[MustacheLexicalState["Variable"] = 3] = "Variable";
    MustacheLexicalState[MustacheLexicalState["Comment"] = 4] = "Comment";
    MustacheLexicalState[MustacheLexicalState["Closure"] = 5] = "Closure";
})(MustacheLexicalState = exports.MustacheLexicalState || (exports.MustacheLexicalState = {}));
;
//# sourceMappingURL=MustacheLexicalState.js.map