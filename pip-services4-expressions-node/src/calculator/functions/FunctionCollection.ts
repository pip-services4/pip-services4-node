/** @module calculator */

import { IFunction } from "./IFunction";
import { IFunctionCollection } from "./IFunctionCollection";

/**
 * Implements a functions list.
 */
export class FunctionCollection implements IFunctionCollection {
    private _functions: IFunction[] = [];

    /**
     * Adds a new function to the collection.
     * @param function a function to be added.
     */
    public add(func: IFunction): void {
        if (func == null) {
            throw new Error("Func cannot be null");
        }
        this._functions.push(func);
    }

    /**
     * Gets a number of functions stored in the collection.
     * @returns a number of stored functions.
     */
    public get length(): number {
        return this._functions.length;
    }

    /**
     * Get a function by its index.
     * @param index a function index.
     * @returns a retrieved function.
     */
    public get(index: number): IFunction {
        return this._functions[index];
    }

    /**
     * Get all functions stores in the collection
     * @returns a list with functions.
     */
    public getAll(): IFunction[] {
        let result: IFunction[] = [];
        result.push(...this._functions);
        return result;
    }

    /**
     * Finds function index in the list by it's name. 
     * @param name The function name to be found.
     * @returns Function index in the list or <code>-1</code> if function was not found.
     */
    public findIndexByName(name: string): number {
        name = name.toUpperCase();
        for (let i = 0; i < this._functions.length; i++) {
            let varName = this._functions[i].name.toUpperCase();
            if (varName == name) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Finds function in the list by it's name.
     * @param name The function name to be found.
     * @returns A function or <code>null</code> if function was not found.
     */
    public findByName(name: string): IFunction {
        let index = this.findIndexByName(name);
        return index >= 0 ? this._functions[index] : null;
    }

    /**
     * Removes a function by its index.
     * @param index a index of the function to be removed.
     */
    public remove(index: number): void {
        this._functions.splice(index, 1);
    }

    /**
     * Removes function by it's name.
     * @param name The function name to be removed.
     */
    public removeByName(name: string): void {
        let index = this.findIndexByName(name);
        if (index >= 0) {
            this.remove(index);
        }
    }

    /**
     * Clears the collection.
     */
    public clear(): void {
        this._functions = [];
    }
}