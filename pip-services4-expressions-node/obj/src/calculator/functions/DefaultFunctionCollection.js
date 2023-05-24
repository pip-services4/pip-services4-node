"use strict";
/** @module calculator */
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
exports.DefaultFunctionCollection = void 0;
const FunctionCollection_1 = require("./FunctionCollection");
const DelegatedFunction_1 = require("./DelegatedFunction");
const Variant_1 = require("../../variants/Variant");
const VariantType_1 = require("../../variants/VariantType");
const ExpressionException_1 = require("../ExpressionException");
/**
 * Implements a list filled with standard functions.
 */
class DefaultFunctionCollection extends FunctionCollection_1.FunctionCollection {
    /**
     * Constructs this list and fills it with the standard functions.
     */
    constructor() {
        super();
        this.add(new DelegatedFunction_1.DelegatedFunction("Ticks", this.ticksFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("TimeSpan", this.timeSpanFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Now", this.nowFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Date", this.dateFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("DayOfWeek", this.dayOfWeekFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Min", this.minFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Max", this.maxFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Sum", this.sumFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("If", this.ifFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Choose", this.chooseFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("E", this.eFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Pi", this.piFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Rnd", this.rndFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Random", this.rndFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Abs", this.absFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Acos", this.acosFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Asin", this.asinFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Atan", this.atanFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Exp", this.expFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Log", this.logFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Ln", this.logFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Log10", this.log10FunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Ceil", this.ceilFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Ceiling", this.ceilFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Floor", this.floorFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Round", this.roundFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Trunc", this.truncFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Truncate", this.truncFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Cos", this.cosFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Sin", this.sinFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Tan", this.tanFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Sqr", this.sqrtFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Sqrt", this.sqrtFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Empty", this.emptyFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Null", this.nullFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Contains", this.containsFunctionCalculator, this));
        this.add(new DelegatedFunction_1.DelegatedFunction("Array", this.arrayFunctionCalculator, this));
    }
    /**
     * Checks if params contains the correct number of function parameters (must be stored on the top of the params).
     * @param params A list of function parameters.
     * @param expectedParamCount The expected number of function parameters.
     */
    checkParamCount(params, expectedParamCount) {
        let paramCount = params.length;
        if (expectedParamCount != paramCount) {
            throw new ExpressionException_1.ExpressionException(null, "WRONG_PARAM_COUNT", "Expected " + expectedParamCount
                + " parameters but was found " + paramCount);
        }
    }
    /**
     * Gets function parameter by it's index.
     * @param params A list of function parameters.
     * @param paramIndex Index for the function parameter (0 for the first parameter).
     * @returns Function parameter value.
     */
    getParameter(params, paramIndex) {
        return params[paramIndex];
    }
    ticksFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 0);
            return Variant_1.Variant.fromLong(new Date().getTime());
        });
    }
    timeSpanFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            let paramCount = params.length;
            if (paramCount != 1 && paramCount != 3 && paramCount != 4 && paramCount != 5) {
                throw new ExpressionException_1.ExpressionException(null, "WRONG_PARAM_COUNT", "Expected 1, 3, 4 or 5 parameters");
            }
            let result = new Variant_1.Variant();
            if (paramCount == 1) {
                let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Long);
                result.asTimeSpan = value.asLong;
            }
            else if (paramCount > 2) {
                let value1 = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Long);
                let value2 = variantOperations.convert(this.getParameter(params, 1), VariantType_1.VariantType.Long);
                let value3 = variantOperations.convert(this.getParameter(params, 2), VariantType_1.VariantType.Long);
                let value4 = paramCount > 3 ? variantOperations.convert(this.getParameter(params, 3), VariantType_1.VariantType.Long) : Variant_1.Variant.fromLong(0);
                let value5 = paramCount > 4 ? variantOperations.convert(this.getParameter(params, 4), VariantType_1.VariantType.Long) : Variant_1.Variant.fromLong(0);
                result.asTimeSpan = (((value1.asLong * 24 + value2.asLong) * 60 + value3.asLong) * 60 + value4.asLong) * 1000 + value5.asLong;
            }
            return result;
        });
    }
    nowFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 0);
            return Variant_1.Variant.fromDateTime(new Date());
        });
    }
    dateFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            let paramCount = params.length;
            if (paramCount < 1 || paramCount > 7) {
                throw new ExpressionException_1.ExpressionException(null, "WRONG_PARAM_COUNT", "Expected from 1 to 7 parameters");
            }
            if (paramCount == 1) {
                let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Long);
                return Variant_1.Variant.fromDateTime(new Date(value.asLong));
            }
            let value1 = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Integer);
            let value2 = paramCount > 1 ? variantOperations.convert(this.getParameter(params, 1), VariantType_1.VariantType.Integer) : Variant_1.Variant.fromInteger(1);
            let value3 = paramCount > 2 ? variantOperations.convert(this.getParameter(params, 2), VariantType_1.VariantType.Integer) : Variant_1.Variant.fromInteger(1);
            let value4 = paramCount > 3 ? variantOperations.convert(this.getParameter(params, 3), VariantType_1.VariantType.Integer) : Variant_1.Variant.fromInteger(0);
            let value5 = paramCount > 4 ? variantOperations.convert(this.getParameter(params, 4), VariantType_1.VariantType.Integer) : Variant_1.Variant.fromInteger(0);
            let value6 = paramCount > 5 ? variantOperations.convert(this.getParameter(params, 5), VariantType_1.VariantType.Integer) : Variant_1.Variant.fromInteger(0);
            let value7 = paramCount > 6 ? variantOperations.convert(this.getParameter(params, 6), VariantType_1.VariantType.Integer) : Variant_1.Variant.fromInteger(0);
            let date = new Date(value1.asInteger, value2.asInteger - 1, value3.asInteger, value4.asInteger, value5.asInteger, value6.asInteger, value7.asInteger);
            return Variant_1.Variant.fromDateTime(date);
        });
    }
    dayOfWeekFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.DateTime);
            let date = value.asDateTime;
            return Variant_1.Variant.fromInteger(date.getDay());
        });
    }
    minFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            let paramCount = params.length;
            if (paramCount < 2) {
                throw new ExpressionException_1.ExpressionException(null, "WRONG_PARAM_COUNT", "Expected at least 2 parameters");
            }
            let result = this.getParameter(params, 0);
            for (let i = 1; i < paramCount; i++) {
                let value = this.getParameter(params, i);
                if (variantOperations.more(result, value).asBoolean) {
                    result = value;
                }
            }
            return result;
        });
    }
    maxFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            let paramCount = params.length;
            if (paramCount < 2) {
                throw new ExpressionException_1.ExpressionException(null, "WRONG_PARAM_COUNT", "Expected at least 2 parameters");
            }
            let result = this.getParameter(params, 0);
            for (let i = 1; i < paramCount; i++) {
                let value = this.getParameter(params, i);
                if (variantOperations.less(result, value).asBoolean) {
                    result = value;
                }
            }
            return result;
        });
    }
    sumFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            let paramCount = params.length;
            if (paramCount < 2) {
                throw new ExpressionException_1.ExpressionException(null, "WRONG_PARAM_COUNT", "Expected at least 2 parameters");
            }
            let result = this.getParameter(params, 0);
            for (let i = 1; i < paramCount; i++) {
                let value = this.getParameter(params, i);
                result = variantOperations.add(result, value);
            }
            return result;
        });
    }
    ifFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 3);
            let value1 = this.getParameter(params, 0);
            let value2 = this.getParameter(params, 1);
            let value3 = this.getParameter(params, 2);
            let condition = variantOperations.convert(value1, VariantType_1.VariantType.Boolean);
            return condition.asBoolean ? value2 : value3;
        });
    }
    chooseFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            let paramCount = params.length;
            if (paramCount < 3) {
                throw new ExpressionException_1.ExpressionException(null, "WRONG_PARAM_COUNT", "Expected at least 3 parameters");
            }
            let value1 = this.getParameter(params, 0);
            let condition = variantOperations.convert(value1, VariantType_1.VariantType.Integer);
            let paramIndex = condition.asInteger;
            if (paramCount < paramIndex + 1) {
                throw new ExpressionException_1.ExpressionException(null, "WRONG_PARAM_COUNT", "Expected at least " + (paramIndex + 1) + " parameters");
            }
            return this.getParameter(params, paramIndex);
        });
    }
    eFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 0);
            return new Variant_1.Variant(Math.E);
        });
    }
    piFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 0);
            return new Variant_1.Variant(Math.PI);
        });
    }
    rndFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 0);
            return new Variant_1.Variant(Math.random());
        });
    }
    absFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = this.getParameter(params, 0);
            let result = new Variant_1.Variant();
            switch (value.type) {
                case VariantType_1.VariantType.Integer:
                    result.asInteger = Math.abs(value.asInteger);
                    break;
                case VariantType_1.VariantType.Long:
                    result.asLong = Math.abs(value.asLong);
                    break;
                case VariantType_1.VariantType.Float:
                    result.asFloat = Math.abs(value.asFloat);
                    break;
                case VariantType_1.VariantType.Double:
                    result.asDouble = Math.abs(value.asDouble);
                    break;
                default:
                    value = variantOperations.convert(value, VariantType_1.VariantType.Double);
                    result.asDouble = Math.abs(value.asDouble);
                    break;
            }
            return result;
        });
    }
    acosFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Double);
            return new Variant_1.Variant(Math.acos(value.asDouble));
        });
    }
    asinFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Double);
            return new Variant_1.Variant(Math.asin(value.asDouble));
        });
    }
    atanFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Double);
            return new Variant_1.Variant(Math.atan(value.asDouble));
        });
    }
    expFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Double);
            return new Variant_1.Variant(Math.exp(value.asDouble));
        });
    }
    logFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Double);
            return new Variant_1.Variant(Math.log(value.asDouble));
        });
    }
    log10FunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Double);
            return new Variant_1.Variant(Math.log10(value.asDouble));
        });
    }
    ceilFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Double);
            return new Variant_1.Variant(Math.ceil(value.asDouble));
        });
    }
    floorFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Double);
            return new Variant_1.Variant(Math.floor(value.asDouble));
        });
    }
    roundFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Double);
            return new Variant_1.Variant(Math.round(value.asDouble));
        });
    }
    truncFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Double);
            return Variant_1.Variant.fromInteger(Math.trunc(value.asDouble));
        });
    }
    cosFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Double);
            return new Variant_1.Variant(Math.cos(value.asDouble));
        });
    }
    sinFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Double);
            return new Variant_1.Variant(Math.sin(value.asDouble));
        });
    }
    tanFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Double);
            return new Variant_1.Variant(Math.tan(value.asDouble));
        });
    }
    sqrtFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.Double);
            return new Variant_1.Variant(Math.sqrt(value.asDouble));
        });
    }
    emptyFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 1);
            let value = this.getParameter(params, 0);
            return new Variant_1.Variant(value.isEmpty());
        });
    }
    nullFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 0);
            return new Variant_1.Variant();
        });
    }
    containsFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkParamCount(params, 2);
            let containerstr = variantOperations.convert(this.getParameter(params, 0), VariantType_1.VariantType.String);
            let substring = variantOperations.convert(this.getParameter(params, 1), VariantType_1.VariantType.String);
            if (containerstr.isEmpty() || containerstr.isNull()) {
                return Variant_1.Variant.fromBoolean(false);
            }
            return Variant_1.Variant.fromBoolean(containerstr.asString.indexOf(substring.asString) >= 0);
        });
    }
    arrayFunctionCalculator(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            return Variant_1.Variant.fromArray(params);
        });
    }
}
exports.DefaultFunctionCollection = DefaultFunctionCollection;
//# sourceMappingURL=DefaultFunctionCollection.js.map