/** @module run */
import { IContext } from "../context/IContext";
/**
 * Helper class that cleans stored object state.
 *
 * @see [[ICleanable]]
 */
export declare class Cleaner {
    /**
     * Clears state of specific component.
     *
     * To be cleaned state components must implement [[ICleanable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     * @param component 		the component that is to be cleaned.
     *
     * @see [[ICleanable]]
     */
    static clearOne(context: IContext, component: any): Promise<void>;
    /**
     * Clears state of multiple components.
     *
     * To be cleaned state components must implement [[ICleanable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     * @param components 		the list of components that are to be cleaned.
     *
     * @see [[clearOne]]
     * @see [[ICleanable]]
     */
    static clear(context: IContext, components: any[]): Promise<void>;
}
