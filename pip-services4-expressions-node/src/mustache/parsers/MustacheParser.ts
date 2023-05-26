/** @module calculator */
import { MustacheTokenType } from "./MustacheTokenType";
import { ITokenizer } from "../../tokenizers/ITokenizer";
import { MustacheTokenizer } from "../tokenizers/MustacheTokenizer";
import { Token } from "../../tokenizers/Token";
import { TokenType } from "../../tokenizers/TokenType";
import { MustacheToken } from "./MustacheToken";
import { MustacheException } from "../MustacheException";
import { MustacheErrorCode } from "./MustacheErrorCode";
import { MustacheLexicalState } from "./MustacheLexicalState";

/**
 * Implements an mustache parser class.
 */
export class MustacheParser {
    private _tokenizer: ITokenizer = new MustacheTokenizer();
    private _template = "";
    private _originalTokens: Token[] = [];
    private _initialTokens: MustacheToken[] = [];
    private _currentTokenIndex: number;
    private _variableNames: string[] = [];
    private _resultTokens: MustacheToken[] = [];

    /**
     * The mustache template.
     */
    public get template(): string {
        return this._template;
    }

    /**
     * The mustache template.
     */
    public set template(value: string) {
        this.parseString(value);
    }

    public get originalTokens(): Token[] {
        return this._originalTokens;
    }

    public set originalTokens(value: Token[]) {
        this.parseTokens(value);
    }

    /**
     * The list of original mustache tokens.
     */
    public get initialTokens(): MustacheToken[] {
        return this._initialTokens;
    }

    /**
     * The list of parsed mustache tokens.
     */
    public get resultTokens(): MustacheToken[] {
        return this._resultTokens;
    }

    /**
     * The list of found variable names.
     */
    public get variableNames(): string[] {
        return this._variableNames;
    }

    /**
     * Sets a new mustache string and parses it into internal byte code.
     * @param mustache A new mustache string.
     */
    public parseString(mustache: string): void {
        this.clear();
        this._template = mustache != null ? mustache.trim() : "";
        this._originalTokens = this.tokenizeMustache(this._template);
        this.performParsing();
    }

    public parseTokens(tokens: Token[]): void {
        this.clear();
        this._originalTokens = tokens;
        this._template = this.composeMustache(tokens);
        this.performParsing();
    }

