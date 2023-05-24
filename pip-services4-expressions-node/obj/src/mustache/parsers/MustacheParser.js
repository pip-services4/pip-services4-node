"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MustacheParser = void 0;
/** @module calculator */
const MustacheTokenType_1 = require("./MustacheTokenType");
const MustacheTokenizer_1 = require("../tokenizers/MustacheTokenizer");
const TokenType_1 = require("../../tokenizers/TokenType");
const MustacheToken_1 = require("./MustacheToken");
const MustacheException_1 = require("../MustacheException");
const MustacheErrorCode_1 = require("./MustacheErrorCode");
const MustacheLexicalState_1 = require("./MustacheLexicalState");
/**
 * Implements an mustache parser class.
 */
class MustacheParser {
    constructor() {
        this._tokenizer = new MustacheTokenizer_1.MustacheTokenizer();
        this._template = "";
        this._originalTokens = [];
        this._initialTokens = [];
        this._variableNames = [];
        this._resultTokens = [];
    }
    /**
     * The mustache template.
     */
    get template() {
        return this._template;
    }
    /**
     * The mustache template.
     */
    set template(value) {
        this.parseString(value);
    }
    get originalTokens() {
        return this._originalTokens;
    }
    set originalTokens(value) {
        this.parseTokens(value);
    }
    /**
     * The list of original mustache tokens.
     */
    get initialTokens() {
        return this._initialTokens;
    }
    /**
     * The list of parsed mustache tokens.
     */
    get resultTokens() {
        return this._resultTokens;
    }
    /**
     * The list of found variable names.
     */
    get variableNames() {
        return this._variableNames;
    }
    /**
     * Sets a new mustache string and parses it into internal byte code.
     * @param mustache A new mustache string.
     */
    parseString(mustache) {
        this.clear();
        this._template = mustache != null ? mustache.trim() : "";
        this._originalTokens = this.tokenizeMustache(this._template);
        this.performParsing();
    }
    parseTokens(tokens) {
        this.clear();
        this._originalTokens = tokens;
        this._template = this.composeMustache(tokens);
        this.performParsing();
    }
    /**
     * Clears parsing results.
     */
    clear() {
        this._template = null;
        this._originalTokens = [];
        this._initialTokens = [];
        this._resultTokens = [];
        this._currentTokenIndex = 0;
        this._variableNames = [];
    }
    /**
     * Checks are there more tokens for processing.
     * @returns <code>true</code> if some tokens are present.
     */
    hasMoreTokens() {
        return this._currentTokenIndex < this._initialTokens.length;
    }
    /**
     * Checks are there more tokens available and throws exception if no more tokens available.
     */
    checkForMoreTokens() {
        if (!this.hasMoreTokens()) {
            throw new MustacheException_1.MustacheException(null, MustacheErrorCode_1.MustacheErrorCode.UnexpectedEnd, "Unexpected end of mustache", 0, 0);
        }
    }
    /**
     * Gets the current token object.
     * @returns The current token object.
     */
    getCurrentToken() {
        return this._currentTokenIndex < this._initialTokens.length
            ? this._initialTokens[this._currentTokenIndex] : null;
    }
    /**
     * Gets the next token object.
     * @returns The next token object.
     */
    getNextToken() {
        return (this._currentTokenIndex + 1) < this._initialTokens.length
            ? this._initialTokens[this._currentTokenIndex + 1] : null;
    }
    /**
     * Moves to the next token object.
     */
    moveToNextToken() {
        this._currentTokenIndex++;
    }
    /**
     * Adds an mustache to the result list
     * @param type The type of the token to be added.
     * @param value The value of the token to be added.
     * @param line The line where the token is.
     * @param column The column number where the token is.
     */
    addTokenToResult(type, value, line, column) {
        let token = new MustacheToken_1.MustacheToken(type, value, line, column);
        this._resultTokens.push(token);
        return token;
    }
    tokenizeMustache(mustache) {
        mustache = mustache != null ? mustache.trim() : "";
        if (mustache.length > 0) {
            this._tokenizer.skipWhitespaces = true;
            this._tokenizer.skipComments = true;
            this._tokenizer.skipEof = true;
            this._tokenizer.decodeStrings = true;
            return this._tokenizer.tokenizeBuffer(mustache);
        }
        else {
            return [];
        }
    }
    composeMustache(tokens) {
        let builder = "";
        for (let token of tokens) {
            builder = builder + token.value;
        }
        return builder;
    }
    performParsing() {
        if (this._originalTokens.length > 0) {
            this.completeLexicalAnalysis();
            this.performSyntaxAnalysis();
            if (this.hasMoreTokens()) {
                let token = this.getCurrentToken();
                throw new MustacheException_1.MustacheException(null, MustacheErrorCode_1.MustacheErrorCode.ErrorNear, "Syntax error near " + token.value, token.line, token.column);
            }
            this.lookupVariables();
        }
    }
    /**
     * Tokenizes the given mustache and prepares an initial tokens list.
     */
    completeLexicalAnalysis() {
        let state = MustacheLexicalState_1.MustacheLexicalState.Value;
        let closingBracket = null;
        let operator1 = null;
        let operator2 = null;
        let variable = null;
        for (let token of this._originalTokens) {
            let tokenType = MustacheTokenType_1.MustacheTokenType.Unknown;
            let tokenValue = null;
            if (state == MustacheLexicalState_1.MustacheLexicalState.Comment) {
                if (token.value == "}}" || token.value == "}}}") {
                    state = MustacheLexicalState_1.MustacheLexicalState.Closure;
                }
                else {
                    continue;
                }
            }
            switch (token.type) {
                case TokenType_1.TokenType.Special:
                    if (state == MustacheLexicalState_1.MustacheLexicalState.Value) {
                        tokenType = MustacheTokenType_1.MustacheTokenType.Value;
                        tokenValue = token.value;
                    }
                    break;
                case TokenType_1.TokenType.Symbol:
                    if (state == MustacheLexicalState_1.MustacheLexicalState.Value && (token.value == "{{" || token.value == "{{{")) {
                        closingBracket = token.value == "{{" ? "}}" : "}}}";
                        state = MustacheLexicalState_1.MustacheLexicalState.Operator1;
                        continue;
                    }
                    if (state == MustacheLexicalState_1.MustacheLexicalState.Operator1 && token.value == "!") {
                        operator1 = token.value;
                        state = MustacheLexicalState_1.MustacheLexicalState.Comment;
                        continue;
                    }
                    if (state == MustacheLexicalState_1.MustacheLexicalState.Operator1 && (token.value == "/" || token.value == "#" || token.value == "^")) {
                        operator1 = token.value;
                        state = MustacheLexicalState_1.MustacheLexicalState.Operator2;
                        continue;
                    }
                    if (state == MustacheLexicalState_1.MustacheLexicalState.Variable && (token.value == "}}" || token.value == "}}}")) {
                        if (operator1 != "/") {
                            variable = operator2;
                            operator2 = null;
                        }
                        state = MustacheLexicalState_1.MustacheLexicalState.Closure;
                        // Pass through
                    }
                    if (state == MustacheLexicalState_1.MustacheLexicalState.Closure && (token.value == "}}" || token.value == "}}}")) {
                        if (closingBracket != token.value) {
                            throw new MustacheException_1.MustacheException(null, MustacheErrorCode_1.MustacheErrorCode.MismatchedBrackets, "Mismatched brackets. Expected '" + closingBracket + "'", token.line, token.column);
                        }
                        if (operator1 == "#" && (operator2 == null || operator2 == "if")) {
                            tokenType = MustacheTokenType_1.MustacheTokenType.Section;
                            tokenValue = variable;
                        }
                        if (operator1 == "#" && operator2 == "unless") {
                            tokenType = MustacheTokenType_1.MustacheTokenType.InvertedSection;
                            tokenValue = variable;
                        }
                        if (operator1 == "^" && operator2 == null) {
                            tokenType = MustacheTokenType_1.MustacheTokenType.InvertedSection;
                            tokenValue = variable;
                        }
                        if (operator1 == "/") {
                            tokenType = MustacheTokenType_1.MustacheTokenType.SectionEnd;
                            tokenValue = variable;
                        }
                        if (operator1 == null) {
                            tokenType = closingBracket == "}}" ? MustacheTokenType_1.MustacheTokenType.Variable : MustacheTokenType_1.MustacheTokenType.EscapedVariable;
                            tokenValue = variable;
                        }
                        if (tokenType == MustacheTokenType_1.MustacheTokenType.Unknown) {
                            throw new MustacheException_1.MustacheException(null, MustacheErrorCode_1.MustacheErrorCode.Internal, "Internal error", token.line, token.column);
                        }
                        operator1 = null;
                        operator2 = null;
                        variable = null;
                        state = MustacheLexicalState_1.MustacheLexicalState.Value;
                    }
                    break;
                case TokenType_1.TokenType.Word:
                    if (state == MustacheLexicalState_1.MustacheLexicalState.Operator1) {
                        state = MustacheLexicalState_1.MustacheLexicalState.Variable;
                    }
                    if (state == MustacheLexicalState_1.MustacheLexicalState.Operator2 && (token.value == "if" || token.value == "unless")) {
                        operator2 = token.value;
                        state = MustacheLexicalState_1.MustacheLexicalState.Variable;
                        continue;
                    }
                    if (state == MustacheLexicalState_1.MustacheLexicalState.Operator2) {
                        state = MustacheLexicalState_1.MustacheLexicalState.Variable;
                    }
                    if (state == MustacheLexicalState_1.MustacheLexicalState.Variable) {
                        variable = token.value;
                        state = MustacheLexicalState_1.MustacheLexicalState.Closure;
                        continue;
                    }
                    break;
                case TokenType_1.TokenType.Whitespace:
                    continue;
            }
            if (tokenType == MustacheTokenType_1.MustacheTokenType.Unknown) {
                throw new MustacheException_1.MustacheException(null, MustacheErrorCode_1.MustacheErrorCode.UnexpectedSymbol, "Unexpected symbol '" + token.value + "'", token.line, token.column);
            }
            this._initialTokens.push(new MustacheToken_1.MustacheToken(tokenType, tokenValue, token.line, token.column));
        }
        if (state != MustacheLexicalState_1.MustacheLexicalState.Value) {
            throw new MustacheException_1.MustacheException(null, MustacheErrorCode_1.MustacheErrorCode.UnexpectedEnd, "Unexpected end of file", 0, 0);
        }
    }
    /**
     * Performs a syntax analysis at level 0.
     */
    performSyntaxAnalysis() {
        this.checkForMoreTokens();
        while (this.hasMoreTokens()) {
            let token = this.getCurrentToken();
            this.moveToNextToken();
            if (token.type == MustacheTokenType_1.MustacheTokenType.SectionEnd) {
                throw new MustacheException_1.MustacheException(null, MustacheErrorCode_1.MustacheErrorCode.UnexpectedSectionEnd, "Unexpected section end for variable '" + token.value + "'", token.line, token.column);
            }
            let result = this.addTokenToResult(token.type, token.value, token.line, token.column);
            if (token.type == MustacheTokenType_1.MustacheTokenType.Section || token.type == MustacheTokenType_1.MustacheTokenType.InvertedSection) {
                result.tokens.push(...this.performSyntaxAnalysisForSection(token.value));
            }
        }
    }
    /**
     * Performs a syntax analysis for section
     */
    performSyntaxAnalysisForSection(variable) {
        let result = [];
        this.checkForMoreTokens();
        while (this.hasMoreTokens()) {
            let token = this.getCurrentToken();
            this.moveToNextToken();
            if (token.type == MustacheTokenType_1.MustacheTokenType.SectionEnd && (token.value == variable || token.value == null)) {
                return result;
            }
            if (token.type == MustacheTokenType_1.MustacheTokenType.SectionEnd) {
                throw new MustacheException_1.MustacheException(null, MustacheErrorCode_1.MustacheErrorCode.UnexpectedSectionEnd, "Unexpected section end for variable '" + variable + "'", token.line, token.column);
            }
            let resultToken = new MustacheToken_1.MustacheToken(token.type, token.value, token.line, token.column);
            if (token.type == MustacheTokenType_1.MustacheTokenType.Section || token.type == MustacheTokenType_1.MustacheTokenType.InvertedSection) {
                resultToken.tokens.push(...this.performSyntaxAnalysisForSection(token.value));
            }
            result.push(resultToken);
        }
        let token = this.getCurrentToken();
        throw new MustacheException_1.MustacheException(null, MustacheErrorCode_1.MustacheErrorCode.NotClosedSection, "Not closed section for variable '" + variable + "'", token.line, token.column);
    }
    /**
     * Retrieves variables from the parsed output.
     */
    lookupVariables() {
        if (this._originalTokens == null)
            return;
        this._variableNames = [];
        for (let token of this._initialTokens) {
            if (token.type != MustacheTokenType_1.MustacheTokenType.Value
                && token.type != MustacheTokenType_1.MustacheTokenType.Comment
                && token.value != null) {
                let variableName = token.value.toLowerCase();
                let found = this._variableNames.some((v) => v.toLowerCase() == variableName);
                if (!found) {
                    this._variableNames.push(token.value);
                }
            }
        }
    }
}
exports.MustacheParser = MustacheParser;
//# sourceMappingURL=MustacheParser.js.map