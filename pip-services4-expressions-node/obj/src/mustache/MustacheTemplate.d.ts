import { MustacheToken } from "./parsers/MustacheToken";
import { Token } from "../tokenizers/Token";
/**
 * Implements an mustache template class.
 */
export declare class MustacheTemplate {
    private _defaultVariables;
    private _parser;
    private _autoVariables;
    /**
     * Constructs this class and assigns mustache template.
     * @param template The mustache template.
     */
    constructor(template?: string);
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
     * Gets the flag to turn on auto creation of variables for specified mustache.
     */
    get autoVariables(): boolean;
    /**
     * Sets the flag to turn on auto creation of variables for specified mustache.
     */
    set autoVariables(value: boolean);
    /**
     * The list with default variables.
     */
    get defaultVariables(): any;
    /**
     * The list of original mustache tokens.
     */
    get initialTokens(): MustacheToken[];
    /**
     * The list of processed mustache tokens.
     */
    get resultTokens(): MustacheToken[];
    /**
     * Gets a variable value from the collection of variables
     * @param variables a collection of variables.
     * @param name a variable name to get.
     * @returns a variable value or <code>undefined</code>
     */
    getVariable(variables: any, name: string): any;
    /**
     * Populates the specified variables list with variables from parsed mustache.
     * @param variables The list of variables to be populated.
     */
    createVariables(variables: any): void;
    /**
     * Cleans up this calculator from all data.
     */
    clear(): void;
    /**
     * Evaluates this mustache template using default variables.
     * @returns the evaluated template
     */
    evaluate(): string;
    /**
     * Evaluates this mustache using specified variables.
     * @param variables The collection of variables
     * @returns the evaluated template
     */
    evaluateWithVariables(variables: any): string;
    private isDefinedVariable;
    private escapeString;
    private evaluateTokens;
}