    /**
     * Clears parsing results.
     */
    public clear(): void {
        this._template = null;
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
            throw new MustacheException(null, MustacheErrorCode.UnexpectedEnd, "Unexpected end of mustache", 0, 0);
        }
    }

    /**
     * Gets the current token object.
     * @returns The current token object.
     */
    private getCurrentToken(): MustacheToken {
        return this._currentTokenIndex < this._initialTokens.length
            ? this._initialTokens[this._currentTokenIndex] : null;
    }

    /**
     * Gets the next token object.
     * @returns The next token object.
     */
    private getNextToken(): MustacheToken  {
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
     * Adds an mustache to the result list
     * @param type The type of the token to be added.
     * @param value The value of the token to be added.
     * @param line The line where the token is.
     * @param column The column number where the token is.
     */
    private addTokenToResult(type: MustacheTokenType, value: string, line: number, column: number): MustacheToken  {
        const token = new MustacheToken(type, value, line, column);
        this._resultTokens.push(token);
        return token;
    }

    private tokenizeMustache(mustache: string): Token[] {
        mustache = mustache != null ? mustache.trim() : "";
        if (mustache.length > 0) {
            this._tokenizer.skipWhitespaces = true;
            this._tokenizer.skipComments = true;
            this._tokenizer.skipEof = true;
            this._tokenizer.decodeStrings = true;
            return this._tokenizer.tokenizeBuffer(mustache);
        } else {
            return [];
        }
    }

    private composeMustache(tokens: Token[]): string {
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
                throw new MustacheException(null, MustacheErrorCode.ErrorNear, "Syntax error near " + token.value, token.line, token.column);
            }
            this.lookupVariables();
        }
    }

    /**
     * Tokenizes the given mustache and prepares an initial tokens list.
     */
    private completeLexicalAnalysis(): void {
        let state: MustacheLexicalState = MustacheLexicalState.Value;
        let closingBracket: string = null;
        let operator1: string = null;
        let operator2: string = null;
        let variable: string = null;

        for (const token of this._originalTokens) {
            let tokenType = MustacheTokenType.Unknown;
            let tokenValue = null;

            if (state == MustacheLexicalState.Comment) {
                if (token.value == "}}" || token.value == "}}}") {
                    state = MustacheLexicalState.Closure;
                } else {
                    continue;
                }
            }

            switch (token.type) {
                case TokenType.Special:
                    if (state == MustacheLexicalState.Value) {
                        tokenType = MustacheTokenType.Value;
                        tokenValue = token.value;
                    }
                    break;
                case TokenType.Symbol:
                    if (state == MustacheLexicalState.Value && (token.value == "{{" || token.value == "{{{")) {
                        closingBracket = token.value == "{{" ? "}}" : "}}}";
                        state = MustacheLexicalState.Operator1;
                        continue;
                    }
                    if (state == MustacheLexicalState.Operator1 && token.value == "!") {
                        operator1 = token.value;
                        state = MustacheLexicalState.Comment;
                        continue;
                    }
                    if (state == MustacheLexicalState.Operator1 && (token.value == "/" || token.value == "#" || token.value == "^")) {
                        operator1 = token.value;
                        state = MustacheLexicalState.Operator2;
                        continue;
                    }

                    if (state == MustacheLexicalState.Variable && (token.value == "}}" || token.value == "}}}")) {
                        if (operator1 != "/") {
                            variable = operator2;
                            operator2 = null;
                        }
                        state = MustacheLexicalState.Closure;
                        // Pass through
                    }
                    if (state == MustacheLexicalState.Closure && (token.value == "}}" || token.value == "}}}")) {
                        if (closingBracket != token.value) {
                            throw new MustacheException(null, MustacheErrorCode.MismatchedBrackets, "Mismatched brackets. Expected '" + closingBracket + "'", token.line, token.column);
                        }

                        if (operator1 == "#" && (operator2 == null || operator2 == "if")) {
                            tokenType = MustacheTokenType.Section;
                            tokenValue = variable;
                        }

                        if (operator1 == "#" && operator2 == "unless") {
                            tokenType = MustacheTokenType.InvertedSection;
                            tokenValue = variable;
                        }

                        if (operator1 == "^" && operator2 == null) {
                            tokenType = MustacheTokenType.InvertedSection;
                            tokenValue = variable;
                        }

                        if (operator1 == "/") {
                            tokenType = MustacheTokenType.SectionEnd;
                            tokenValue = variable;
                        }

                        if (operator1 == null) {
                            tokenType = closingBracket == "}}" ? MustacheTokenType.Variable : MustacheTokenType.EscapedVariable;
                            tokenValue = variable;
                        }

                        if (tokenType == MustacheTokenType.Unknown) {
                            throw new MustacheException(null, MustacheErrorCode.Internal, "Internal error", token.line, token.column);
                        }

                        operator1 = null;
                        operator2 = null;
                        variable = null;
                        state = MustacheLexicalState.Value;
                    }
                    break;
                case TokenType.Word:
                    if (state == MustacheLexicalState.Operator1) {
                        state = MustacheLexicalState.Variable;
                    }
                    if (state == MustacheLexicalState.Operator2 && (token.value == "if" || token.value == "unless")) {
                        operator2 = token.value;
                        state = MustacheLexicalState.Variable;
                        continue;
                    }
                    if (state == MustacheLexicalState.Operator2) {
                        state = MustacheLexicalState.Variable;
                    }
                    if (state == MustacheLexicalState.Variable) {
                        variable = token.value;
                        state = MustacheLexicalState.Closure;
                        continue;
                    }
                    break;
                case TokenType.Whitespace:
                    continue;
            }
            if (tokenType == MustacheTokenType.Unknown) {
                throw new MustacheException(null, MustacheErrorCode.UnexpectedSymbol, "Unexpected symbol '" + token.value + "'", token.line, token.column);
            }
            this._initialTokens.push(new MustacheToken(tokenType, tokenValue, token.line, token.column));
        }

        if (state != MustacheLexicalState.Value) {
            throw new MustacheException(null, MustacheErrorCode.UnexpectedEnd, "Unexpected end of file", 0, 0);
        }
    }

    /**
     * Performs a syntax analysis at level 0.
     */
    private performSyntaxAnalysis(): void {
        this.checkForMoreTokens();
        while (this.hasMoreTokens()) {
            const token = this.getCurrentToken();
            this.moveToNextToken();

            if (token.type == MustacheTokenType.SectionEnd) {
                throw new MustacheException(null, MustacheErrorCode.UnexpectedSectionEnd, "Unexpected section end for variable '" + token.value + "'", token.line, token.column);
            }

            const result = this.addTokenToResult(token.type, token.value, token.line, token.column);

            if (token.type == MustacheTokenType.Section || token.type == MustacheTokenType.InvertedSection) {
                result.tokens.push(...this.performSyntaxAnalysisForSection(token.value));
            }
        }
    }

    /**
     * Performs a syntax analysis for section
     */
    private performSyntaxAnalysisForSection(variable: string): MustacheToken[] {
        const result: MustacheToken[] = [];

        this.checkForMoreTokens();
        while (this.hasMoreTokens()) {
            const token = this.getCurrentToken();
            this.moveToNextToken();

            if (token.type == MustacheTokenType.SectionEnd && (token.value == variable || token.value == null)) {
                return result;
            }
            
            if (token.type == MustacheTokenType.SectionEnd) {
                throw new MustacheException(null, MustacheErrorCode.UnexpectedSectionEnd, "Unexpected section end for variable '" + variable + "'", token.line, token.column);
            }

            const resultToken = new MustacheToken(token.type, token.value, token.line, token.column);

            if (token.type == MustacheTokenType.Section || token.type == MustacheTokenType.InvertedSection) {
                resultToken.tokens.push(...this.performSyntaxAnalysisForSection(token.value));
            }

            result.push(resultToken);
        }

        const token = this.getCurrentToken();
        throw new MustacheException(null, MustacheErrorCode.NotClosedSection, "Not closed section for variable '" + variable + "'", token.line, token.column);
    }

    /**
     * Retrieves variables from the parsed output.
     */
    private lookupVariables() {
        if (this._originalTokens == null) return;

        this._variableNames = [];
        for (const token of this._initialTokens) {
            if (token.type != MustacheTokenType.Value
                && token.type != MustacheTokenType.Comment
                && token.value != null) {
                const variableName = token.value.toLowerCase();
                const found = this._variableNames.some((v) => v.toLowerCase() == variableName);
                if (!found) {
                    this._variableNames.push(token.value);
                }
            }
        }
    }

}