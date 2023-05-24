/** @module calculator */

import { FunctionCollection } from "./FunctionCollection";
import { DelegatedFunction } from "./DelegatedFunction";
import { Variant } from "../../variants/Variant";
import { VariantType } from "../../variants/VariantType";
import { IVariantOperations } from "../../variants/IVariantOperations";
import { ExpressionException } from "../ExpressionException";

/**
 * Implements a list filled with standard functions.
 */
export class DefaultFunctionCollection extends FunctionCollection {
    /**
     * Constructs this list and fills it with the standard functions.
     */
    public constructor() {
        super();

        this.add(new DelegatedFunction("Ticks", this.ticksFunctionCalculator, this));
        this.add(new DelegatedFunction("TimeSpan", this.timeSpanFunctionCalculator, this));
        this.add(new DelegatedFunction("Now", this.nowFunctionCalculator, this));
        this.add(new DelegatedFunction("Date", this.dateFunctionCalculator, this));
        this.add(new DelegatedFunction("DayOfWeek", this.dayOfWeekFunctionCalculator, this));
        this.add(new DelegatedFunction("Min", this.minFunctionCalculator, this));
        this.add(new DelegatedFunction("Max", this.maxFunctionCalculator, this));
        this.add(new DelegatedFunction("Sum", this.sumFunctionCalculator, this));
        this.add(new DelegatedFunction("If", this.ifFunctionCalculator, this));
        this.add(new DelegatedFunction("Choose", this.chooseFunctionCalculator, this));
        this.add(new DelegatedFunction("E", this.eFunctionCalculator, this));
        this.add(new DelegatedFunction("Pi", this.piFunctionCalculator, this));
        this.add(new DelegatedFunction("Rnd", this.rndFunctionCalculator, this));
        this.add(new DelegatedFunction("Random", this.rndFunctionCalculator, this));
        this.add(new DelegatedFunction("Abs", this.absFunctionCalculator, this));
        this.add(new DelegatedFunction("Acos", this.acosFunctionCalculator, this));
        this.add(new DelegatedFunction("Asin", this.asinFunctionCalculator, this));
        this.add(new DelegatedFunction("Atan", this.atanFunctionCalculator, this));
        this.add(new DelegatedFunction("Exp", this.expFunctionCalculator, this));
        this.add(new DelegatedFunction("Log", this.logFunctionCalculator, this));
        this.add(new DelegatedFunction("Ln", this.logFunctionCalculator, this));
        this.add(new DelegatedFunction("Log10", this.log10FunctionCalculator, this));
        this.add(new DelegatedFunction("Ceil", this.ceilFunctionCalculator, this));
        this.add(new DelegatedFunction("Ceiling", this.ceilFunctionCalculator, this));
        this.add(new DelegatedFunction("Floor", this.floorFunctionCalculator, this));
        this.add(new DelegatedFunction("Round", this.roundFunctionCalculator, this));
        this.add(new DelegatedFunction("Trunc", this.truncFunctionCalculator, this));
        this.add(new DelegatedFunction("Truncate", this.truncFunctionCalculator, this));
        this.add(new DelegatedFunction("Cos", this.cosFunctionCalculator, this));
        this.add(new DelegatedFunction("Sin", this.sinFunctionCalculator, this));
        this.add(new DelegatedFunction("Tan", this.tanFunctionCalculator, this));
        this.add(new DelegatedFunction("Sqr", this.sqrtFunctionCalculator, this));
        this.add(new DelegatedFunction("Sqrt", this.sqrtFunctionCalculator, this));
        this.add(new DelegatedFunction("Empty", this.emptyFunctionCalculator, this));
        this.add(new DelegatedFunction("Null", this.nullFunctionCalculator, this));
        this.add(new DelegatedFunction("Contains", this.containsFunctionCalculator, this));
        this.add(new DelegatedFunction("Array", this.arrayFunctionCalculator, this));
    }

    /**
     * Checks if params contains the correct number of function parameters (must be stored on the top of the params).
     * @param params A list of function parameters.
     * @param expectedParamCount The expected number of function parameters.
     */
    protected checkParamCount(params: Variant[], expectedParamCount: number): void {
        let paramCount = params.length;
        if (expectedParamCount != paramCount) {
            throw new ExpressionException(null, "WRONG_PARAM_COUNT",
                "Expected " + expectedParamCount
                + " parameters but was found " + paramCount);
        }
    }

