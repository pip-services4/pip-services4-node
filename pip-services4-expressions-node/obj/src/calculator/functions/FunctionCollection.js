"use strict";
/** @module calculator */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionCollection = void 0;
/**
 * Implements a functions list.
 */
class FunctionCollection {
    constructor() {
        this._functions = [];
    }
    /**
     * Adds a new function to the collection.
     * @param function a function to be added.
     */
    add(func) {
        if (func == null) {
            throw new Error("Func cannot be null");
        }
        this._functions.push(func);
    }
    /**
     * Gets a number of functions stored in the collection.
     * @returns a number of stored functions.
     */
    get length() {
        return this._functions.length;
    }
    /**
     * Get a function by its index.
     * @param index a function index.
     * @returns a retrieved function.
     */
    get(index) {
        return this._functions[index];
    }
    /**
     * Get all functions stores in the collection
     * @returns a list with functions.
     */
    getAll() {
        let result = [];
        result.push(...this._functions);
        return result;
    }
    /**
     * Finds function index in the list by it's name.
     * @param name The function name to be found.
     * @returns Function index in the list or <code>-1</code> if function was not found.
     */
    findIndexByName(name) {
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
    findByName(name) {
        let index = this.findIndexByName(name);
        return index >= 0 ? this._functions[index] : null;
    }
    /**
     * Removes a function by its index.
     * @param index a index of the function to be removed.
     */
    remove(index) {
        this._functions.splice(index, 1);
    }
    /**
     * Removes function by it's name.
     * @param name The function name to be removed.
     */
    removeByName(name) {
        let index = this.findIndexByName(name);
        if (index >= 0) {
            this.remove(index);
        }
    }
    /**
     * Clears the collection.
     */
    clear() {
        this._functions = [];
    }
}
exports.FunctionCollection = FunctionCollection;
//# sourceMappingURL=FunctionCollection.js.map