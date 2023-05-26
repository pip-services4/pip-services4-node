/** @module calculator */
import { ExpressionTokenType } from "./ExpressionTokenType";
import { ITokenizer } from "../../tokenizers/ITokenizer";
import { ExpressionTokenizer } from "../tokenizers/ExpressionTokenizer";
import { Token } from "../../tokenizers/Token";
import { TokenType } from "../../tokenizers/TokenType";
import { ExpressionToken } from "./ExpressionToken";
import { SyntaxException } from "../SyntaxException";
import { SyntaxErrorCode } from "../SyntaxErrorCode";
import { Variant } from "../../variants/Variant";
import { IntegerConverter } from "pip-services4-commons-node";
import { FloatConverter } from "pip-services4-commons-node";

/**
 * Implements an expression parser class.
 */
export class ExpressionParser {
    /**
     *  Defines a list of operators.
     */
    private Operators: string[] = [
        "(", ")", "[", "]", "+", "-", "*", "/", "%", "^",
        "=", "<>", "!=", ">", "<", ">=", "<=", "<<", ">>",
        "AND", "OR", "XOR", "NOT", "IS", "IN", "NULL", "LIKE", ","
    ];

    /**
     * Defines a list of operator token types.
     * Note: it must match to operators.
     */
    private OperatorTypes: ExpressionTokenType[] = [
        ExpressionTokenType.LeftBrace, ExpressionTokenType.RightBrace,
        ExpressionTokenType.LeftSquareBrace, ExpressionTokenType.RightSquareBrace,
        ExpressionTokenType.Plus, ExpressionTokenType.Minus,
        ExpressionTokenType.Star, ExpressionTokenType.Slash,
        ExpressionTokenType.Procent, ExpressionTokenType.Power,
        ExpressionTokenType.Equal, ExpressionTokenType.NotEqual,
        ExpressionTokenType.NotEqual, ExpressionTokenType.More,
        ExpressionTokenType.Less, ExpressionTokenType.EqualMore,
        ExpressionTokenType.EqualLess, ExpressionTokenType.ShiftLeft,
        ExpressionTokenType.ShiftRight, ExpressionTokenType.And,
        ExpressionTokenType.Or, ExpressionTokenType.Xor,
        ExpressionTokenType.Not, ExpressionTokenType.Is,
        ExpressionTokenType.In, ExpressionTokenType.Null,
        ExpressionTokenType.Like, ExpressionTokenType.Comma
    ];

    private _tokenizer: ITokenizer = new ExpressionTokenizer();
    private _expression = "";
    private _originalTokens: Token[] = [];
    private _initialTokens: ExpressionToken[] = [];
    private _currentTokenIndex: number;
    private _variableNames: string[] = [];
    private _resultTokens: ExpressionToken[] = [];

    /**
     * The expression string.
     */
    public get expression(): string {
        return this._expression;
    }

    /**
     * The expression string.
     */
    public set expression(value: string) {
        this.parseString(value);
    }

    public get originalTokens(): Token[] {
        return this._originalTokens;
    }

    public set originalTokens(value: Token[]) {
        this.parseTokens(value);
    }

    /**
     * The list of original expression tokens.
     */
    public get initialTokens(): ExpressionToken[] {
        return this._initialTokens;
    }

    /**
     * The list of parsed expression tokens.
     */
    public get resultTokens(): ExpressionToken[] {
        return this._resultTokens;
    }

    /**
     * The list of found variable names.
     */
    public get variableNames(): string[] {
        return this._variableNames;
    }

    /**
     * Sets a new expression string and parses it into internal byte code.
     * @param expression A new expression string.
     */
    public parseString(expression: string): void {
        this.clear();
        this._expression = expression != null ? expression.trim() : "";
        this._originalTokens = this.tokenizeExpression(this._expression);
        this.performParsing();
    }

    public parseTokens(tokens: Token[]): void {
        this.clear();
        this._originalTokens = tokens;
        this._expression = this.composeExpression(tokens);
        this.performParsing();
    }

    /**
     * Clears parsing results.
     */
    public clear(): void {
        this._expression = null;
        this._originalTokens = [];
        this._initialTokens = []
        this._resultTokens = []
        this._currentTokenIndex = 0;
        this._variableNames = [];
    }

    /**
     * Checks are there more tokens for processing.
     * @returns <code>true</code> if some tokens are present.
     */
    private hasMoreTokens(): boolean {
        return this._currentTokenIndex < this._initialTokens.length;
    }

    /**
     * Checks are there more tokens available and throws exception if no more tokens available.
     */
    private checkForMoreTokens(): void {
        if (!this.hasMoreTokens()) {
            throw new SyntaxException(null, SyntaxErrorCode.UnexpectedEnd, "Unexpected end of expression.", 0, 0);
        }
    }

