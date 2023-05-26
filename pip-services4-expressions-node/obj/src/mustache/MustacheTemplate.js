"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MustacheTemplate = void 0;
/** @module mustache */
const MustacheParser_1 = require("./parsers/MustacheParser");
const MustacheTokenType_1 = require("./parsers/MustacheTokenType");
const MustacheException_1 = require("./MustacheException");
/**
 * Implements an mustache template class.
 */
class MustacheTemplate {
    /**
     * Constructs this class and assigns mustache template.
     * @param template The mustache template.
     */
    constructor(template) {
        this._defaultVariables = {};
        this._parser = new MustacheParser_1.MustacheParser();
        this._autoVariables = true;
        if (template != null) {
            this.template = template;
        }
    }
    /**
     * The mustache template.
     */
    get template() {
        return this._parser.template;
    }
    /**
     * The mustache template.
     */
    set template(value) {
        this._parser.template = value;
        if (this._autoVariables) {
            this.createVariables(this._defaultVariables);
        }
    }
    get originalTokens() {
        return this._parser.originalTokens;
    }
    set originalTokens(value) {
        this._parser.originalTokens = value;
        if (this._autoVariables) {
            this.createVariables(this._defaultVariables);
        }
    }
    /**
     * Gets the flag to turn on auto creation of variables for specified mustache.
     */
    get autoVariables() {
        return this._autoVariables;
    }
    /**
     * Sets the flag to turn on auto creation of variables for specified mustache.
     */
    set autoVariables(value) {
        this._autoVariables = value;
    }
    /**
     * The list with default variables.
     */
    get defaultVariables() {
        return this._defaultVariables;
    }
    /**
     * The list of original mustache tokens.
     */
    get initialTokens() {
        return this._parser.initialTokens;
    }
    /**
     * The list of processed mustache tokens.
     */
    get resultTokens() {
        return this._parser.resultTokens;
    }
    /**
     * Gets a variable value from the collection of variables
     * @param variables a collection of variables.
     * @param name a variable name to get.
     * @returns a variable value or <code>undefined</code>
     */
    getVariable(variables, name) {
        if (variables == null || name == null)
            return undefined;
        name = name.toLowerCase();
        let result = undefined;
        for (const propName in variables) {
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
    createVariables(variables) {
        if (variables == null)
            return;
        for (const variableName of this._parser.variableNames) {
            const found = this.getVariable(variables, variableName) != undefined;
            if (!found) {
                variables[variableName] = null;
            }
        }
    }
    /**
     * Cleans up this calculator from all data.
     */
    clear() {
        this._parser.clear();
        this._defaultVariables = {};
    }
    /**
     * Evaluates this mustache template using default variables.
     * @returns the evaluated template
     */
    evaluate() {
        return this.evaluateWithVariables(null);
    }
    /**
     * Evaluates this mustache using specified variables.
     * @param variables The collection of variables
     * @returns the evaluated template
     */
    evaluateWithVariables(variables) {
        variables = variables || this._defaultVariables;
        return this.evaluateTokens(this._parser.resultTokens, variables);
    }
    isDefinedVariable(variables, name) {
        const value = this.getVariable(variables, name);
        return value != null && value != "";
    }
    escapeString(value) {
        if (value == null)
            return null;
        return value
            .replace(/[\\]/g, '\\\\')
            .replace(/["]/g, '\\"')
            .replace(/[/]/g, '/')
            .replace(/[\b]/g, '\\b')
            .replace(/[\f]/g, '\\f')
            .replace(/[\n]/g, '\\n')
            .replace(/[\r]/g, '\\r')
            .replace(/[\t]/g, '\\t');
    }
    evaluateTokens(tokens, variables) {
        if (tokens == null)
            return null;
        let result = "";
        for (const token of tokens) {
            switch (token.type) {
                case MustacheTokenType_1.MustacheTokenType.Comment:
                    // Skip;
                    break;
                case MustacheTokenType_1.MustacheTokenType.Value: {
                    result += token.value || "";
                    break;
                }
                case MustacheTokenType_1.MustacheTokenType.Variable: {
                    const value1 = this.getVariable(variables, token.value);
                    result += value1 || "";
                    break;
                }
                case MustacheTokenType_1.MustacheTokenType.EscapedVariable: {
                    let value2 = this.getVariable(variables, token.value);
                    value2 = this.escapeString(value2);
                    result += value2 || "";
                    break;
                }
                case MustacheTokenType_1.MustacheTokenType.Section: {
                    const defined1 = this.isDefinedVariable(variables, token.value);
                    if (defined1 && token.tokens != null) {
                        result += this.evaluateTokens(token.tokens, variables);
                    }
                    break;
                }
                case MustacheTokenType_1.MustacheTokenType.InvertedSection: {
                    const defined2 = this.isDefinedVariable(variables, token.value);
                    if (!defined2 && token.tokens != null) {
                        result += this.evaluateTokens(token.tokens, variables);
                    }
                    break;
                }
                case MustacheTokenType_1.MustacheTokenType.Partial:
                    throw new MustacheException_1.MustacheException(null, "PARTIALS_NOT_SUPPORTED", "Partials are not supported", token.line, token.column);
                default:
                    throw new MustacheException_1.MustacheException(null, "INTERNAL", "Internal error", token.line, token.column);
            }
        }
        return result;
    }
}
exports.MustacheTemplate = MustacheTemplate;
//# sourceMappingURL=MustacheTemplate.js.map