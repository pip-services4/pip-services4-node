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
exports.DelegatedFunction = void 0;
/// <summary>
/// Defines an interface for expression function.
/// </summary>
class DelegatedFunction {
    /**
     * Constructs this function class with specified parameters.
     * @param name The name of this function.
     * @param calculator The function calculator delegate.
     */
    constructor(name, calculator, context) {
        if (name == null) {
            throw new Error("Name parameter cannot be null");
        }
        if (calculator == null) {
            throw new Error("Calculator parameter cannot be null");
        }
        this._name = name;
        this._calculator = calculator;
        this._context = context;
    }
    /**
     * The function name.
     */
    get name() {
        return this._name;
    }
    /**
     * The function calculation method.
     * @param params an array with function parameters.
     * @param variantOperations Variants operations manager.
     * @param callback a callback to return function result.
     */
    calculate(params, variantOperations) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._context == null) {
                return yield this._calculator(params, variantOperations);
            }
            else {
                return yield this._calculator.apply(this._context, [params, variantOperations]);
            }
        });
    }
}
exports.DelegatedFunction = DelegatedFunction;
//# sourceMappingURL=DelegatedFunction.js.map