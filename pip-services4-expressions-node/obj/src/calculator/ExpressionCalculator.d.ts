/** @module calculator */
import { IVariableCollection } from "./variables/IVariableCollection";
import { IFunctionCollection } from "./functions/IFunctionCollection";
import { ExpressionToken } from "./parsers/ExpressionToken";
import { IVariantOperations } from "../variants/IVariantOperations";
import { Token } from "../tokenizers/Token";
import { Variant } from "../variants/Variant";
/**
 * Implements an expression calculator class.
 */
export declare class ExpressionCalculator {
    private _defaultVariables;
    private _defaultFunctions;
    private _variantOperations;
    private _parser;
    private _autoVariables;
    /**
     * Constructs this class and assigns expression string.
     * @param expression The expression string.
     */
    constructor(expression?: string);
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
     * Gets the flag to turn on auto creation of variables for specified expression.
     */
    get autoVariables(): boolean;
    /**
     * Sets the flag to turn on auto creation of variables for specified expression.
     */
    set autoVariables(value: boolean);
    /**
     * Gets the manager for operations on variant values.
     */
    get variantOperations(): IVariantOperations;
    /**
     * Sets the manager for operations on variant values.
     */
    set variantOperations(value: IVariantOperations);
    /**
     * The list with default variables.
     */
    get defaultVariables(): IVariableCollection;
    /**
     * The list with default functions.
     */
    get defaultFunctions(): IFunctionCollection;
    /**
     * The list of original expression tokens.
     */
    get initialTokens(): ExpressionToken[];
    /**
     * The list of processed expression tokens.
     */
    get resultTokens(): ExpressionToken[];
    /**
     * Populates the specified variables list with variables from parsed expression.
     * @param variables The list of variables to be populated.
     */
    createVariables(variables: IVariableCollection): void;
    /**
     * Cleans up this calculator from all data.
     */
    clear(): void;
    /**
     * Evaluates this expression using default variables and functions.
     * @returns the evaluation result.
     */
    evaluate(): Promise<Variant>;
    /**
     * Evaluates this expression using specified variables.
     * @param variables The list of variables
     * @returns the evaluation result
     */
    evaluateWithVariables(variables: IVariableCollection): Promise<Variant>;
    /**
     * Evaluates this expression using specified variables and functions.
     * @param variables The list of variables
     * @param functions The list of functions
     * @returns the evaluation result
     */
    evaluateWithVariablesAndFunctions(variables: IVariableCollection, functions: IFunctionCollection): Promise<Variant>;
    private evaluateConstant;
    private evaluateVariable;
    private evaluateFunction;
    private evaluateLogical;
    private evaluateArithmetical;
    private evaluateBoolean;
    private evaluateOther;
}
