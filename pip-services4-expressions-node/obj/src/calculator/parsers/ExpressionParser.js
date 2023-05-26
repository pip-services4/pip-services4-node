"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionParser = void 0;
/** @module calculator */
const ExpressionTokenType_1 = require("./ExpressionTokenType");
const ExpressionTokenizer_1 = require("../tokenizers/ExpressionTokenizer");
const TokenType_1 = require("../../tokenizers/TokenType");
const ExpressionToken_1 = require("./ExpressionToken");
const SyntaxException_1 = require("../SyntaxException");
const SyntaxErrorCode_1 = require("../SyntaxErrorCode");
const Variant_1 = require("../../variants/Variant");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_commons_node_2 = require("pip-services4-commons-node");
/**
 * Implements an expression parser class.
 */
class ExpressionParser {
    constructor() {
        /**
         *  Defines a list of operators.
         */
        this.Operators = [
            "(", ")", "[", "]", "+", "-", "*", "/", "%", "^",
            "=", "<>", "!=", ">", "<", ">=", "<=", "<<", ">>",
            "AND", "OR", "XOR", "NOT", "IS", "IN", "NULL", "LIKE", ","
        ];
        /**
         * Defines a list of operator token types.
         * Note: it must match to operators.
         */
        this.OperatorTypes = [
            ExpressionTokenType_1.ExpressionTokenType.LeftBrace, ExpressionTokenType_1.ExpressionTokenType.RightBrace,
            ExpressionTokenType_1.ExpressionTokenType.LeftSquareBrace, ExpressionTokenType_1.ExpressionTokenType.RightSquareBrace,
            ExpressionTokenType_1.ExpressionTokenType.Plus, ExpressionTokenType_1.ExpressionTokenType.Minus,
            ExpressionTokenType_1.ExpressionTokenType.Star, ExpressionTokenType_1.ExpressionTokenType.Slash,
            ExpressionTokenType_1.ExpressionTokenType.Procent, ExpressionTokenType_1.ExpressionTokenType.Power,
            ExpressionTokenType_1.ExpressionTokenType.Equal, ExpressionTokenType_1.ExpressionTokenType.NotEqual,
            ExpressionTokenType_1.ExpressionTokenType.NotEqual, ExpressionTokenType_1.ExpressionTokenType.More,
            ExpressionTokenType_1.ExpressionTokenType.Less, ExpressionTokenType_1.ExpressionTokenType.EqualMore,
            ExpressionTokenType_1.ExpressionTokenType.EqualLess, ExpressionTokenType_1.ExpressionTokenType.ShiftLeft,
            ExpressionTokenType_1.ExpressionTokenType.ShiftRight, ExpressionTokenType_1.ExpressionTokenType.And,
            ExpressionTokenType_1.ExpressionTokenType.Or, ExpressionTokenType_1.ExpressionTokenType.Xor,
            ExpressionTokenType_1.ExpressionTokenType.Not, ExpressionTokenType_1.ExpressionTokenType.Is,
            ExpressionTokenType_1.ExpressionTokenType.In, ExpressionTokenType_1.ExpressionTokenType.Null,
            ExpressionTokenType_1.ExpressionTokenType.Like, ExpressionTokenType_1.ExpressionTokenType.Comma
        ];
        this._tokenizer = new ExpressionTokenizer_1.ExpressionTokenizer();
        this._expression = "";
        this._originalTokens = [];
        this._initialTokens = [];
        this._variableNames = [];
        this._resultTokens = [];
    }
    /**
     * The expression string.
     */
    get expression() {
        return this._expression;
    }
    /**
     * The expression string.
     */
    set expression(value) {
        this.parseString(value);
    }
    get originalTokens() {
        return this._originalTokens;
    }
    set originalTokens(value) {
        this.parseTokens(value);
    }
    /**
     * The list of original expression tokens.
     */
    get initialTokens() {
        return this._initialTokens;
    }
    /**
     * The list of parsed expression tokens.
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
     * Sets a new expression string and parses it into internal byte code.
     * @param expression A new expression string.
     */
    parseString(expression) {
        this.clear();
        this._expression = expression != null ? expression.trim() : "";
        this._originalTokens = this.tokenizeExpression(this._expression);
        this.performParsing();
    }
    parseTokens(tokens) {
        this.clear();
        this._originalTokens = tokens;
        this._expression = this.composeExpression(tokens);
        this.performParsing();
    }
    /**
     * Clears parsing results.
     */
    clear() {
        this._expression = null;
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
            throw new SyntaxException_1.SyntaxException(null, SyntaxErrorCode_1.SyntaxErrorCode.UnexpectedEnd, "Unexpected end of expression.", 0, 0);
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
     * Adds an expression to the result list
     * @param type The type of the token to be added.
     * @param value The value of the token to be added.
     * @param line The line number where the token is.
     * @param column The column number where the token is.
     */
    addTokenToResult(type, value, line, column) {
        this._resultTokens.push(new ExpressionToken_1.ExpressionToken(type, value, line, column));
    }
    /**
     * Matches available tokens types with types from the list.
     * If tokens matchs then shift the list.
     * @param types A list of token types to compare.
     * <code>true</code> if token types match.
     */
    matchTokensWithTypes(...types) {
        let matches = false;
        for (let i = 0; i < types.length; i++) {
            if (this._currentTokenIndex + i < this._initialTokens.length) {
                matches = this._initialTokens[this._currentTokenIndex + i].type == types[i];
            }
            else {
                matches = false;
                break;
            }
        }
        if (matches) {
            this._currentTokenIndex += types.length;
        }
        return matches;
    }
    tokenizeExpression(expression) {
        expression = expression != null ? expression.trim() : "";
        if (expression.length > 0) {
            this._tokenizer.skipWhitespaces = true;
            this._tokenizer.skipComments = true;
            this._tokenizer.skipEof = true;
            this._tokenizer.decodeStrings = true;
            return this._tokenizer.tokenizeBuffer(expression);
        }
        else {
            return [];
        }
    }
    composeExpression(tokens) {
        let builder = "";
        for (const token of tokens) {
            builder = builder + token.value;
        }
        return builder;
    }
    performParsing() {
        if (this._originalTokens.length > 0) {
            this.completeLexicalAnalysis();
            this.performSyntaxAnalysis();
            if (this.hasMoreTokens()) {
                const token = this.getCurrentToken();
                throw new SyntaxException_1.SyntaxException(null, SyntaxErrorCode_1.SyntaxErrorCode.ErrorNear, "Syntax error near " + token.value, token.line, token.column);
            }
        }
    }
    /**
     * Tokenizes the given expression and prepares an initial tokens list.
     */
    completeLexicalAnalysis() {
        for (const token of this._originalTokens) {
            let tokenType = ExpressionTokenType_1.ExpressionTokenType.Unknown;
            let tokenValue = Variant_1.Variant.Empty;
            switch (token.type) {
                case TokenType_1.TokenType.Comment:
                case TokenType_1.TokenType.Whitespace:
                    continue;
                case TokenType_1.TokenType.Keyword:
                    {
                        const temp = token.value.toUpperCase();
                        if (temp == "TRUE") {
                            tokenType = ExpressionTokenType_1.ExpressionTokenType.Constant;
                            tokenValue = Variant_1.Variant.fromBoolean(true);
                        }
                        else if (temp == "FALSE") {
                            tokenType = ExpressionTokenType_1.ExpressionTokenType.Constant;
                            tokenValue = Variant_1.Variant.fromBoolean(false);
                        }
                        else {
                            for (let index = 0; index < this.Operators.length; index++) {
                                if (temp == this.Operators[index]) {
                                    tokenType = this.OperatorTypes[index];
                                    break;
                                }
                            }
                        }
                        break;
                    }
                case TokenType_1.TokenType.Word:
                    {
                        tokenType = ExpressionTokenType_1.ExpressionTokenType.Variable;
                        tokenValue = Variant_1.Variant.fromString(token.value);
                        break;
                    }
                case TokenType_1.TokenType.Integer:
                    {
                        tokenType = ExpressionTokenType_1.ExpressionTokenType.Constant;
                        tokenValue = Variant_1.Variant.fromInteger(pip_services4_commons_node_1.IntegerConverter.toInteger(token.value));
                        break;
                    }
                case TokenType_1.TokenType.Float:
                    {
                        tokenType = ExpressionTokenType_1.ExpressionTokenType.Constant;
                        tokenValue = Variant_1.Variant.fromFloat(pip_services4_commons_node_2.FloatConverter.toFloat(token.value));
                        break;
                    }
                case TokenType_1.TokenType.Quoted:
                    {
                        tokenType = ExpressionTokenType_1.ExpressionTokenType.Constant;
                        tokenValue = Variant_1.Variant.fromString(token.value);
                        break;
                    }
                case TokenType_1.TokenType.Symbol:
                    {
                        const temp = token.value.toUpperCase();
                        for (let i = 0; i < this.Operators.length; i++) {
                            if (temp == this.Operators[i]) {
                                tokenType = this.OperatorTypes[i];
                                break;
                            }
                        }
                        break;
                    }
            }
            if (tokenType == ExpressionTokenType_1.ExpressionTokenType.Unknown) {
                throw new SyntaxException_1.SyntaxException(null, SyntaxErrorCode_1.SyntaxErrorCode.UnknownSymbol, "Unknown symbol " + token.value, token.line, token.column);
            }
            this._initialTokens.push(new ExpressionToken_1.ExpressionToken(tokenType, tokenValue, token.line, token.column));
        }
    }
    /**
     * Performs a syntax analysis at level 0.
     */
    performSyntaxAnalysis() {
        this.checkForMoreTokens();
        this.performSyntaxAnalysisAtLevel1();
        while (this.hasMoreTokens()) {
            const token = this.getCurrentToken();
            if (token.type == ExpressionTokenType_1.ExpressionTokenType.And
                || token.type == ExpressionTokenType_1.ExpressionTokenType.Or
                || token.type == ExpressionTokenType_1.ExpressionTokenType.Xor) {
                this.moveToNextToken();
                this.performSyntaxAnalysisAtLevel1();
                this.addTokenToResult(token.type, Variant_1.Variant.Empty, token.line, token.column);
                continue;
            }
            break;
        }
    }
    /**
     * Performs a syntax analysis at level 1.
     */
    performSyntaxAnalysisAtLevel1() {
        this.checkForMoreTokens();
        const token = this.getCurrentToken();
        if (token.type == ExpressionTokenType_1.ExpressionTokenType.Not) {
            this.moveToNextToken();
            this.performSyntaxAnalysisAtLevel2();
            this.addTokenToResult(token.type, Variant_1.Variant.Empty, token.line, token.column);
        }
        else {
            this.performSyntaxAnalysisAtLevel2();
        }
    }
    /**
     * Performs a syntax analysis at level 2.
     */
    performSyntaxAnalysisAtLevel2() {
        this.checkForMoreTokens();
        this.performSyntaxAnalysisAtLevel3();
        while (this.hasMoreTokens()) {
            const token = this.getCurrentToken();
            if (token.type == ExpressionTokenType_1.ExpressionTokenType.Equal
                || token.type == ExpressionTokenType_1.ExpressionTokenType.NotEqual
                || token.type == ExpressionTokenType_1.ExpressionTokenType.More
                || token.type == ExpressionTokenType_1.ExpressionTokenType.Less
                || token.type == ExpressionTokenType_1.ExpressionTokenType.EqualMore
                || token.type == ExpressionTokenType_1.ExpressionTokenType.EqualLess) {
                this.moveToNextToken();
                this.performSyntaxAnalysisAtLevel3();
                this.addTokenToResult(token.type, Variant_1.Variant.Empty, token.line, token.column);
                continue;
            }
            break;
        }
    }
    /**
     * Performs a syntax analysis at level 3.
     */
    performSyntaxAnalysisAtLevel3() {
        this.checkForMoreTokens();
        this.performSyntaxAnalysisAtLevel4();
        while (this.hasMoreTokens()) {
            const token = this.getCurrentToken();
            if (token.type == ExpressionTokenType_1.ExpressionTokenType.Plus
                || token.type == ExpressionTokenType_1.ExpressionTokenType.Minus
                || token.type == ExpressionTokenType_1.ExpressionTokenType.Like) {
                this.moveToNextToken();
                this.performSyntaxAnalysisAtLevel4();
                this.addTokenToResult(token.type, Variant_1.Variant.Empty, token.line, token.column);
            }
            else if (this.matchTokensWithTypes(ExpressionTokenType_1.ExpressionTokenType.Not, ExpressionTokenType_1.ExpressionTokenType.Like)) {
                this.performSyntaxAnalysisAtLevel4();
                this.addTokenToResult(ExpressionTokenType_1.ExpressionTokenType.NotLike, Variant_1.Variant.Empty, token.line, token.column);
            }
            else if (this.matchTokensWithTypes(ExpressionTokenType_1.ExpressionTokenType.Is, ExpressionTokenType_1.ExpressionTokenType.Null)) {
                this.addTokenToResult(ExpressionTokenType_1.ExpressionTokenType.IsNull, Variant_1.Variant.Empty, token.line, token.column);
            }
            else if (this.matchTokensWithTypes(ExpressionTokenType_1.ExpressionTokenType.Is, ExpressionTokenType_1.ExpressionTokenType.Not, ExpressionTokenType_1.ExpressionTokenType.Null)) {
                this.addTokenToResult(ExpressionTokenType_1.ExpressionTokenType.IsNotNull, Variant_1.Variant.Empty, token.line, token.column);
            }
            else if (this.matchTokensWithTypes(ExpressionTokenType_1.ExpressionTokenType.Not, ExpressionTokenType_1.ExpressionTokenType.In)) {
                this.performSyntaxAnalysisAtLevel4();
                this.addTokenToResult(ExpressionTokenType_1.ExpressionTokenType.NotIn, Variant_1.Variant.Empty, token.line, token.column);
            }
            else {
                break;
            }
        }
    }
    /**
     * Performs a syntax analysis at level 4.
     */
    performSyntaxAnalysisAtLevel4() {
        this.checkForMoreTokens();
        this.performSyntaxAnalysisAtLevel5();
        while (this.hasMoreTokens()) {
            const token = this.getCurrentToken();
            if (token.type == ExpressionTokenType_1.ExpressionTokenType.Star
                || token.type == ExpressionTokenType_1.ExpressionTokenType.Slash
                || token.type == ExpressionTokenType_1.ExpressionTokenType.Procent) {
                this.moveToNextToken();
                this.performSyntaxAnalysisAtLevel5();
                this.addTokenToResult(token.type, Variant_1.Variant.Empty, token.line, token.column);
                continue;
            }
            break;
        }
    }
    /**
     * Performs a syntax analysis at level 5.
     */
    performSyntaxAnalysisAtLevel5() {
        this.checkForMoreTokens();
        this.performSyntaxAnalysisAtLevel6();
        while (this.hasMoreTokens()) {
            const token = this.getCurrentToken();
            if (token.type == ExpressionTokenType_1.ExpressionTokenType.Power
                || token.type == ExpressionTokenType_1.ExpressionTokenType.In
                || token.type == ExpressionTokenType_1.ExpressionTokenType.ShiftLeft
                || token.type == ExpressionTokenType_1.ExpressionTokenType.ShiftRight) {
                this.moveToNextToken();
                this.performSyntaxAnalysisAtLevel6();
                this.addTokenToResult(token.type, Variant_1.Variant.Empty, token.line, token.column);
                continue;
            }
            break;
        }
    }
    /**
     * Performs a syntax analysis at level 6.
     */
    performSyntaxAnalysisAtLevel6() {
        this.checkForMoreTokens();
        // Process unary '+' or '-'.
        let unaryToken = this.getCurrentToken();
        if (unaryToken.type == ExpressionTokenType_1.ExpressionTokenType.Plus) {
            unaryToken = null;
            this.moveToNextToken();
        }
        else if (unaryToken.type == ExpressionTokenType_1.ExpressionTokenType.Minus) {
            unaryToken = new ExpressionToken_1.ExpressionToken(ExpressionTokenType_1.ExpressionTokenType.Unary, unaryToken.value, unaryToken.line, unaryToken.line);
            this.moveToNextToken();
        }
        else {
            unaryToken = null;
        }
        this.checkForMoreTokens();
        // Identify function calls.
        let primitiveToken = this.getCurrentToken();
        const nextToken = this.getNextToken();
        if (primitiveToken.type == ExpressionTokenType_1.ExpressionTokenType.Variable
            && nextToken != null && nextToken.type == ExpressionTokenType_1.ExpressionTokenType.LeftBrace) {
            primitiveToken = new ExpressionToken_1.ExpressionToken(ExpressionTokenType_1.ExpressionTokenType.Function, primitiveToken.value, primitiveToken.line, primitiveToken.column);
        }
        if (primitiveToken.type == ExpressionTokenType_1.ExpressionTokenType.Constant) {
            this.moveToNextToken();
            this.addTokenToResult(primitiveToken.type, primitiveToken.value, primitiveToken.line, primitiveToken.column);
        }
        else if (primitiveToken.type == ExpressionTokenType_1.ExpressionTokenType.Variable) {
            this.moveToNextToken();
            const temp = primitiveToken.value.asString;
            if (this._variableNames.indexOf(temp) < 0) {
                this._variableNames.push(temp);
            }
            this.addTokenToResult(primitiveToken.type, primitiveToken.value, primitiveToken.line, primitiveToken.column);
        }
        else if (primitiveToken.type == ExpressionTokenType_1.ExpressionTokenType.LeftBrace) {
            this.moveToNextToken();
            this.performSyntaxAnalysis();
            this.checkForMoreTokens();
            primitiveToken = this.getCurrentToken();
            if (primitiveToken.type != ExpressionTokenType_1.ExpressionTokenType.RightBrace) {
                throw new SyntaxException_1.SyntaxException(null, SyntaxErrorCode_1.SyntaxErrorCode.MissedCloseParenthesis, "Expected ')' was not found", primitiveToken.line, primitiveToken.column);
            }
            this.moveToNextToken();
        }
        else if (primitiveToken.type == ExpressionTokenType_1.ExpressionTokenType.Function) {
            this.moveToNextToken();
            let token = this.getCurrentToken();
            if (token.type != ExpressionTokenType_1.ExpressionTokenType.LeftBrace) {
                throw new SyntaxException_1.SyntaxException(null, SyntaxErrorCode_1.SyntaxErrorCode.Internal, "Internal error", token.line, token.column);
            }
            let paramCount = 0;
            do {
                this.moveToNextToken();
                token = this.getCurrentToken();
                if (token == null || token.type == ExpressionTokenType_1.ExpressionTokenType.RightBrace) {
                    break;
                }
                paramCount++;
                this.performSyntaxAnalysis();
                token = this.getCurrentToken();
            } while (token != null && token.type == ExpressionTokenType_1.ExpressionTokenType.Comma);
            this.checkForMoreTokens();
            if (token.type != ExpressionTokenType_1.ExpressionTokenType.RightBrace) {
                throw new SyntaxException_1.SyntaxException(null, SyntaxErrorCode_1.SyntaxErrorCode.MissedCloseParenthesis, "Expected ')' was not found", token.line, token.column);
            }
            this.moveToNextToken();
            this.addTokenToResult(ExpressionTokenType_1.ExpressionTokenType.Constant, new Variant_1.Variant(paramCount), primitiveToken.line, primitiveToken.column);
            this.addTokenToResult(primitiveToken.type, primitiveToken.value, primitiveToken.line, primitiveToken.column);
        }
        else {
            throw new SyntaxException_1.SyntaxException(null, SyntaxErrorCode_1.SyntaxErrorCode.ErrorAt, "Syntax error at " + primitiveToken.value, primitiveToken.line, primitiveToken.column);
        }
        if (unaryToken != null) {
            this.addTokenToResult(unaryToken.type, Variant_1.Variant.Empty, unaryToken.line, unaryToken.column);
        }
        // Process [] operator.
        if (this.hasMoreTokens()) {
            primitiveToken = this.getCurrentToken();
            if (primitiveToken.type == ExpressionTokenType_1.ExpressionTokenType.LeftSquareBrace) {
                this.moveToNextToken();
                this.performSyntaxAnalysis();
                this.checkForMoreTokens();
                primitiveToken = this.getCurrentToken();
                if (primitiveToken.type != ExpressionTokenType_1.ExpressionTokenType.RightSquareBrace) {
                    throw new SyntaxException_1.SyntaxException(null, SyntaxErrorCode_1.SyntaxErrorCode.MissedCloseSquareBracket, "Expected ']' was not found", primitiveToken.line, primitiveToken.column);
                }
                this.moveToNextToken();
                this.addTokenToResult(ExpressionTokenType_1.ExpressionTokenType.Element, Variant_1.Variant.Empty, primitiveToken.line, primitiveToken.column);
            }
        }
    }
}
exports.ExpressionParser = ExpressionParser;
//# sourceMappingURL=ExpressionParser.js.map