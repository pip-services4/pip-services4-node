/** @module calculator */
import { IVariableCollection } from "./variables/IVariableCollection";
import { VariableCollection } from "./variables/VariableCollection";
import { Variable } from "./variables/Variable";
import { IFunctionCollection } from "./functions/IFunctionCollection";
import { DefaultFunctionCollection } from "./functions/DefaultFunctionCollection";
import { ExpressionParser } from "./parsers/ExpressionParser";
import { ExpressionToken } from "./parsers/ExpressionToken";
import { ExpressionTokenType } from "./parsers/ExpressionTokenType";
import { IVariantOperations } from "../variants/IVariantOperations";
import { TypeUnsafeVariantOperations } from "../variants/TypeUnsafeVariantOperations";
import { Token } from "../tokenizers/Token";
import { Variant } from "../variants/Variant";
import { CalculationStack } from "./CalculationStack";
import { ExpressionException } from "./ExpressionException";

/**
 * Implements an expression calculator class.
 */
export class ExpressionCalculator {
    private _defaultVariables: IVariableCollection = new VariableCollection();
    private _defaultFunctions: IFunctionCollection = new DefaultFunctionCollection();
    private _variantOperations: IVariantOperations = new TypeUnsafeVariantOperations();
    private _parser: ExpressionParser = new ExpressionParser();
    private _autoVariables = true;

    /**
     * Constructs this class and assigns expression string.
     * @param expression The expression string.
     */
    public constructor(expression?: string) {
        if (expression != null) {
            this.expression = expression;
        }
    }

    /**
     * The expression string.
     */
    public get expression(): string {
        return this._parser.expression;
    }