    /**
     * Gets the current token object.
     * @returns The current token object.
     */
    private getCurrentToken(): ExpressionToken {
        return this._currentTokenIndex < this._initialTokens.length
            ? this._initialTokens[this._currentTokenIndex] : null;
    }

    /**
     * Gets the next token object.
     * @returns The next token object.
     */
    private getNextToken(): ExpressionToken  {
        return (this._currentTokenIndex + 1) < this._initialTokens.length
            ? this._initialTokens[this._currentTokenIndex + 1] : null;
    }

    /**
     * Moves to the next token object.
     */
    private moveToNextToken(): void {
        this._currentTokenIndex++;
    }

    /**
     * Adds an expression to the result list
     * @param type The type of the token to be added.
     * @param value The value of the token to be added.
     * @param line The line number where the token is.
     * @param column The column number where the token is.
     */
    private addTokenToResult(type: ExpressionTokenType, value: Variant, line: number, column: number): void  {
        this._resultTokens.push(new ExpressionToken(type, value, line, column));
    }

    /**
     * Matches available tokens types with types from the list.
     * If tokens matchs then shift the list.
     * @param types A list of token types to compare.
     * <code>true</code> if token types match.
     */
    private matchTokensWithTypes(...types: ExpressionTokenType[]): boolean {
        let matches = false;
        for (let i = 0; i < types.length; i++) {
            if (this._currentTokenIndex + i < this._initialTokens.length) {
                matches = this._initialTokens[this._currentTokenIndex + i].type == types[i];
            } else {
                matches = false;
                break;
            }
        }

        if (matches) {
            this._currentTokenIndex += types.length;
        }
        return matches;
    }

    private tokenizeExpression(expression: string): Token[] {
        expression = expression != null ? expression.trim() : "";
        if (expression.length > 0) {
            this._tokenizer.skipWhitespaces = true;
            this._tokenizer.skipComments = true;
            this._tokenizer.skipEof = true;
            this._tokenizer.decodeStrings = true;
            return this._tokenizer.tokenizeBuffer(expression);
        } else {
            return [];
        }
    }

    private composeExpression(tokens: Token[]): string {
        let builder = "";
        for (const token of tokens) {
            builder = builder + token.value;
        }
        return builder
    }

    private performParsing(): void {
        if (this._originalTokens.length > 0) {
            this.completeLexicalAnalysis();
            this.performSyntaxAnalysis();
            if (this.hasMoreTokens()) {
                const token = this.getCurrentToken();
                throw new SyntaxException(null, SyntaxErrorCode.ErrorNear, "Syntax error near " + token.value, token.line, token.column);
            }
        }
    }

