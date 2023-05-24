import { Token } from "../../tokenizers/Token";
import { MustacheToken } from "./MustacheToken";
/**
 * Implements an mustache parser class.
 */
export declare class MustacheParser {
    private _tokenizer;
    private _template;
    private _originalTokens;
    private _initialTokens;
    private _currentTokenIndex;
    private _variableNames;
    private _resultTokens;
    /**
     * The mustache template.
     */
    get template(): string;
    /**
     * The mustache template.
     */
    set template(value: string);
    get originalTokens(): Token[];
    set originalTokens(value: Token[]);
    /**
     * The list of original mustache tokens.
     */
    get initialTokens(): MustacheToken[];
    /**
     * The list of parsed mustache tokens.
     */
    get resultTokens(): MustacheToken[];
    /**
     * The list of found variable names.
     */
    get variableNames(): string[];
    /**
     * Sets a new mustache string and parses it into internal byte code.
     * @param mustache A new mustache string.
     */
    parseString(mustache: string): void;
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
     * Adds an mustache to the result list
     * @param type The type of the token to be added.
     * @param value The value of the token to be added.
     * @param line The line where the token is.
     * @param column The column number where the token is.
     */
    private addTokenToResult;
    private tokenizeMustache;
    private composeMustache;
    private performParsing;
    /**
     * Tokenizes the given mustache and prepares an initial tokens list.
     */
    private completeLexicalAnalysis;
    /**
     * Performs a syntax analysis at level 0.
     */
    private performSyntaxAnalysis;
    /**
     * Performs a syntax analysis for section
     */
    private performSyntaxAnalysisForSection;
    /**
     * Retrieves variables from the parsed output.
     */
    private lookupVariables;
}