    /**
     * The expression string.
     */
    public set expression(value: string) {
        this._parser.expression = value;
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
     * Gets the flag to turn on auto creation of variables for specified expression.
     */
    public get autoVariables(): boolean {
        return this._autoVariables;
    }

    /**
     * Sets the flag to turn on auto creation of variables for specified expression.
     */
    public set autoVariables(value: boolean) {
        this._autoVariables = value;
    }

    /**
     * Gets the manager for operations on variant values.
     */
    public get variantOperations(): IVariantOperations {
        return this._variantOperations;
    }

    /**
     * Sets the manager for operations on variant values.
     */
    public set variantOperations(value: IVariantOperations) {
        this._variantOperations = value;
    }

    /**
     * The list with default variables.
     */
    public get defaultVariables(): IVariableCollection {
        return this._defaultVariables;
    }

    /**
     * The list with default functions.
     */
    public get defaultFunctions(): IFunctionCollection {
        return this._defaultFunctions;
    }

    /**
     * The list of original expression tokens.
     */
    public get initialTokens(): ExpressionToken[] {
        return this._parser.initialTokens;
    }

    /**
     * The list of processed expression tokens.
     */
    public get resultTokens(): ExpressionToken[] {
        return this._parser.resultTokens;
    }

    /**
     * Populates the specified variables list with variables from parsed expression.
     * @param variables The list of variables to be populated.
     */
    public createVariables(variables: IVariableCollection): void {
        for (const variableName of this._parser.variableNames) {
            if (variables.findByName(variableName) == null) {
                variables.add(new Variable(variableName));
            }
        }
    }

    /**
     * Cleans up this calculator from all data.
     */
    public clear(): void {
        this._parser.clear();
        this._defaultVariables.clear();
    }

    /**
     * Evaluates this expression using default variables and functions.
     * @returns the evaluation result.
     */
    public async evaluate(): Promise<Variant> {
        return await this.evaluateWithVariablesAndFunctions(null, null);
    }

    /**
     * Evaluates this expression using specified variables.
     * @param variables The list of variables
     * @returns the evaluation result
     */
    public async evaluateWithVariables(variables: IVariableCollection): Promise<Variant> {
        return await this.evaluateWithVariablesAndFunctions(variables, null);
    }

    /**
     * Evaluates this expression using specified variables and functions.
     * @param variables The list of variables
     * @param functions The list of functions
     * @returns the evaluation result
     */
    public async evaluateWithVariablesAndFunctions(variables: IVariableCollection, functions: IFunctionCollection): Promise<Variant> {
        const stack = new CalculationStack();
        variables = variables || this._defaultVariables;
        functions = functions || this._defaultFunctions;

        for (const token of this.resultTokens) {
            if (await this.evaluateConstant(token, stack)) {
                continue;
            }
            if (await this.evaluateVariable(token, stack, variables)) {
                continue;
            }
            if (await this.evaluateFunction(token, stack, functions)) {
                continue;
            }
            if (await this.evaluateLogical(token, stack)) {
                continue;
            }
            if (await this.evaluateArithmetical(token, stack)) {
                continue;
            }
            if (await this.evaluateBoolean(token, stack)) {
                continue;
            }
            if (await this.evaluateOther(token, stack)) {
                continue;
            } 
            throw new ExpressionException(null, "INTERNAL", "Internal error", token.line, token.column);
        }

        if (stack.length != 1) {
            throw new ExpressionException(null, "INTERNAL", "Internal error", 0, 0);
        }

        return stack.pop();
    }

    private async evaluateConstant(token: ExpressionToken, stack: CalculationStack): Promise<boolean> {
        if (token.type != ExpressionTokenType.Constant) {
            return false;
        }

        stack.push(token.value);
        return true;
    }

    private async evaluateVariable(token: ExpressionToken, stack: CalculationStack,
        variables: IVariableCollection): Promise<boolean> {

        if (token.type != ExpressionTokenType.Variable) {
            return false;
        }

        const variable = variables.findByName(token.value.asString);
        if (variable == null) {
            throw new ExpressionException(
                null,
                "VAR_NOT_FOUND",
                "Variable " + token.value.asString + " was not found",
                token.line, token.column
            );
        }

        stack.push(variable.value);
        return true;
    }

    private async evaluateFunction(token: ExpressionToken, stack: CalculationStack,
        functions: IFunctionCollection): Promise<boolean> {

        if (token.type != ExpressionTokenType.Function) {
            return false;
        }

        const func = functions.findByName(token.value.asString);
        if (func == null) {
            throw new ExpressionException(
                null,
                "FUNC_NOT_FOUND",
                "Function " + token.value.asString + " was not found",
                token.line, token.column
            );
        }

        // Retrieve function parameters
        const params: Variant[] = [];
        let paramCount = stack.pop().asInteger;
        while (paramCount > 0) {
            params.splice(0, 0, stack.pop());
            paramCount--;
        }

        const functionResult = await func.calculate(params, this._variantOperations);
        stack.push(functionResult);
        return true;
    }

    private async evaluateLogical(token: ExpressionToken, stack: CalculationStack): Promise<boolean> {
        switch (token.type) {
            case ExpressionTokenType.And:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.and(value1, value2));
                    return true;
                }
            case ExpressionTokenType.Or:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.or(value1, value2));
                    return true;
                }
            case ExpressionTokenType.Xor:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.xor(value1, value2));
                    return true;
                }
            case ExpressionTokenType.Not:
                {
                    stack.push(this._variantOperations.not(stack.pop()));
                    return true;
                }
            default:
                return false;
        }
    }

    private async evaluateArithmetical(token: ExpressionToken, stack: CalculationStack): Promise<boolean>  {
        switch (token.type) {
            case ExpressionTokenType.Plus:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.add(value1, value2));
                    return true;
                }
            case ExpressionTokenType.Minus:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.sub(value1, value2));
                    return true;
                }
            case ExpressionTokenType.Star:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.mul(value1, value2));
                    return true;
                }
            case ExpressionTokenType.Slash:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.div(value1, value2));
                    return true;
                }
            case ExpressionTokenType.Procent:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.mod(value1, value2));
                    return true;
                }
            case ExpressionTokenType.Power:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.pow(value1, value2));
                    return true;
                }
            case ExpressionTokenType.Unary:
                {
                    stack.push(this._variantOperations.negative(stack.pop()));
                    return true;
                }
            case ExpressionTokenType.ShiftLeft:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.lsh(value1, value2));
                    return true;
                }
            case ExpressionTokenType.ShiftRight:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.rsh(value1, value2));
                    return true;
                }
            default:
                return false;
        }
    }

    private async evaluateBoolean(token: ExpressionToken, stack: CalculationStack): Promise<boolean> {
        switch (token.type) {
            case ExpressionTokenType.Equal:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.equal(value1, value2));
                    return true;
                }
            case ExpressionTokenType.NotEqual:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.notEqual(value1, value2));
                    return true;
                }
            case ExpressionTokenType.More:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.more(value1, value2));
                    return true;
                }
            case ExpressionTokenType.Less:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.less(value1, value2));
                    return true;
                }
            case ExpressionTokenType.EqualMore:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.moreEqual(value1, value2));
                    return true;
                }
            case ExpressionTokenType.EqualLess:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    stack.push(this._variantOperations.lessEqual(value1, value2));
                    return true;
                }
            default:
                return false;
        }
    }

    private async evaluateOther(token: ExpressionToken, stack: CalculationStack): Promise<boolean> {
        switch (token.type) {
            case ExpressionTokenType.In:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    const rvalue = this._variantOperations.in(value2, value1);
                    stack.push(rvalue);
                    return true;
                }
            case ExpressionTokenType.NotIn:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    let rvalue = this._variantOperations.in(value2, value1)
                    rvalue = Variant.fromBoolean(!rvalue.asBoolean);
                    stack.push(rvalue);
                    return true;
                }
            case ExpressionTokenType.Element:
                {
                    const value2 = stack.pop();
                    const value1 = stack.pop();
                    const rvalue = this._variantOperations.getElement(value1, value2);
                    stack.push(rvalue);
                    return true;
                }
            case ExpressionTokenType.IsNull:
                {
                    const rvalue = new Variant(stack.pop().isNull());
                    stack.push(rvalue);
                    return true;
                }
            case ExpressionTokenType.IsNotNull:
                {
                    const rvalue = new Variant(!stack.pop().isNull());
                    stack.push(rvalue);
                    return true;
                }
            default:
                return false;
        }
    }

}