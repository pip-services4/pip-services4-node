"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionCalculator = void 0;
const VariableCollection_1 = require("./variables/VariableCollection");
const Variable_1 = require("./variables/Variable");
const DefaultFunctionCollection_1 = require("./functions/DefaultFunctionCollection");
const ExpressionParser_1 = require("./parsers/ExpressionParser");
const ExpressionTokenType_1 = require("./parsers/ExpressionTokenType");
const TypeUnsafeVariantOperations_1 = require("../variants/TypeUnsafeVariantOperations");
const Variant_1 = require("../variants/Variant");
const CalculationStack_1 = require("./CalculationStack");
const ExpressionException_1 = require("./ExpressionException");
/**
 * Implements an expression calculator class.
 */
class ExpressionCalculator {
    /**
     * Constructs this class and assigns expression string.
     * @param expression The expression string.
     */
    constructor(expression) {
        this._defaultVariables = new VariableCollection_1.VariableCollection();
        this._defaultFunctions = new DefaultFunctionCollection_1.DefaultFunctionCollection();
        this._variantOperations = new TypeUnsafeVariantOperations_1.TypeUnsafeVariantOperations();
        this._parser = new ExpressionParser_1.ExpressionParser();
        this._autoVariables = true;
        if (expression != null) {
            this.expression = expression;
        }
    }
    /**
     * The expression string.
     */
    get expression() {
        return this._parser.expression;
    }
    /**
     * The expression string.
     */
    set expression(value) {
        this._parser.expression = value;
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
     * Gets the flag to turn on auto creation of variables for specified expression.
     */
    get autoVariables() {
        return this._autoVariables;
    }
    /**
     * Sets the flag to turn on auto creation of variables for specified expression.
     */
    set autoVariables(value) {
        this._autoVariables = value;
    }
    /**
     * Gets the manager for operations on variant values.
     */
    get variantOperations() {
        return this._variantOperations;
    }
    /**
     * Sets the manager for operations on variant values.
     */
    set variantOperations(value) {
        this._variantOperations = value;
    }
    /**
     * The list with default variables.
     */
    get defaultVariables() {
        return this._defaultVariables;
    }
    /**
     * The list with default functions.
     */
    get defaultFunctions() {
        return this._defaultFunctions;
    }
    /**
     * The list of original expression tokens.
     */
    get initialTokens() {
        return this._parser.initialTokens;
    }
    /**
     * The list of processed expression tokens.
     */
    get resultTokens() {
        return this._parser.resultTokens;
    }
    /**
     * Populates the specified variables list with variables from parsed expression.
     * @param variables The list of variables to be populated.
     */
    createVariables(variables) {
        for (let variableName of this._parser.variableNames) {
            if (variables.findByName(variableName) == null) {
                variables.add(new Variable_1.Variable(variableName));
            }
        }
    }
    /**
     * Cleans up this calculator from all data.
     */
    clear() {
        this._parser.clear();
        this._defaultVariables.clear();
    }
    /**
     * Evaluates this expression using default variables and functions.
     * @returns the evaluation result.
     */
    evaluate() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.evaluateWithVariablesAndFunctions(null, null);
        });
    }
    /**
     * Evaluates this expression using specified variables.
     * @param variables The list of variables
     * @returns the evaluation result
     */
    evaluateWithVariables(variables) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.evaluateWithVariablesAndFunctions(variables, null);
        });
    }
    /**
     * Evaluates this expression using specified variables and functions.
     * @param variables The list of variables
     * @param functions The list of functions
     * @returns the evaluation result
     */
    evaluateWithVariablesAndFunctions(variables, functions) {
        return __awaiter(this, void 0, void 0, function* () {
            let stack = new CalculationStack_1.CalculationStack();
            variables = variables || this._defaultVariables;
            functions = functions || this._defaultFunctions;
            for (let token of this.resultTokens) {
                if (yield this.evaluateConstant(token, stack)) {
                    continue;
                }
                if (yield this.evaluateVariable(token, stack, variables)) {
                    continue;
                }
                if (yield this.evaluateFunction(token, stack, functions)) {
                    continue;
                }
                if (yield this.evaluateLogical(token, stack)) {
                    continue;
                }
                if (yield this.evaluateArithmetical(token, stack)) {
                    continue;
                }
                if (yield this.evaluateBoolean(token, stack)) {
                    continue;
                }
                if (yield this.evaluateOther(token, stack)) {
                    continue;
                }
                throw new ExpressionException_1.ExpressionException(null, "INTERNAL", "Internal error", token.line, token.column);
            }
            if (stack.length != 1) {
                throw new ExpressionException_1.ExpressionException(null, "INTERNAL", "Internal error", 0, 0);
            }
            return stack.pop();
        });
    }
    evaluateConstant(token, stack) {
        return __awaiter(this, void 0, void 0, function* () {
            if (token.type != ExpressionTokenType_1.ExpressionTokenType.Constant) {
                return false;
            }
            stack.push(token.value);
            return true;
        });
    }
    evaluateVariable(token, stack, variables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (token.type != ExpressionTokenType_1.ExpressionTokenType.Variable) {
                return false;
            }
            let variable = variables.findByName(token.value.asString);
            if (variable == null) {
                throw new ExpressionException_1.ExpressionException(null, "VAR_NOT_FOUND", "Variable " + token.value.asString + " was not found", token.line, token.column);
            }
            stack.push(variable.value);
            return true;
        });
    }
    evaluateFunction(token, stack, functions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (token.type != ExpressionTokenType_1.ExpressionTokenType.Function) {
                return false;
            }
            let func = functions.findByName(token.value.asString);
            if (func == null) {
                throw new ExpressionException_1.ExpressionException(null, "FUNC_NOT_FOUND", "Function " + token.value.asString + " was not found", token.line, token.column);
            }
            // Retrieve function parameters
            let params = [];
            let paramCount = stack.pop().asInteger;
            while (paramCount > 0) {
                params.splice(0, 0, stack.pop());
                paramCount--;
            }
            let functionResult = yield func.calculate(params, this._variantOperations);
            stack.push(functionResult);
            return true;
        });
    }
    evaluateLogical(token, stack) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (token.type) {
                case ExpressionTokenType_1.ExpressionTokenType.And:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.and(value1, value2));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.Or:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.or(value1, value2));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.Xor:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.xor(value1, value2));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.Not:
                    {
                        stack.push(this._variantOperations.not(stack.pop()));
                        return true;
                    }
                default:
                    return false;
            }
        });
    }
    evaluateArithmetical(token, stack) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (token.type) {
                case ExpressionTokenType_1.ExpressionTokenType.Plus:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.add(value1, value2));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.Minus:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.sub(value1, value2));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.Star:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.mul(value1, value2));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.Slash:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.div(value1, value2));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.Procent:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.mod(value1, value2));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.Power:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.pow(value1, value2));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.Unary:
                    {
                        stack.push(this._variantOperations.negative(stack.pop()));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.ShiftLeft:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.lsh(value1, value2));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.ShiftRight:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.rsh(value1, value2));
                        return true;
                    }
                default:
                    return false;
            }
        });
    }
    evaluateBoolean(token, stack) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (token.type) {
                case ExpressionTokenType_1.ExpressionTokenType.Equal:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.equal(value1, value2));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.NotEqual:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.notEqual(value1, value2));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.More:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.more(value1, value2));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.Less:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.less(value1, value2));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.EqualMore:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.moreEqual(value1, value2));
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.EqualLess:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        stack.push(this._variantOperations.lessEqual(value1, value2));
                        return true;
                    }
                default:
                    return false;
            }
        });
    }
    evaluateOther(token, stack) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (token.type) {
                case ExpressionTokenType_1.ExpressionTokenType.In:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        let rvalue = this._variantOperations.in(value2, value1);
                        stack.push(rvalue);
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.NotIn:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        let rvalue = this._variantOperations.in(value2, value1);
                        rvalue = Variant_1.Variant.fromBoolean(!rvalue.asBoolean);
                        stack.push(rvalue);
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.Element:
                    {
                        let value2 = stack.pop();
                        let value1 = stack.pop();
                        let rvalue = this._variantOperations.getElement(value1, value2);
                        stack.push(rvalue);
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.IsNull:
                    {
                        let rvalue = new Variant_1.Variant(stack.pop().isNull());
                        stack.push(rvalue);
                        return true;
                    }
                case ExpressionTokenType_1.ExpressionTokenType.IsNotNull:
                    {
                        let rvalue = new Variant_1.Variant(!stack.pop().isNull());
                        stack.push(rvalue);
                        return true;
                    }
                default:
                    return false;
            }
        });
    }
}
exports.ExpressionCalculator = ExpressionCalculator;
//# sourceMappingURL=ExpressionCalculator.js.map