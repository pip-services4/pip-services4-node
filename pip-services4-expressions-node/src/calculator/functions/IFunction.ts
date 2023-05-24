/** @module calculator */

import { Variant } from "../../variants/Variant";
import { IVariantOperations } from "../../variants/IVariantOperations";

/**
 * Defines an interface for expression function.
 */
export interface IFunction {
    /**
     * The function name.
     */
    name: string;

    /**
     * The function calculation method.
     * @param stack The stack to get function parameters and place
     * @param variantOperations Variants operations manager.
     * @returns the function result.
     */
    calculate(params: Variant[], variantOperations: IVariantOperations): Promise<Variant>;
}
