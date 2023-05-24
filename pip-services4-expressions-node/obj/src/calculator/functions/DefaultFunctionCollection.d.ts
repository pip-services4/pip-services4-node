/** @module calculator */
import { FunctionCollection } from "./FunctionCollection";
import { Variant } from "../../variants/Variant";
/**
 * Implements a list filled with standard functions.
 */
export declare class DefaultFunctionCollection extends FunctionCollection {
    /**
     * Constructs this list and fills it with the standard functions.
     */
    constructor();
    /**
     * Checks if params contains the correct number of function parameters (must be stored on the top of the params).
     * @param params A list of function parameters.
     * @param expectedParamCount The expected number of function parameters.
     */
    protected checkParamCount(params: Variant[], expectedParamCount: number): void;
    /**
     * Gets function parameter by it's index.
     * @param params A list of function parameters.
     * @param paramIndex Index for the function parameter (0 for the first parameter).
     * @returns Function parameter value.
     */
    protected getParameter(params: Variant[], paramIndex: number): Variant;
    private ticksFunctionCalculator;
    private timeSpanFunctionCalculator;
    private nowFunctionCalculator;
    private dateFunctionCalculator;
    private dayOfWeekFunctionCalculator;
    private minFunctionCalculator;
    private maxFunctionCalculator;
    private sumFunctionCalculator;
    private ifFunctionCalculator;
    private chooseFunctionCalculator;
    private eFunctionCalculator;
    private piFunctionCalculator;
    private rndFunctionCalculator;
    private absFunctionCalculator;
    private acosFunctionCalculator;
    private asinFunctionCalculator;
    private atanFunctionCalculator;
    private expFunctionCalculator;
    private logFunctionCalculator;
    private log10FunctionCalculator;
    private ceilFunctionCalculator;
    private floorFunctionCalculator;
    private roundFunctionCalculator;
    private truncFunctionCalculator;
    private cosFunctionCalculator;
    private sinFunctionCalculator;
    private tanFunctionCalculator;
    private sqrtFunctionCalculator;
    private emptyFunctionCalculator;
    private nullFunctionCalculator;
    private containsFunctionCalculator;
    private arrayFunctionCalculator;
}