    /**
     * Tokenizes the given expression and prepares an initial tokens list.
     */
    private completeLexicalAnalysis(): void {
        for (const token of this._originalTokens) {
            let tokenType = ExpressionTokenType.Unknown;
            let tokenValue = Variant.Empty;

            switch (token.type) {
                case TokenType.Comment:
                case TokenType.Whitespace:
                    continue;
                case TokenType.Keyword:
                    {
                        const temp = token.value.toUpperCase();
                        if (temp == "TRUE") {
                            tokenType = ExpressionTokenType.Constant;
                            tokenValue = Variant.fromBoolean(true);
                        } else if (temp == "FALSE") {
                            tokenType = ExpressionTokenType.Constant;
                            tokenValue = Variant.fromBoolean(false);
                        } else {
                            for (let index = 0; index < this.Operators.length; index++) {
                                if (temp == this.Operators[index]) {
                                    tokenType = this.OperatorTypes[index];
                                    break;
                                }
                            }
                        }
                        break;
                    }
                case TokenType.Word:
                    {
                        tokenType = ExpressionTokenType.Variable;
                        tokenValue = Variant.fromString(token.value);
                        break;
                    }
                case TokenType.Integer:
                    {
                        tokenType = ExpressionTokenType.Constant;
                        tokenValue = Variant.fromInteger(IntegerConverter.toInteger(token.value));
                        break;
                    }
                case TokenType.Float:
                    {
                        tokenType = ExpressionTokenType.Constant;
                        tokenValue = Variant.fromFloat(FloatConverter.toFloat(token.value));
                        break;
                    }
                case TokenType.Quoted:
                    {
                        tokenType = ExpressionTokenType.Constant;
                        tokenValue = Variant.fromString(token.value);
                        break;
                    }
                case TokenType.Symbol:
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
            if (tokenType == ExpressionTokenType.Unknown) {
                throw new SyntaxException(null, SyntaxErrorCode.UnknownSymbol, "Unknown symbol " + token.value, token.line, token.column);
            }
            this._initialTokens.push(new ExpressionToken(tokenType, tokenValue, token.line, token.column));
        }
    }

    /**
     * Performs a syntax analysis at level 0.
     */
    private performSyntaxAnalysis(): void {
        this.checkForMoreTokens();
        this.performSyntaxAnalysisAtLevel1();
        while (this.hasMoreTokens()) {
            const token = this.getCurrentToken();
            if (token.type == ExpressionTokenType.And
                || token.type == ExpressionTokenType.Or
                || token.type == ExpressionTokenType.Xor) {
                this.moveToNextToken();
                this.performSyntaxAnalysisAtLevel1();
                this.addTokenToResult(token.type, Variant.Empty, token.line, token.column);
                continue;
            }
            break;
        }
    }

    /**
     * Performs a syntax analysis at level 1.
     */
    private performSyntaxAnalysisAtLevel1(): void {
        this.checkForMoreTokens();
        const token = this.getCurrentToken();
        if (token.type == ExpressionTokenType.Not) {
            this.moveToNextToken();
            this.performSyntaxAnalysisAtLevel2();
            this.addTokenToResult(token.type, Variant.Empty, token.line, token.column);
        } else {
            this.performSyntaxAnalysisAtLevel2();
        }
    }

    /**
     * Performs a syntax analysis at level 2.
     */
    private performSyntaxAnalysisAtLevel2(): void {
        this.checkForMoreTokens();
        this.performSyntaxAnalysisAtLevel3();
        while (this.hasMoreTokens()) {
            const token = this.getCurrentToken();
            if (token.type == ExpressionTokenType.Equal
                || token.type == ExpressionTokenType.NotEqual
                || token.type == ExpressionTokenType.More
                || token.type == ExpressionTokenType.Less
                || token.type == ExpressionTokenType.EqualMore
                || token.type == ExpressionTokenType.EqualLess) {
                this.moveToNextToken();
                this.performSyntaxAnalysisAtLevel3();
                this.addTokenToResult(token.type, Variant.Empty, token.line, token.column);
                continue;
            }
            break;
        }
    }

    /**
     * Performs a syntax analysis at level 3.
     */
    private performSyntaxAnalysisAtLevel3(): void {
        this.checkForMoreTokens();
        this.performSyntaxAnalysisAtLevel4();
        while (this.hasMoreTokens()) {
            const token = this.getCurrentToken();
            if (token.type == ExpressionTokenType.Plus
                || token.type == ExpressionTokenType.Minus
                || token.type == ExpressionTokenType.Like) {
                this.moveToNextToken();
                this.performSyntaxAnalysisAtLevel4();
                this.addTokenToResult(token.type, Variant.Empty, token.line, token.column);
            } else if (this.matchTokensWithTypes(ExpressionTokenType.Not, ExpressionTokenType.Like)) {
                this.performSyntaxAnalysisAtLevel4();
                this.addTokenToResult(ExpressionTokenType.NotLike, Variant.Empty, token.line, token.column);
            } else if (this.matchTokensWithTypes(ExpressionTokenType.Is, ExpressionTokenType.Null)) {
                this.addTokenToResult(ExpressionTokenType.IsNull, Variant.Empty, token.line, token.column);
            } else if (this.matchTokensWithTypes(ExpressionTokenType.Is, ExpressionTokenType.Not,
                ExpressionTokenType.Null)) {
                this.addTokenToResult(ExpressionTokenType.IsNotNull, Variant.Empty, token.line, token.column);
            } else if (this.matchTokensWithTypes(ExpressionTokenType.Not, ExpressionTokenType.In)) {
                this.performSyntaxAnalysisAtLevel4();
                this.addTokenToResult(ExpressionTokenType.NotIn, Variant.Empty, token.line, token.column);
            } else {
                break;
            }
        }
    }

    /**
     * Performs a syntax analysis at level 4.
     */
    private performSyntaxAnalysisAtLevel4(): void {
        this.checkForMoreTokens();
        this.performSyntaxAnalysisAtLevel5();
        while (this.hasMoreTokens()) {
            const token = this.getCurrentToken();
            if (token.type == ExpressionTokenType.Star
                || token.type == ExpressionTokenType.Slash
                || token.type == ExpressionTokenType.Procent) {
                this.moveToNextToken();
                this.performSyntaxAnalysisAtLevel5();
                this.addTokenToResult(token.type, Variant.Empty, token.line, token.column);
                continue;
            }
            break;
        }
    }

    /**
     * Performs a syntax analysis at level 5.
     */
    private performSyntaxAnalysisAtLevel5(): void {
        this.checkForMoreTokens();
        this.performSyntaxAnalysisAtLevel6();
        while (this.hasMoreTokens()) {
            const token = this.getCurrentToken();
            if (token.type == ExpressionTokenType.Power
                || token.type == ExpressionTokenType.In
                || token.type == ExpressionTokenType.ShiftLeft
                || token.type == ExpressionTokenType.ShiftRight) {
                this.moveToNextToken();
                this.performSyntaxAnalysisAtLevel6();
                this.addTokenToResult(token.type, Variant.Empty, token.line, token.column);
                continue;
            }
            break;
        }
    }

    /**
     * Performs a syntax analysis at level 6.
     */
    private performSyntaxAnalysisAtLevel6(): void {
        this.checkForMoreTokens();
        // Process unary '+' or '-'.
        let unaryToken = this.getCurrentToken();
        if (unaryToken.type == ExpressionTokenType.Plus) {
            unaryToken = null;
            this.moveToNextToken();
        } else if (unaryToken.type == ExpressionTokenType.Minus) {
            unaryToken = new ExpressionToken(ExpressionTokenType.Unary, unaryToken.value, unaryToken.line, unaryToken.line);
            this.moveToNextToken();
        } else {
            unaryToken = null;
        }

        this.checkForMoreTokens();

        // Identify function calls.
        let primitiveToken = this.getCurrentToken();
        const nextToken = this.getNextToken();
        if (primitiveToken.type == ExpressionTokenType.Variable
            && nextToken != null && nextToken.type == ExpressionTokenType.LeftBrace) {
            primitiveToken = new ExpressionToken(ExpressionTokenType.Function, primitiveToken.value, primitiveToken.line, primitiveToken.column);
        }

        if (primitiveToken.type == ExpressionTokenType.Constant) {
            this.moveToNextToken();
            this.addTokenToResult(primitiveToken.type, primitiveToken.value, primitiveToken.line, primitiveToken.column);
        } else if (primitiveToken.type == ExpressionTokenType.Variable) {
            this.moveToNextToken();

            const temp = primitiveToken.value.asString;
            if (this._variableNames.indexOf(temp) < 0) {
                this._variableNames.push(temp);
            }

            this.addTokenToResult(primitiveToken.type, primitiveToken.value, primitiveToken.line, primitiveToken.column);
        }
        else if (primitiveToken.type == ExpressionTokenType.LeftBrace) {
            this.moveToNextToken();
            this.performSyntaxAnalysis();
            this.checkForMoreTokens();
            primitiveToken = this.getCurrentToken();
            if (primitiveToken.type != ExpressionTokenType.RightBrace) {
                throw new SyntaxException(null, SyntaxErrorCode.MissedCloseParenthesis, "Expected ')' was not found", primitiveToken.line, primitiveToken.column);
            }
            this.moveToNextToken();
        } else if (primitiveToken.type == ExpressionTokenType.Function) {
            this.moveToNextToken();
            let token = this.getCurrentToken();
            if (token.type != ExpressionTokenType.LeftBrace) {
                throw new SyntaxException(null, SyntaxErrorCode.Internal, "Internal error", token.line, token.column);
            }
            let paramCount = 0;
            do {
                this.moveToNextToken();
                token = this.getCurrentToken();
                if (token == null || token.type == ExpressionTokenType.RightBrace) {
                    break;
                }
                paramCount++;
                this.performSyntaxAnalysis();
                token = this.getCurrentToken();
            } while (token != null && token.type == ExpressionTokenType.Comma);

            this.checkForMoreTokens();

            if (token.type != ExpressionTokenType.RightBrace) {
                throw new SyntaxException(null, SyntaxErrorCode.MissedCloseParenthesis, "Expected ')' was not found", token.line, token.column);
            }
            this.moveToNextToken();

            this.addTokenToResult(ExpressionTokenType.Constant, new Variant(paramCount), primitiveToken.line, primitiveToken.column);
            this.addTokenToResult(primitiveToken.type, primitiveToken.value, primitiveToken.line, primitiveToken.column);
        } else {
            throw new SyntaxException(null, SyntaxErrorCode.ErrorAt, "Syntax error at " + primitiveToken.value, primitiveToken.line, primitiveToken.column);
        }

        if (unaryToken != null) {
            this.addTokenToResult(unaryToken.type, Variant.Empty, unaryToken.line, unaryToken.column);
        }

        // Process [] operator.
        if (this.hasMoreTokens()) {
            primitiveToken = this.getCurrentToken();
            if (primitiveToken.type == ExpressionTokenType.LeftSquareBrace) {
                this.moveToNextToken();
                this.performSyntaxAnalysis();
                this.checkForMoreTokens();
                primitiveToken = this.getCurrentToken();
                if (primitiveToken.type != ExpressionTokenType.RightSquareBrace) {
                    throw new SyntaxException(null, SyntaxErrorCode.MissedCloseSquareBracket, "Expected ']' was not found", primitiveToken.line, primitiveToken.column);
                }
                this.moveToNextToken();
                this.addTokenToResult(ExpressionTokenType.Element, Variant.Empty, primitiveToken.line, primitiveToken.column);
            }
        }
    }

}