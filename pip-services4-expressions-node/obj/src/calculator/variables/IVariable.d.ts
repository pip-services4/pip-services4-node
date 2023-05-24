/** @module calculator */
import { Variant } from "../../variants/Variant";
/**
 * Defines a variable interface.
 */
export interface IVariable {
    /**
     * The variable name.
     */
    name: string;
    /**
     * The variable value.
     */
    value: Variant;
}
