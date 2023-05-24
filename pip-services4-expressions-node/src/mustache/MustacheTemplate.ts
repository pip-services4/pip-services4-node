/** @module mustache */
import { MustacheParser } from "./parsers/MustacheParser";
import { MustacheToken } from "./parsers/MustacheToken";
import { MustacheTokenType } from "./parsers/MustacheTokenType";
import { Token } from "../tokenizers/Token";
import { MustacheException } from "./MustacheException";

/**
 * Implements an mustache template class.
 */
export class MustacheTemplate {
    private _defaultVariables: any = {};
    private _parser: MustacheParser = new MustacheParser();
    private _autoVariables: boolean = true;

    /**
     * Constructs this class and assigns mustache template.
     * @param template The mustache template.
     */
    public constructor(template?: string) {
        if (template != null) {
            this.template = template;
        }
    }

    /**
     * The mustache template.
     */
    public get template(): string {
        return this._parser.template;
    }

    /**
     * The mustache template.
     */
    public set template(value: string) {
        this._parser.template = value;
        if (this._autoVariables) {
            this.createVariables(this._defaultVariables);
        }
    }

    public get originalTokens(): Token[] {
        return this._parser.originalTokens;
    }

    public set originalTokens(value: Token[]) {
        this._parser.originalTokens = value;
        if (this._autoVariables) {
            this.createVariables(this._defaultVariables);
        }
    }

    /**
     * Gets the flag to turn on auto creation of variables for specified mustache.
     */
    public get autoVariables(): boolean {
        return this._autoVariables;
    }

    /**
     * Sets the flag to turn on auto creation of variables for specified mustache.
     */
    public set autoVariables(value: boolean) {
        this._autoVariables = value;
    }

    /**
     * The list with default variables.
     */
    public get defaultVariables(): any {
        return this._defaultVariables;
    }

    /**
     * The list of original mustache tokens.
     */
    public get initialTokens(): MustacheToken[] {
        return this._parser.initialTokens;
    }

    /**
     * The list of processed mustache tokens.
     */
    public get resultTokens(): MustacheToken[] {
        return this._parser.resultTokens;
    }

    /**
     * Gets a variable value from the collection of variables
     * @param variables a collection of variables.
     * @param name a variable name to get.
     * @returns a variable value or <code>undefined</code>
     */
    public getVariable(variables: any, name: string): any {
        if (variables == null || name == null) return undefined;

        name = name.toLowerCase();
        let result = undefined;

        for (let propName in variables) {
            if (propName.toLowerCase() == name) {
                result = result || variables[propName];
            }
        }

        return result;
    }

    /**
     * Populates the specified variables list with variables from parsed mustache.
     * @param variables The list of variables to be populated.
     */
    public createVariables(variables: any): void {
        if (variables == null) return;

        for (let variableName of this._parser.variableNames) {
            let found = this.getVariable(variables, variableName) != undefined;
            if (!found) {
                variables[variableName] = null;
            }
        }
    }

    /**
     * Cleans up this calculator from all data.
     */
    public clear(): void {
        this._parser.clear();
        this._defaultVariables = {};
    }

    /**
     * Evaluates this mustache template using default variables.
     * @returns the evaluated template
     */
    public evaluate(): string {
        return this.evaluateWithVariables(null);
    }

    /**
     * Evaluates this mustache using specified variables.
     * @param variables The collection of variables
     * @returns the evaluated template
     */
    public evaluateWithVariables(variables: any): string {
        variables = variables || this._defaultVariables;

        return this.evaluateTokens(this._parser.resultTokens, variables);
    }

    private isDefinedVariable(variables: any, name: string): boolean {
        let value = this.getVariable(variables, name);
        return value != null && value != "";
    }

    private escapeString(value: string): string {
        if (value == null) return null;

        return value
            .replace(/[\\]/g, '\\\\')
            .replace(/[\"]/g, '\\\"')
            .replace(/[/]/g, '\/')
            .replace(/[\b]/g, '\\b')
            .replace(/[\f]/g, '\\f')
            .replace(/[\n]/g, '\\n')
            .replace(/[\r]/g, '\\r')
            .replace(/[\t]/g, '\\t');
    }

    private evaluateTokens(tokens: MustacheToken[], variables: any): string {
        if (tokens == null) return null;

        let result = "";

        for (let token of tokens) {
            switch (token.type) {
                case MustacheTokenType.Comment:
                    // Skip;
                    break;
                case MustacheTokenType.Value:
                    result += token.value || "";
                    break;
                case MustacheTokenType.Variable:
                    let value1 = this.getVariable(variables, token.value);
                    result += value1 || "";
                    break;
                case MustacheTokenType.EscapedVariable:
                    let value2 = this.getVariable(variables, token.value);
                    value2 = this.escapeString(value2);
                    result += value2 || "";
                    break;
                case MustacheTokenType.Section:
                    let defined1 = this.isDefinedVariable(variables, token.value);
                    if (defined1 && token.tokens != null) {
                        result += this.evaluateTokens(token.tokens, variables);
                    }
                    break;
                case MustacheTokenType.InvertedSection:
                    let defined2 = this.isDefinedVariable(variables, token.value);
                    if (!defined2 && token.tokens != null) {
                        result += this.evaluateTokens(token.tokens, variables);
                    }
                    break;
                case MustacheTokenType.Partial:
                    throw new MustacheException(null, "PARTIALS_NOT_SUPPORTED", "Partials are not supported", token.line, token.column);
                default:
                    throw new MustacheException(null, "INTERNAL", "Internal error", token.line, token.column);
            }
        }

        return result;
    }

}