    /**
     * Gets function parameter by it's index.
     * @param params A list of function parameters.
     * @param paramIndex Index for the function parameter (0 for the first parameter).
     * @returns Function parameter value.
     */
    protected getParameter(params: Variant[], paramIndex: number): Variant {
        return params[paramIndex];
    }

    private async ticksFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 0);
        return Variant.fromLong(new Date().getTime());
    }

    private async timeSpanFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        let paramCount = params.length;
        if (paramCount != 1 && paramCount != 3 && paramCount != 4 && paramCount != 5) {
            throw new ExpressionException(null, "WRONG_PARAM_COUNT", "Expected 1, 3, 4 or 5 parameters");
        }

        let result = new Variant();

        if (paramCount == 1) {
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Long);
            result.asTimeSpan = value.asLong;
        } else if (paramCount > 2) {
            let value1 = variantOperations.convert(this.getParameter(params, 0), VariantType.Long);
            let value2 = variantOperations.convert(this.getParameter(params, 1), VariantType.Long);
            let value3 = variantOperations.convert(this.getParameter(params, 2), VariantType.Long);
            let value4 = paramCount > 3 ? variantOperations.convert(this.getParameter(params, 3), VariantType.Long) : Variant.fromLong(0);
            let value5 = paramCount > 4 ? variantOperations.convert(this.getParameter(params, 4), VariantType.Long) : Variant.fromLong(0);

            result.asTimeSpan = (((value1.asLong * 24 + value2.asLong) * 60 + value3.asLong) * 60 + value4.asLong) * 1000 + value5.asLong;
        }
        
        return result;
    }

    private async nowFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 0);
        return Variant.fromDateTime(new Date());
    }

    private async dateFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        let paramCount = params.length;
        if (paramCount < 1 || paramCount > 7) {
            throw new ExpressionException(null, "WRONG_PARAM_COUNT", "Expected from 1 to 7 parameters");
        }

        if (paramCount == 1) {
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Long);
            return Variant.fromDateTime(new Date(value.asLong));
        }

        let value1 = variantOperations.convert(this.getParameter(params, 0), VariantType.Integer);
        let value2 = paramCount > 1 ? variantOperations.convert(this.getParameter(params, 1), VariantType.Integer) : Variant.fromInteger(1);
        let value3 = paramCount > 2 ? variantOperations.convert(this.getParameter(params, 2), VariantType.Integer) : Variant.fromInteger(1);
        let value4 = paramCount > 3 ? variantOperations.convert(this.getParameter(params, 3), VariantType.Integer) : Variant.fromInteger(0);
        let value5 = paramCount > 4 ? variantOperations.convert(this.getParameter(params, 4), VariantType.Integer) : Variant.fromInteger(0);
        let value6 = paramCount > 5 ? variantOperations.convert(this.getParameter(params, 5), VariantType.Integer) : Variant.fromInteger(0);
        let value7 = paramCount > 6 ? variantOperations.convert(this.getParameter(params, 6), VariantType.Integer) : Variant.fromInteger(0);

        let date = new Date(value1.asInteger, value2.asInteger-1, value3.asInteger,
            value4.asInteger, value5.asInteger, value6.asInteger, value7.asInteger);
        return Variant.fromDateTime(date);
    }

    private async dayOfWeekFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = variantOperations.convert(this.getParameter(params, 0), VariantType.DateTime);
        let date = value.asDateTime;
        return Variant.fromInteger(date.getDay());
    }

    private async minFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        let paramCount = params.length;
        if (paramCount < 2) {
            throw new ExpressionException(null, "WRONG_PARAM_COUNT",
                "Expected at least 2 parameters");
        }
        let result = this.getParameter(params, 0);
        for (let i = 1; i < paramCount; i++) {
            let value = this.getParameter(params, i);
            if (variantOperations.more(result, value).asBoolean) {
                result = value;
            }
        }
        return result;
    }

    private async maxFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        let paramCount = params.length;
        if (paramCount < 2) {
            throw new ExpressionException(null, "WRONG_PARAM_COUNT",
                "Expected at least 2 parameters");
        }
        let result = this.getParameter(params, 0);
        for (let i = 1; i < paramCount; i++) {
            let value = this.getParameter(params, i);
            if (variantOperations.less(result, value).asBoolean) {
                result = value;
            }
        }
        return result;
    }

    private async sumFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        let paramCount = params.length;
        if (paramCount < 2) {
            throw new ExpressionException(null, "WRONG_PARAM_COUNT",
                "Expected at least 2 parameters");
        }
        let result = this.getParameter(params, 0);
        for (let i = 1; i < paramCount; i++) {
            let value = this.getParameter(params, i);
            result = variantOperations.add(result, value);
        }
        return result;
    }

    private async ifFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 3);
        let value1 = this.getParameter(params, 0);
        let value2 = this.getParameter(params, 1);
        let value3 = this.getParameter(params, 2);
        let condition = variantOperations.convert(value1, VariantType.Boolean);
        return condition.asBoolean ? value2 : value3;
    }

    private async chooseFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        let paramCount = params.length;
        if (paramCount < 3) {
            throw new ExpressionException(null, "WRONG_PARAM_COUNT",
                "Expected at least 3 parameters");
        }

        let value1 = this.getParameter(params, 0);
        let condition = variantOperations.convert(value1, VariantType.Integer);
        let paramIndex = condition.asInteger;

        if (paramCount < paramIndex + 1) {
            throw new ExpressionException(null, "WRONG_PARAM_COUNT",
                "Expected at least " + (paramIndex + 1) + " parameters");
        }

        return this.getParameter(params, paramIndex);
    }

    private async eFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 0);
        return new Variant(Math.E);
    }

    private async piFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 0);
        return new Variant(Math.PI);
    }

    private async rndFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 0);
        return new Variant(Math.random());
    }

    private async absFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = this.getParameter(params, 0);
        let result = new Variant();
        switch (value.type) {
            case VariantType.Integer:
                result.asInteger = Math.abs(value.asInteger);
                break;
            case VariantType.Long:
                result.asLong = Math.abs(value.asLong);
                break;
            case VariantType.Float:
                result.asFloat = Math.abs(value.asFloat);
                break;
            case VariantType.Double:
                result.asDouble = Math.abs(value.asDouble);
                break;
            default:
                value = variantOperations.convert(value, VariantType.Double);
                result.asDouble = Math.abs(value.asDouble);
                break;
        }
        return result;
    }

    private async acosFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Double);
        return new Variant(Math.acos(value.asDouble));
    }

    private async asinFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Double);
        return new Variant(Math.asin(value.asDouble));
    }

    private async atanFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Double);
        return new Variant(Math.atan(value.asDouble));
    }

    private async expFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Double);
        return new Variant(Math.exp(value.asDouble));
    }

    private async logFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Double);
        return new Variant(Math.log(value.asDouble));
    }

    private async log10FunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Double);
        return new Variant(Math.log10(value.asDouble));
    }

    private async ceilFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Double);
        return new Variant(Math.ceil(value.asDouble));
    }

    private async floorFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Double);
        return new Variant(Math.floor(value.asDouble));
    }

    private async roundFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Double);
        return new Variant(Math.round(value.asDouble));
    }

    private async truncFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Double);
        return Variant.fromInteger(Math.trunc(value.asDouble));
    }

    private async cosFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Double);
        return new Variant(Math.cos(value.asDouble));
    }

    private async sinFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Double);
        return new Variant(Math.sin(value.asDouble));
    }

    private async tanFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Double);
        return new Variant(Math.tan(value.asDouble));
    }

    private async sqrtFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = variantOperations.convert(this.getParameter(params, 0), VariantType.Double);
        return new Variant(Math.sqrt(value.asDouble));
    }

    private async emptyFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 1);
        let value = this.getParameter(params, 0);
        return new Variant(value.isEmpty());
    }

    private async nullFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 0);
        return new Variant();
    }

    private async containsFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        this.checkParamCount(params, 2);
        let containerstr = variantOperations.convert(this.getParameter(params, 0), VariantType.String);
        let substring = variantOperations.convert(this.getParameter(params, 1), VariantType.String);

        if (containerstr.isEmpty() || containerstr.isNull()) {
            return Variant.fromBoolean(false);
        }

        return Variant.fromBoolean(containerstr.asString.indexOf(substring.asString) >= 0);
    }

    private async arrayFunctionCalculator(params: Variant[], variantOperations: IVariantOperations): Promise<Variant> {
        return Variant.fromArray(params);
    }

}