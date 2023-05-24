import { Token } from "../../tokenizers/Token";
import { ExpressionToken } from "./ExpressionToken";
/**
 * Implements an expression parser class.
 */
export declare class ExpressionParser {
    /**
     *  Defines a list of operators.
     */
    private Operators;
    /**
     * Defines a list of operator token types.
     * Note: it must match to operators.
     */
    private OperatorTypes;
    private _tokenizer;
    private _expression;
    private _originalTokens;
    private _initialTokens;
    private _currentTokenIndex;
    private _variableNames;
    private _resultTokens;
    /**
     * The expression string.
     */
    get expression(): string;
    /**
     * The expression string.
     */
    set expression(value: string);
    get originalTokens(): Token[];
    set originalTokens(value: Token[]);
    /**
     * The list of original expression tokens.
     */
    get initialTokens(): ExpressionToken[];
    /**
     * The list of parsed expression tokens.
     */
    get resultTokens(): ExpressionToken[];
    /**
     * The list of found variable names.
     */
    get variableNames(): string[];
    /**
     * Sets a new expression string and parses it into internal byte code.
     * @param expression A new expression string.
     */
    parseString(expression: string): void;
    parseTokens(tokens: Token[]): void;
    /**
     * Clears parsing results.
     */
    clear(): void;
    /**
     * Checks are there more tokens for processing.
     * @returns <code>true</code> if some tokens are present.
     */
    private hasMoreTokens;
    /**
     * Checks are there more tokens available and throws exception if no more tokens available.
     */
    private checkForMoreTokens;
    /**
     * Gets the current token object.
     * @returns The current token object.
     */
    private getCurrentToken;
    /**
     * Gets the next token object.
     * @returns The next token object.
     */
    private getNextToken;
    /**
     * Moves to the next token object.
     */
    private moveToNextToken;
    /**
     * Adds an expression to the result list
     * @param type The type of the token to be added.
     * @param value The value of the token to be added.
     * @param line The line number where the token is.
     * @param column The column number where the token is.
     */
    private addTokenToResult;
    /**
     * Matches available tokens types with types from the list.
     * If tokens matchs then shift the list.
     * @param types A list of token types to compare.
     * <code>true</code> if token types match.
     */
    private matchTokensWithTypes;
    private tokenizeExpression;
    private composeExpression;
    private performParsing;
    /**
     * Tokenizes the given expression and prepares an initial tokens list.
     */
    private completeLexicalAnalysis;
    /**
     * Performs a syntax analysis at level 0.
     */
    private performSyntaxAnalysis;
    /**
     * Performs a syntax analysis at level 1.
     */
    private performSyntaxAnalysisAtLevel1;
    /**
     * Performs a syntax analysis at level 2.
     */
    private performSyntaxAnalysisAtLevel2;
    /**
     * Performs a syntax analysis at level 3.
     */
    private performSyntaxAnalysisAtLevel3;
    /**
     * Performs a syntax analysis at level 4.
     */
    private performSyntaxAnalysisAtLevel4;
    /**
     * Performs a syntax analysis at level 5.
     */
    private performSyntaxAnalysisAtLevel5;
    /**
     * Performs a syntax analysis at level 6.
     */
    private performSyntaxAnalysisAtLevel6;
}
