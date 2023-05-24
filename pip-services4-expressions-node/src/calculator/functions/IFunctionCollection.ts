/** @module calculator */

import { IFunction } from "./IFunction";

/**
 * Defines a functions list.
 */
export interface IFunctionCollection {
    /**
     * Adds a new function to the collection.
     * @param function a function to be added.
     */
    add(func: IFunction): void;

    /**
     * Gets a number of functions stored in the collection.
     * @returns a number of stored functions.
     */
    length: number;

    /**
     * Get a function by its index.
     * @param index a function index.
     * @returns a retrieved function.
     */
    get(index: number): IFunction;

    /**
     * Get all functions stores in the collection
     * @returns a list with functions.
     */
    getAll(): IFunction[];

    /**
     * Finds function index in the list by it's name. 
     * @param name The function name to be found.
     * @returns Function index in the list or <code>-1</code> if function was not found.
     */
    findIndexByName(name: string): number;

    /**
     * Finds function in the list by it's name.
     * @param name The function name to be found.
     * @returns A function or <code>null</code> if function was not found.
     */
    findByName(name: string): IFunction;

    /**
     * Removes a function by its index.
     * @param index a index of the function to be removed.
     */
    remove(index: number): void;

    /**
     * Removes function by it's name.
     * @param name The function name to be removed.
     */
    removeByName(name: string): void;

    /**
     * Clears the collection.
     */
    clear(): void;
}