/** @module calculator */

import { Variant } from "../../variants/Variant";
import { IVariantOperations } from "../../variants/IVariantOperations";
import { IFunction } from "./IFunction";

/**
 * Defines a delegate to implement a function
 */
export type FunctionCalculator = (params: Variant[], variantOperations: IVariantOperations) => Promise<Variant>;

/// <summary>
/// Defines an interface for expression function.
/// </summary>
export class DelegatedFunction implements IFunction {
    private _name: string;
    private _calculator: FunctionCalculator;
    private _context: any;

    /**
     * Constructs this function class with specified parameters.
     * @param name The name of this function.
     * @param calculator The function calculator delegate.
     */
    public constructor(name: string, calculator: FunctionCalculator, context?: any) {
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
    public get name(): string {
        return this._name;
    }

    /**
     * The function calculation method.
     * @param params an array with function parameters.
     * @param variantOperations Variants operations manager.
     * @param callback a callback to return function result.
     */
    public async calculate(params: Variant[], variantOperations: IVariantOperations): Promise<Variant>  {
        if (this._context == null) { 
            return await this._calculator(params, variantOperations);
        } else {
            return await this._calculator.apply(this._context, [params, variantOperations]);
        }
    }
}