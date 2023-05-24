"use strict";
/**
 * @module tokenizers
 * @preferred
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = exports.Token = exports.AbstractTokenizer = void 0;
__exportStar(require("./generic"), exports);
__exportStar(require("./utilities"), exports);
var AbstractTokenizer_1 = require("./AbstractTokenizer");
Object.defineProperty(exports, "AbstractTokenizer", { enumerable: true, get: function () { return AbstractTokenizer_1.AbstractTokenizer; } });
var Token_1 = require("./Token");
Object.defineProperty(exports, "Token", { enumerable: true, get: function () { return Token_1.Token; } });
var TokenType_1 = require("./TokenType");
Object.defineProperty(exports, "TokenType", { enumerable: true, get: function () { return TokenType_1.TokenType; } });
//# sourceMappingURL=index.js.map